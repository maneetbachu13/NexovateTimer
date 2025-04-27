const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let timerStartTime = null;

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected');

    // Send the current timer state to the newly connected client
    socket.emit('timerState', { timerStartTime });

    socket.on('startTimer', () => {
        if (!timerStartTime) {
            timerStartTime = Date.now();
            io.emit('timerState', { timerStartTime });
        }
    });

    socket.on('resetTimer', () => {
        timerStartTime = null;
        io.emit('timerState', { timerStartTime });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
