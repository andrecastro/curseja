var mongoose = require("mongoose");
var path = require('path');
var fs = require('fs');

module.exports.connect = function (config) {
    mongoose.connect(config.db.url, config.db.options);
}

module.exports.configure = function() {

    mongoose.connection.on('open', function() {
       console.log("Connection with mongodb opened");
    });

    mongoose.connection.on('error', function (err) {
        console.log(err)
    })

    mongoose.connection.on('disconnected', function () {
        connect()
    });

    var models_path = path.join(__dirname, '../app/models');
    fs.readdirSync(models_path).forEach(function (file) {
        if (~file.indexOf('.js')) require(models_path + '/' + file)
    })
}