define(function () {
    var moz = false;

    var user_media = {
        start: function (options) {
            var n = navigator,
                media;
            n.getMedia = n.webkitGetUserMedia || n.mozGetUserMedia;
            n.getMedia(options.constraints, streaming, function (e) {
                console.error(e);
            });

            function streaming(stream) {
                var player = options.player;
                if (player) {
                    player[moz ? 'mozSrcObject' : 'src'] = moz ? stream : window.webkitURL.createObjectURL(stream);
                    player.play();
                    player.stop = function() {
                        stream.stop();
                    }
                }
                options.onsuccess && options.onsuccess(stream, player);
                media = stream;
            }

            return media;
        },

        stop: function (player) {
            if (player) {
                player.stop();
            }
        }

    }

    return user_media;
})
;