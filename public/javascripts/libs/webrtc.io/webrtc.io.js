define(function () {

    var PeerConnection = (window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);
    var URL = (window.URL || window.webkitURL || window.msURL || window.oURL);
    var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    var nativeRTCIceCandidate = (window.mozRTCIceCandidate || window.RTCIceCandidate);
    var nativeRTCSessionDescription = (window.mozRTCSessionDescription || window.RTCSessionDescription); // order is very important: "RTCSessionDescription" defined in Nighly but useless

    var sdpConstraints = {
        'mandatory': {
            'OfferToReceiveAudio': true,
            'OfferToReceiveVideo': true
        }
    };

    if (navigator.webkitGetUserMedia) {
        if (!webkitMediaStream.prototype.getVideoTracks) {
            webkitMediaStream.prototype.getVideoTracks = function () {
                return this.videoTracks;
            };
            webkitMediaStream.prototype.getAudioTracks = function () {
                return this.audioTracks;
            };
        }

        // New syntax of getXXXStreams method in M26.
        if (!webkitRTCPeerConnection.prototype.getLocalStreams) {
            webkitRTCPeerConnection.prototype.getLocalStreams = function () {
                return this.localStreams;
            };
            webkitRTCPeerConnection.prototype.getRemoteStreams = function () {
                return this.remoteStreams;
            };
        }
    }

    function preferOpus(sdp) {
        var sdpLines = sdp.split('\r\n');
        var mLineIndex = null;
        // Search for m line.
        for (var i = 0; i < sdpLines.length; i++) {
            if (sdpLines[i].search('m=audio') !== -1) {
                mLineIndex = i;
                break;
            }
        }
        if (mLineIndex === null) return sdp;

        // If Opus is available, set it as the default in m line.
        for (var j = 0; j < sdpLines.length; j++) {
            if (sdpLines[j].search('opus/48000') !== -1) {
                var opusPayload = extractSdp(sdpLines[j], /:(\d+) opus\/48000/i);
                if (opusPayload) sdpLines[mLineIndex] = setDefaultCodec(sdpLines[mLineIndex], opusPayload);
                break;
            }
        }

        // Remove CN in m line and sdp.
        sdpLines = removeCN(sdpLines, mLineIndex);

        sdp = sdpLines.join('\r\n');
        return sdp;
    }

    function extractSdp(sdpLine, pattern) {
        var result = sdpLine.match(pattern);
        return (result && result.length == 2) ? result[1] : null;
    }

    function setDefaultCodec(mLine, payload) {
        var elements = mLine.split(' ');
        var newLine = [];
        var index = 0;
        for (var i = 0; i < elements.length; i++) {
            if (index === 3) // Format of media starts from the fourth.
                newLine[index++] = payload; // Put target payload to the first.
            if (elements[i] !== payload) newLine[index++] = elements[i];
        }
        return newLine.join(' ');
    }

    function removeCN(sdpLines, mLineIndex) {
        var mLineElements = sdpLines[mLineIndex].split(' ');
        // Scan from end for the convenience of removing an item.
        for (var i = sdpLines.length - 1; i >= 0; i--) {
            var payload = extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
            if (payload) {
                var cnPos = mLineElements.indexOf(payload);
                if (cnPos !== -1) {
                    // Remove CN payload from m line.
                    mLineElements.splice(cnPos, 1);
                }
                // Remove CN line in sdp
                sdpLines.splice(i, 1);
            }
        }

        sdpLines[mLineIndex] = mLineElements.join(' ');
        return sdpLines;
    }

    function mergeConstraints(cons1, cons2) {
        var merged = cons1;
        for (var name in cons2.mandatory) {
            merged.mandatory[name] = cons2.mandatory[name];
        }
        merged.optional.concat(cons2.optional);
        return merged;
    }


    var RTC = function () {
        this._socket = null;

        // Holds identity for the client
        this._me = null;

        // Holds callbacks for certain events.
        this._events = {};

        // Reference to the lone PeerConnection instance.
        this.peerConnections = {};

        // Array of known peer socket ids
        this.connections = [];
        // Stream-related variables.
        this.streams = [];
        this.numStreams = 0;
        this.initializedStreams = 0;


        // Reference to the data channels
        this.dataChannels = {};

        // PeerConnection datachannel configuration
        this.dataChannelConfig = {
            "optional": [
                {
                    "RtpDataChannels": true
                },
                {
                    "DtlsSrtpKeyAgreement": true
                }
            ]
        };

        this.pc_constraints = {
            "optional": [
                {
                    "DtlsSrtpKeyAgreement": true
                }
            ]
        };

        this.checkDataChannelSupport = function () {
            try {
                // raises exception if createDataChannel is not supported
                var pc = new PeerConnection(rtc.SERVER(), rtc.dataChannelConfig);
                var channel = pc.createDataChannel('supportCheck', {
                    reliable: false
                });
                channel.close();
                return true;
            } catch (e) {
                return false;
            }
        };

        this.dataChannelSupport = this.checkDataChannelSupport();

        this.on('ready', function() {
            this.createPeerConnections();
            this.addStreams();
            this.addDataChannels();
            this.sendOffers();
        });
    };

    RTC.prototype.on = function(eventName, callback) {
        this._events[eventName] = this._events[eventName] || [];
        this._events[eventName].push(callback);
    };

    RTC.prototype.fire = function(eventName, _) {
        var events = this._events[eventName];
        var args = Array.prototype.slice.call(arguments, 1);

        if (!events) {
            return;
        }

        for (var i = 0, len = events.length; i < len; i++) {
            events[i].apply(this, args);
        }
    };

    RTC.SERVER = function() {
        if (navigator.mozGetUserMedia) {
            return {
                "iceServers": [{
                    "url": "stun:23.21.150.121"
                }]
            };
        }
        return {
            "iceServers": [{
                "url": "stun:stun.l.google.com:19302"
            }]
        };
    };

    RTC.prototype.connect = function (server, room) {
        room = room || ""; // by default, join a room called the blank string
        this._socket = new WebSocket(server);

        var rtc = this;

        this._socket.onopen = function () {

            rtc._socket.send(JSON.stringify({
                "eventName": "join_room",
                "data": {
                    "room": room
                }
            }));

            rtc._socket.onmessage = function (msg) {
                var json = JSON.parse(msg.data);
                rtc.fire(json.eventName, json.data);
            };

            rtc._socket.onerror = function (err) {
                console.error('onerror');
                console.error(err);
            };

            rtc._socket.onclose = function (data) {
                rtc.fire('disconnect stream', rtc._socket.id);
                delete rtc.peerConnections[rtc._socket.id];
            };

            rtc.on('get_peers', function (data) {
                rtc.connections = data.connections;
                rtc._me = data.you;
                // fire connections event and pass peers
                rtc.fire('connections', rtc.connections);
            });

            rtc.on('receive_ice_candidate', function (data) {
                var candidate = new nativeRTCIceCandidate(data);
                rtc.peerConnections[data.socketId].addIceCandidate(candidate);
                rtc.fire('receive ice candidate', candidate);
            });

            rtc.on('new_peer_connected', function (data) {
                rtc.connections.push(data.socketId);

                var pc = rtc.createPeerConnection(data.socketId);
                for (var i = 0; i < rtc.streams.length; i++) {
                    var stream = rtc.streams[i];
                    pc.addStream(stream);
                }
            });

            rtc.on('remove_peer_connected', function (data) {
                rtc.fire('disconnect stream', data.socketId);
                delete rtc.peerConnections[data.socketId];
            });

            rtc.on('receive_offer', function (data) {
                rtc.receiveOffer(data.socketId, data.sdp);
                rtc.fire('receive offer', data);
            });

            rtc.on('receive_answer', function (data) {
                rtc.receiveAnswer(data.socketId, data.sdp);
                rtc.fire('receive answer', data);
            });

            rtc.fire('connect');
        };

    };

    RTC.prototype.close = function() {
        this.stopStream();
        this._socket.close();
    }

    RTC.prototype.sendOffers = function () {
        for (var i = 0, len = this.connections.length; i < len; i++) {
            var socketId = this.connections[i];
            this.sendOffer(socketId);
        }
    };

    RTC.prototype.onClose = function (data) {
        var rtc = this;
        this.on('close_stream', function () {
            rtc.fire('close_stream', data);
        });
    };

    RTC.prototype.createPeerConnections = function () {
        for (var i = 0; i < this.connections.length; i++) {
            this.createPeerConnection(this.connections[i]);
        }
    };

    RTC.prototype.createPeerConnection = function(id) {

        var config = this.pc_constraints;
        if (this.dataChannelSupport) config = this.dataChannelConfig;

        var pc = this.peerConnections[id] = new PeerConnection(RTC.SERVER(), config);
        var rtc = this;

        pc.onicecandidate = function(event) {
            if (event.candidate) {
                rtc._socket.send(JSON.stringify({
                    "eventName": "send_ice_candidate",
                    "data": {
                        "label": event.candidate.sdpMLineIndex,
                        "candidate": event.candidate.candidate,
                        "socketId": id
                    }
                }));
            }
            rtc.fire('ice candidate', event.candidate);
        };

        pc.onopen = function() {
            // TODO: Finalize this API
            rtc.fire('peer connection opened');
        };

        pc.onaddstream = function(event) {
            // TODO: Finalize this API
            rtc.fire('add remote stream', event.stream, id);
        };

        if (this.dataChannelSupport) {
            pc.ondatachannel = function(evt) {
                console.log('data channel connecting ' + id);
                rtc.addDataChannel(id, evt.channel);
            };
        }

        return pc;
    };

    RTC.prototype.sendOffer = function(socketId) {
        var pc = this.peerConnections[socketId];

        var constraints = {
            "optional": [],
            "mandatory": {
                "MozDontOfferDataChannel": true
            }
        };
        // temporary measure to remove Moz* constraints in Chrome
        if (navigator.webkitGetUserMedia) {
            for (var prop in constraints.mandatory) {
                if (prop.indexOf("Moz") != -1) {
                    delete constraints.mandatory[prop];
                }
            }
        }
        constraints = mergeConstraints(constraints, sdpConstraints);

        var rtc = this;

        pc.createOffer(function(session_description) {
            session_description.sdp = preferOpus(session_description.sdp);
            pc.setLocalDescription(session_description);
            rtc._socket.send(JSON.stringify({
                "eventName": "send_offer",
                "data": {
                    "socketId": socketId,
                    "sdp": session_description
                }
            }));
        }, null, sdpConstraints);
    };

    RTC.prototype.receiveOffer = function(socketId, sdp) {
        var pc = this.peerConnections[socketId];
        this.sendAnswer(socketId, sdp);
    };

    RTC.prototype.sendAnswer = function(socketId, sdp) {
        var pc = this.peerConnections[socketId];
        var rtc = this;
        pc.setRemoteDescription(new nativeRTCSessionDescription(sdp));
        pc.createAnswer(function(session_description) {
            pc.setLocalDescription(session_description);
            rtc._socket.send(JSON.stringify({
                "eventName": "send_answer",
                "data": {
                    "socketId": socketId,
                    "sdp": session_description
                }
            }));
            //TODO Unused variable!?
            var offer = pc.remoteDescription;
        }, null, sdpConstraints);
    };

    RTC.prototype.receiveAnswer = function(socketId, sdp) {
        var pc = this.peerConnections[socketId];
        pc.setRemoteDescription(new nativeRTCSessionDescription(sdp));
    };

    RTC.prototype.createStream = function(opt, onSuccess, onFail) {
        var options;
        onSuccess = onSuccess || function() {};
        onFail = onFail || function() {};

        options = opt;

        if (getUserMedia) {
            this.numStreams++;
            var rtc = this;
            getUserMedia.call(navigator, options, function(stream) {

                rtc.streams.push(stream);
                rtc.initializedStreams++;
                onSuccess(stream);

                rtc.stopStream = function() {
                    stream.stop();
                }

                if (rtc.initializedStreams === rtc.numStreams) {
                    rtc.fire('ready');
                }
            }, function() {
                alert("Could not connect stream.");
                onFail();
            });
        } else {
            alert('webRTC is not yet supported in this browser.');
        }
    };

    RTC.prototype.addStreams = function() {
        for (var i = 0; i < this.streams.length; i++) {
            var stream = this.streams[i];
            for (var connection in this.peerConnections) {
                this.peerConnections[connection].addStream(stream);
            }
        }
    };

    RTC.prototype.attachStream = function(stream, domId) {
        var element = document.getElementById(domId);
        if (navigator.mozGetUserMedia) {
            console.log("Attaching media stream");
            element.mozSrcObject = stream;
            element.play();
        } else {
            element.src = webkitURL.createObjectURL(stream);
            element.play();
        }
    };

    RTC.prototype.createDataChannel = function(pcOrId, label) {
        if (!this.dataChannelSupport) {
            //TODO this should be an exception
            alert('webRTC data channel is not yet supported in this browser,' +
                ' or you must turn on experimental flags');
            return;
        }

        var id, pc;
        if (typeof(pcOrId) === 'string') {
            id = pcOrId;
            pc = this.peerConnections[pcOrId];
        } else {
            pc = pcOrId;
            id = undefined;
            for (var key in this.peerConnections) {
                if (this.peerConnections[key] === pc) id = key;
            }
        }

        if (!id) throw new Error('attempt to createDataChannel with unknown id');

        if (!pc || !(pc instanceof PeerConnection)) throw new Error('attempt to createDataChannel without peerConnection');

        // need a label
        label = label || 'fileTransfer' || String(id);

        // chrome only supports reliable false atm.
        var options = {
            reliable: false
        };

        var channel;
        try {
            console.log('createDataChannel ' + id);
            channel = pc.createDataChannel(label, options);
        } catch (error) {
            console.log('seems that DataChannel is NOT actually supported!');
            throw error;
        }

        return this.addDataChannel(id, channel);
    };

    RTC.prototype.addDataChannel = function(id, channel) {
        var rtc = this;

        channel.onopen = function() {
            console.log('data stream open ' + id);
            rtc.fire('data stream open', channel);
        };

        channel.onclose = function(event) {
            delete rtc.dataChannels[id];
            console.log('data stream close ' + id);
            rtc.fire('data stream close', channel);
        };

        channel.onmessage = function(message) {
            console.log('data stream message ' + id);
            console.log(message);
            rtc.fire('data stream data', channel, message.data);
        };

        channel.onerror = function(err) {
            console.log('data stream error ' + id + ': ' + err);
            rtc.fire('data stream error', channel, err);
        };

        // track dataChannel
        this.dataChannels[id] = channel;
        return channel;
    };

    RTC.prototype.addDataChannels = function() {
        if (!this.dataChannelSupport) return;

        for (var connection in this.peerConnections)
            this.createDataChannel(connection);
    };

    return RTC;
});