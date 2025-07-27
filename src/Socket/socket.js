import express from 'express';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for simplicity; adjust as needed
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  },
    transports: ['websocket', 'polling'], // Use WebSocket and polling transports
});
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  // Example of handling a custom event
  socket.on('message', (data) => {
    console.log('Message received:', data);
    // Broadcast the message to all connected clients
    io.emit('message', data);
  });
});

export {app, server, io};