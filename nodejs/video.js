module.exports = function (io) {
    io.on('connect', function (socket) {
        console.log('ok');
        socket.on('message', function (url) {

            console.log('message', url);

            socket.broadcast.emit('video', url);
        })
    })
}