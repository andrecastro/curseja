define(["backbone", "text!templates/screen_share_tmp.html", "webrtc.io"],
    function (Backbone, screen_share_tmp, RTC) {

        var ScreenShareView = Backbone.View.extend({
            className: "screenShare",
            template: _.template(screen_share_tmp),

            render: function () {
                var view = this.template();
                this.$el.html(view);

                this.rtc_video = rtc_video = new RTC();
                this.rtc_video.connect("ws://" + window.location.hostname + ":9000", "course01-video");
                this.rtc_video.createStream(this.screen_constraints(), function (stream) {
                    rtc_video.attachStream(stream, 'share');
                });

                return this.el;
            },

            screen_constraints: function () {
                return {
                    audio: false,
                    video: {
                        mandatory: {
                            chromeMediaSource: 'screen',
                            maxWidth: 1280,
                            maxHeight: 720
                        },
                        optional: []
                    }
                };
            },

            close: function () {
                this.rtc_video.close();
            }

        });

        return ScreenShareView;
    });