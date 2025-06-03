const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const app = require('./app'); // Đây là app chứa route Express bạn đã cấu hình
const { User, Admin } = require('./models');

const server = http.createServer(app); // app từ app.js
const io = socketIo(server, {
  cors: {
    origin: '*',
  }
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('New client connected');

  const token = socket.handshake.query.token;

  if (!token) {
    socket.emit('error', 'No token provided!');
    socket.disconnect();
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      socket.emit('error', 'Unauthorized: Invalid token');
      socket.disconnect();
      return;
    }

    const { id, role } = decoded;

    try {
      let userData;

      if (role === 'user') {
        userData = await User.findByPk(id);
      } else if (role === 'admin') {
        userData = await Admin.findByPk(id);
      } else {
        socket.emit('error', 'Unauthorized role');
        socket.disconnect();
        return;
      }

      if (!userData) {
        socket.emit('error', 'User not found');
        socket.disconnect();
        return;
      }

      socket.user = userData;
      socket.role = role;

      console.log(`WebSocket authenticated for ${role}, ID: ${id}`);

      socket.on('message', (data) => {
        console.log(`[${role}] ${userData.name || userData.email} says:`, data);
      });

      socket.on('disconnect', () => {
        console.log(`Client [${role}] disconnected`);
      });

    } catch (error) {
      socket.emit('error', 'Server error');
      socket.disconnect();
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
