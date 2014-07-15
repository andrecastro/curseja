var jam = {
    "packages": [
        {
            "name": "backbone",
            "location": "javascripts/libs/backbone",
            "main": "backbone.js"
        },
        {
            "name": "backbone.routemanager",
            "location": "javascripts/libs/backbone.routemanager",
            "main": "backbone.routemanager.js"
        },
        {
            "name": "bootstrap-core",
            "location": "javascripts/libs/bootstrap-core",
            "main": "js/bootstrap.js"
        },
        {
            "name": "jquery",
            "location": "javascripts/libs/jquery",
            "main": "dist/jquery.js"
        },
        {
            "name": "jquery-layout",
            "location": "javascripts/libs/jquery-layout",
            "main": "jquery.layout.js"
        },
        {
            "name": "jquery-migrate",
            "location": "javascripts/libs/jquery-migrate",
            "main": "jquery.migrate.js"
        },
        {
            "name": "jquery-ui",
            "location": "javascripts/libs/jquery-ui",
            "main": "dist/jquery-ui.min.js"
        },
        {
            "name": "socket.io",
            "location": "javascripts/libs/socket.io",
            "main": "socket.io.js"
        },
        {
            "name": "text",
            "location": "javascripts/libs/text",
            "main": "text.js"
        },
        {
            "name": "underscore",
            "location": "javascripts/libs/underscore",
            "main": "underscore.js"
        },
        {
            "name": "webrtc.io",
            "location": "javascripts/libs/webrtc.io",
            "main": "webrtc.io.js"
        }
    ],
    "version": "0.2.17",
    "shim": {
        "backbone": {
            "deps": [
                "underscore",
                "jquery"
            ],
            "exports": "Backbone"
        },
        "backbone.routemanager": {
            "exports": "Backbone.RouteManager",
            "deps": [
                "backbone",
                "jquery",
                "lodash"
            ]
        },
        "bootstrap-core": {
            "deps": [
                "jquery"
            ]
        },
        "underscore": {
            "exports": "_"
        }
    }
};

if (typeof require !== "undefined" && require.config) {
    require.config({
    "packages": [
        {
            "name": "backbone",
            "location": "javascripts/libs/backbone",
            "main": "backbone.js"
        },
        {
            "name": "backbone.routemanager",
            "location": "javascripts/libs/backbone.routemanager",
            "main": "backbone.routemanager.js"
        },
        {
            "name": "bootstrap-core",
            "location": "javascripts/libs/bootstrap-core",
            "main": "js/bootstrap.js"
        },
        {
            "name": "jquery",
            "location": "javascripts/libs/jquery",
            "main": "dist/jquery.js"
        },
        {
            "name": "jquery-layout",
            "location": "javascripts/libs/jquery-layout",
            "main": "jquery.layout.js"
        },
        {
            "name": "jquery-migrate",
            "location": "javascripts/libs/jquery-migrate",
            "main": "jquery.migrate.js"
        },
        {
            "name": "jquery-ui",
            "location": "javascripts/libs/jquery-ui",
            "main": "dist/jquery-ui.min.js"
        },
        {
            "name": "socket.io",
            "location": "javascripts/libs/socket.io",
            "main": "socket.io.js"
        },
        {
            "name": "text",
            "location": "javascripts/libs/text",
            "main": "text.js"
        },
        {
            "name": "underscore",
            "location": "javascripts/libs/underscore",
            "main": "underscore.js"
        },
        {
            "name": "webrtc.io",
            "location": "javascripts/libs/webrtc.io",
            "main": "webrtc.io.js"
        }
    ],
    "shim": {
        "backbone": {
            "deps": [
                "underscore",
                "jquery"
            ],
            "exports": "Backbone"
        },
        "backbone.routemanager": {
            "exports": "Backbone.RouteManager",
            "deps": [
                "backbone",
                "jquery",
                "lodash"
            ]
        },
        "bootstrap-core": {
            "deps": [
                "jquery"
            ]
        },
        "underscore": {
            "exports": "_"
        }
    }
});
}
else {
    var require = {
    "packages": [
        {
            "name": "backbone",
            "location": "javascripts/libs/backbone",
            "main": "backbone.js"
        },
        {
            "name": "backbone.routemanager",
            "location": "javascripts/libs/backbone.routemanager",
            "main": "backbone.routemanager.js"
        },
        {
            "name": "bootstrap-core",
            "location": "javascripts/libs/bootstrap-core",
            "main": "js/bootstrap.js"
        },
        {
            "name": "jquery",
            "location": "javascripts/libs/jquery",
            "main": "dist/jquery.js"
        },
        {
            "name": "jquery-layout",
            "location": "javascripts/libs/jquery-layout",
            "main": "jquery.layout.js"
        },
        {
            "name": "jquery-migrate",
            "location": "javascripts/libs/jquery-migrate",
            "main": "jquery.migrate.js"
        },
        {
            "name": "jquery-ui",
            "location": "javascripts/libs/jquery-ui",
            "main": "dist/jquery-ui.min.js"
        },
        {
            "name": "socket.io",
            "location": "javascripts/libs/socket.io",
            "main": "socket.io.js"
        },
        {
            "name": "text",
            "location": "javascripts/libs/text",
            "main": "text.js"
        },
        {
            "name": "underscore",
            "location": "javascripts/libs/underscore",
            "main": "underscore.js"
        },
        {
            "name": "webrtc.io",
            "location": "javascripts/libs/webrtc.io",
            "main": "webrtc.io.js"
        }
    ],
    "shim": {
        "backbone": {
            "deps": [
                "underscore",
                "jquery"
            ],
            "exports": "Backbone"
        },
        "backbone.routemanager": {
            "exports": "Backbone.RouteManager",
            "deps": [
                "backbone",
                "jquery",
                "lodash"
            ]
        },
        "bootstrap-core": {
            "deps": [
                "jquery"
            ]
        },
        "underscore": {
            "exports": "_"
        }
    }
};
}

if (typeof exports !== "undefined" && typeof module !== "undefined") {
    module.exports = jam;
}