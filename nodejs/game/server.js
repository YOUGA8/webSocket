var colors = ['#faa', '#afa', '#aaf', '#ffa', '#faf', '#aff'];

// colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];

function getNextArray() {
    var arr = colors.map(function (t, k) {
        return k
    });
    var nextArray = [];
    for (var i = 0; i < colors.length; i++) {
        var key = Math.floor(Math.random() * arr.length);
        nextArray.push(arr[key]);
        arr.splice(key, 1);
    }
    return nextArray;
}

module.exports = function (io) {

    var rooms = [];
    var last = -2;
    io.on('connection', function (socket) {
        socket.on('createRoom', function () {
            var id = rooms.length + '';
            rooms[id] = {
                sockets: [socket.id],
                your: getNextArray(),
                my: getNextArray()
            };
            socket.join(id);
            socket.emit('createRoom', id);
        });

        socket.on('joinRoom', function (id) {
            if (!rooms[id]) {
                socket.emit('joinError', '房间不存在');
            } else if (rooms[id].sockets.length >= 2) {
                socket.emit('joinError', '房间已经满客');
            } else {
                socket.join(id);
                socket.emit('joinRoom', id);
                socket.broadcast.to(id).emit('join');
                rooms[id].sockets.push(socket.id);
            }
        });

        socket.on('start', function (id) {
            last = -2;
            var my = rooms[id].my;
            var your = rooms[id].your;
            io.sockets[rooms[id].sockets[0]].emit('start', colors, your, my);
            io.sockets[rooms[id].sockets[1]].emit('start', colors, my, your);
            io.sockets[rooms[id].sockets[0]].emit('canClick');
        });

        socket.on('click', function (id, key) {
            var my = rooms[id].my;
            var your = rooms[id].your;

            if (last === -2) {
                last = key;
                socket.broadcast.to(id).emit('canClick');
                my[my.indexOf(key - '')] = {open: colors[key]};
            } else if (last == key) {
                last = -1;
                socket.emit('canClick', true);
                if (socket.id == rooms[id].sockets[0]) {
                    my[my.indexOf(key - '')] = {open: colors[key]};
                } else if (socket.id == rooms[id].sockets[1]) {
                    your[your.indexOf(key - '')] = {open: colors[key]};
                }
            } else {
                if (last == -1) {
                    if (socket.id == rooms[id].sockets[0]) {
                        my[my.indexOf(key - '')] = {open: colors[key]};
                    } else if (socket.id == rooms[id].sockets[1]) {
                        your[your.indexOf(key - '')] = {open: colors[key]};
                    }
                    last = key;
                    socket.broadcast.emit('canClick', true);
                } else {
                    socket.emit('canClick', 'error');
                }
            }

            rooms[id].my = my;
            rooms[id].your = your;
            io.sockets[rooms[id].sockets[1]].emit('running', my, your);
            io.sockets[rooms[id].sockets[0]].emit('running', your, my);
        });

    });
};