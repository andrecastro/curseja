require.config({
    baseUrl: "javascripts",
    "packages": [
        {
            "name": "backbone",
            "location": "libs/backbone",
            "main": "backbone.js"
        },
        {
            "name": "bootstrap-core",
            "location": "libs/bootstrap-core",
            "main": "js/bootstrap.js"
        },
        {
            "name": "jquery",
            "location": "libs/jquery",
            "main": "dist/jquery.js"
        },
        {
            "name": "underscore",
            "location": "libs/underscore",
            "main": "underscore.js"
        },
        {
            "name": "text",
            "location": "libs/text",
            "main": "text.js"
        },
        {
            "name": "jquery-ui",
            "location": "libs/jquery-ui",
            "main": "dist/jquery-ui.min.js"
        },
        {
            "name": "jquery-layout",
            "location": "libs/jquery-layout",
            "main": "jquery.layout.js"
        },
        {
            "name": "jquery-migrate",
            "location": "libs/jquery-migrate",
            "main": "jquery.migrate.js"
        },
        {
            "name": "socket.io",
            "location": "libs/socket.io",
            "main": "socket.io.js"
        },
        {
            "name": "backbone.routemanager",
            "location": "libs/backbone.routemanager",
            "main": "backbone.routemanager.js"
        },
        {
            "name": "webrtc.io",
            "location": "libs/webrtc.io",
            "main": "webrtc.io.js"
        }
    ],
    "shim": {
        "webrtc.io": {
            "exports": "rtc"
        },
        "backbone": {
            "deps": [
                "underscore",
                "jquery"
            ],
            "exports": "Backbone"
        },
        "bootstrap-core": {
            "deps": [
                "jquery"
            ]
        },
        "backbone.routemanager": {
            "exports": "Backbone.RouteManager",
            "deps": [
                "backbone",
                "jquery",
                "lodash"
            ]
        },
        "underscore": {
            "exports": "_"
        },
        "jquery-ui": {
            "deps": ["jquery"],
            "exports": "$"
        },
        "jquery-migrate": {
            "deps": ["jquery"]
        },
        "jquery-layout": {
            "deps": [
                "jquery",
                "jquery-migrate",
                "jquery-ui"
            ]
        }
    }
});

require(["config/bootstrap", "webrtc.io", "views/chat_view"], function (bootstrap, RTC, chatView) {

    bootstrap();
    chatView.render();

    var rtc_video = new RTC();

    rtc_video.connect("ws://" + window.location.hostname + ":9000", "course01-video");

    rtc_video.on("add remote stream", function (stream) {
        rtc_video.attachStream(stream, 'client-video');
    });

    rtc_video.on('connections', function () {
        rtc_video.fire('ready');
    });

    var rtc_audio = new RTC();

    rtc_audio.connect("ws://" + window.location.hostname + ":9000", "course01-audio");

    rtc_audio.on("add remote stream", function (stream) {
        rtc_audio.attachStream(stream, 'audio');
    });

    rtc_audio.on('connections', function () {
        rtc_audio.fire('ready');
    });

});