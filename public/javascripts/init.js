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
                "jquery"
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

require(["config/app", "config/bootstrap", "config/audio_server"], function (app, bootstrap) {

    bootstrap();
    app.start();

});