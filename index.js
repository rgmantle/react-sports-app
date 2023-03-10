const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const data = require('./data.js');

//Global variable to store latest hockey results
let latestData;

//Load data on initial connect, refresh every 10 minutes
data.getData().then((result) => {
    latestData =result
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function() {
    console.log('HTTP server started on port 3000')
});

io.on('connection', function(socket) {
    console.log('Client connection received');
        socket.emit('sendToClient', { hello: 'world' });
        socket.on('receivedFromClient', function(data) {
            console.log(data);
        });
});

//set interval for refreshing data
setInterval(function() {
    data.getData().then((result) => {
        latestData = result;

        io.emit('data', result);

        console.log('Last updated: ' + new Date());
    });
}, 300000);