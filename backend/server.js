const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection failed:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Online user tracking
let onlineUsers = {};

io.on('connection', (socket) => {
  console.log('⚡ User connected:', socket.id);

  // When a user joins
  socket.on('join', (userId) => {
    console.log(`✅ User joined: ${userId}`);
    onlineUsers[userId] = socket.id;
    io.emit('onlineUsers', Object.keys(onlineUsers));
  });

  // When a message is sent
  socket.on('sendMessage', (data) => {
    console.log('📨 Message received by server:', data);

    const receiverSocketId = onlineUsers[data.receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', data);
      console.log(`➡️ Message forwarded to ${data.receiverId} (${receiverSocketId})`);
    } else {
      console.log(`⚠️ Receiver ${data.receiverId} is not online`);
    }
  });

  // When a user disconnects
  socket.on('disconnect', () => {
    const disconnectedUserId = Object.keys(onlineUsers).find(key => onlineUsers[key] === socket.id);
    if (disconnectedUserId) {
      delete onlineUsers[disconnectedUserId];
      console.log(`❌ User disconnected: ${disconnectedUserId}`);
    } else {
      console.log(`❌ Unknown socket disconnected: ${socket.id}`);
    }

    io.emit('onlineUsers', Object.keys(onlineUsers));
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
