define(["jquery-ui", "webrtc.io"], function($, RTC) {

    var rtc_audio = new RTC();
    var audioON = false;

    rtc_audio.connect("ws://" + window.location.hostname + ":9000", "course01-audio");
    rtc_audio.createStream({
        audio: true,
        video: false
    }, function (stream) {
        var audioTracks = stream.getAudioTracks();

        rtc_audio.toggle = function () {
            for (var i = 0, l = audioTracks.length; i < l; i++) {
                audioTracks[i].enabled = !audioTracks[i].enabled;
            }
            audioON = !audioON;
        };

        for (var i = 0, l = audioTracks.length; i < l; i++) {
            audioTracks[i].enabled = audioON;
        }
    });

    $('.volume').click(function () {
        rtc_audio.toggle();

        if(audioON) {
            $(this).button({
                icons: {
                    primary: "ui-icon-volume-on"
                }
            });
        } else {
            $(this).button({
                icons: {
                    primary: "ui-icon-volume-off"
                }
            });
        }
    });

});