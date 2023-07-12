const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http')
const { Server } = require('socket.io');
const server = http.createServer(app);
const port = 3030;

const io = new Server(server, {
     cors: {
          origin: 'http://localhost:3000',
          methods: ['GET', 'POST'],
          credentials: true
     }
})

// middleware
app.use(cors());

io.on('connection', (socket) => {
     console.log('A user is connected.');

     socket.on('chat_message', (message) => {
          const messageWithId = { id: socket.id, message }
          io.emit('received_message', messageWithId);
     });

     socket.on('disconnect', () => {
          console.log('A user is disconnected');
     });
});

server.listen(port, () => {
     console.log(`Server is running on http://localhost:${port}`);
})