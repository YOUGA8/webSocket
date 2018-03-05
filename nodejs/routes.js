module.exports = function (app) {

    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/index.html');
    });
    app.get('/game', function (req, res) {
        res.sendFile(__dirname + '/game/index.html');
    });
    app.get('/game/style.css', function (req, res) {
        res.sendFile(__dirname + '/game/style.css');
    });
    app.get('/game/index.js', function (req, res) {
        res.sendFile(__dirname + '/game/index.js');
    });
    app.get('/video', function (req, res) {
        res.sendFile(__dirname + '/video.html');
    });

    app.get('/demo', function (req, res) {
        res.sendFile(__dirname + '/demo.html');
    });

};