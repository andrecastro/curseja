define(["backbone", "text!templates/video_tmp.html", "webrtc.io"],
    function (Backbone, video_tmp, RTC) {

        var VideoView = Backbone.View.extend({
            className: "videoScreen",
            template: _.template(video_tmp),

            render: function () {
                var view = this.template();
                this.$el.html(view);

                this.rtc_video = rtc_video = new RTC();
                this.rtc_video.connect("ws://" + window.location.hostname + ":9000", "course01-video");
                this.rtc_video.createStream(this.video_constraints(), function (stream) {
                    rtc_video.attachStream(stream, 'video');
                });

                return this.el;
            },

            video_constraints: function() {
                return {
                    audio: false,
                    video: true
                }
            },

            close: function() {
                this.rtc_video.close();
            }

        });

        return VideoView;
    });