var http = require('http');
var express = require('express');

var app = express();
require('./routes')(app);

var server = http.Server(app);
server.listen(8000, function () {
    console.log('running');
});

var sio = require('socket.io');
var io = sio.listen(server);

require('./game/server')(io.of('/game'));
require('./video')(io.of('/video'));
require('./api-demo')(io.of('/demo'));

io.sockets.on('connection', function (socket) {
    socket.on('message', function (msg) {
        console.log('msg', msg);
        // socket.broadcast.emit('xx', msg);
        socket.broadcast.emit('refresh', msg);
    });

    socket.send('888');
});