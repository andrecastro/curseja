#!/usr/bin/env node
var debug = require('debug')('my-application');
var app = require('./config/app');
var db = require('./config/db');
var router = require('./config/router');
var config = require('./config/config');
var fs = require('fs');
var http = require('http');
var https = require('https');
var socketIO = require("socket.io");
var webRTC = require("webrtc.io");

var privateKey = fs.readFileSync('./keys/server.key');
var certificate = fs.readFileSync('./keys/server.crt');

db.connect(config['development']);
db.configure();

router.start(app);

var httpServer = http.createServer(app);
var httpsServer = https.createServer({ key: privateKey, cert: certificate }, app);

//httpServer.listen(3000, log);
httpsServer.listen(443)
var io = socketIO.listen(httpServer.listen(3000, log));
webRTC.listen(9000);

io.sockets.on('connection', function (socket) {
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});

function log() {
    var address = this.address();
    console.info("=> Application starting in " + app.get("env") + " on http://" + address.address + ":" + address.port + "...");
    console.info("=> Press CTRL+C to shutdown server");
    debug('Express server listening on port ' + address.port);
}