const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (like HTML, CSS, and JS)
app.use(express.static('public'));

// Handle incoming socket connections
io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Listen for chat messages
    socket.on('chat message', (msg) => {
        // Emit message to all clients except the sender
        socket.broadcast.emit('chat message', msg);  // Broadcast to other clients
    });

    // Listen for typing event
    socket.on('typing', () => {
        socket.broadcast.emit('typing');  // Broadcast typing event to others
    });

    // Listen for stop typing event
    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing');  // Broadcast stop typing event to others
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
