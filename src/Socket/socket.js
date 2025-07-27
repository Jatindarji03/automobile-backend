import express from 'express';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);
const connectedUsers = new Map(); // To keep track of connected users
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for simplicity; adjust as needed
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  },
    transports: ['websocket', 'polling'], // Use WebSocket and polling transports
});
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for user registration
  socket.on('register', (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ID ${socket.id}`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    for (const [userId, sockId] of connectedUsers.entries()) {
      if (sockId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
    console.log('User disconnected:', socket.id);
  });

  // Send alert from sender to receiver
  socket.on('send_alert', ({ senderId, receiverId, message }) => {
    const targetSocketId = connectedUsers.get(receiverId);
    if (targetSocketId) {
      io.to(targetSocketId).emit('receive_alert', {
        from: senderId,
        message,
      });
    } else {
      console.log(`User ${receiverId} not connected`);
    }
  });
});


export {app, server, io};