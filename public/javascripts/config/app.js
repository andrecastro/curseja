define(["backbone","views/chat_view", "views/screen_share_view", "views/video_view", "backbone.routemanager"],
    function (Backbone, chatView, ScreenShareView, VideoView) {

        var Router = Backbone.RouteManager.extend({

            before: {
                "*": ["close"]
            },

            routes: {
                "share": "screen_share",
                "video": "video_share"
            },

            close: function() {
                if(router.currentView)
                    router.currentView.close();
            },

            start: function () {
                Backbone.history.start();
                chatView.render();
            },

            screen_share: function () {
                this.currentView = new ScreenShareView();
                $("#center-main-container").html(this.currentView.render());
            },

            video_share: function () {
                this.currentView = new VideoView();
                $("#center-main-container").html(this.currentView.render());
            }

        });

        var router = new Router();
        return router;
    });