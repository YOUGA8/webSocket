(function (window) {

    var yourContent = gid('your-content');
    var myContent = gid('my-content');


    var socket = io.connect('/game');

    var currentDiv = null;
    var canClick = false;

    var _roomId = null;

    gid('create-room').onclick = function () {
        socket.emit('createRoom');
    };

    gid('room-btn').onclick = function () {
        var value = gid('room-id').value;
        value && socket.emit('joinRoom', value);
    };

    socket.on('createRoom', function (roomId) {
        _roomId = roomId;
        canClick = true;
        setError(document.body);
        gid('show-room-id').innerHTML = roomId;
        gid('room').style.display = 'none';
        gid('ready').style.display = 'block';
    });

    socket.on('joinRoom', function (roomId) {
        _roomId = roomId;
        gid('show-room-id').innerHTML = roomId;
        gid('room').style.display = 'none';
        gid('ready').style.display = 'block';
        gid('ready-text').innerHTML = '请点击开始';
        gid('ready-text').onclick = function () {
            socket.emit('start', roomId);
        }
    });

    socket.on('join', function () {
        gid('ready-text').innerHTML = '对手已加入房间';
    });

    socket.on('joinError', function (errorMessage) {
        alert(errorMessage);
    });

    socket.on('start', function (colors, your, my) {

        gid('ready').style.display = 'none';
        gid('game').style.display = 'block';

        addContent(your, yourContent, '#ccc');
        addContent(my, myContent, '#ccc');

        gameStart(3, function () {
            setContent(yourContent, colors, your);
            setContent(myContent, colors, my);
            setTimeout(function () {
                setContent(yourContent, '#ccc');
                setContent(myContent, '#ccc');
            }, 1000);
        });
    });


    socket.on('canClick', function (type) {
        canClick = true;
        if (type == 'error') {
            setError(currentDiv);
        }
    });

    socket.on('running', function (your, my) {
        setContent(yourContent, null, your);
        setContent(myContent, null, my);
    });


    myContent.onclick = function (e) {
        if (!canClick) {
            return;
        }
        var key = e.target.getAttribute('key');
        if (key) {
            console.log(_roomId, key);
            socket.emit('click', _roomId, key);
            currentDiv = e.target;
            canClick = false;
        }
    }

    socket.on('disconnect', function() {
        socket.emit('dis', '123');
        console.log("与服务其断开");
    });


})(window);

function gameStart(time, fn) {
    gid('time-div').innerHTML = time + ' s';
    if (time > 0) {
        setTimeout(function () {
            gameStart(--time, fn);
        }, 500)
    } else {
        gid('time-div').style.display = 'none';
        fn && fn();
    }
}

function addContent(arr, element, color) {
    for (var i = 0; i < arr.length; i++) {
        var div = document.createElement('div');
        var child = document.createElement('div');
        child.style.background = color || arr[i];
        div.className = 'content-box';
        div.appendChild(child);
        element.appendChild(div);
    }
}

function setContent(element, colors, data) {
    var arr = element.getElementsByClassName('content-box');
    for (var i = 0; i < arr.length; i++) {
        if (data) {
            var color = colors ? colors[data[i]] : data[i].open || '#ccc';
            arr[i].getElementsByTagName('div')[0].style.background = color;
            arr[i].getElementsByTagName('div')[0].setAttribute('key', data[i]);
        } else {
            arr[i].getElementsByTagName('div')[0].style.background = colors;
        }
    }
}

function gid(id) {
    return document.getElementById(id);
}

function setError(element) {
    element.className = 'error';
    setTimeout(function () {
        element.className = '';
    }, 500);
}