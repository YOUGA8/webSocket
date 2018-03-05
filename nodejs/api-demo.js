var current = 0;
module.exports = function (io) {
    io.on('connection', function (socket) {
        socket.on('message', function (msg) {
            console.log('msg', msg);
        });
        socket.on('update', function (data) {
            console.log('data', data);
            io.emit('update', 'server data');// 全部推送
            socket.broadcast.emit('update', 'broadcast data'); //除了当前客户端全部推送
            socket.emit('update', 'emit data'); //只推送当前客户端
        });

        socket.on('group1', function (data) {
            socket.join('group1');
        });
        socket.on('group2', function (data) {
            socket.join('group2');
        });

        socket.on('addRoom', function () {
            socket.emit('room', 'group' + current);
            socket.broadcast.to('group1').emit('update', 'group data');
            io.in('group1').emit('update', 'in group data');
            current++;
        });

    });
}

