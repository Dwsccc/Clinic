const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Thêm CORS nếu cần thiết
const morgan = require('morgan'); // Thêm để log requests trong quá trình phát triển
const app = express();
const path = require('path');
// Tải biến môi trường từ file .env
dotenv.config();

// Middlewares
app.use(express.json()); // Middleware cho parsing JSON body
app.use(express.urlencoded({ extended: true })); // Middleware cho parsing dữ liệu từ form (nếu cần)
app.use(cors()); // Cho phép CORS nếu ứng dụng của bạn cần

// Log requests (chỉ dùng trong môi trường phát triển)
app.use(morgan('dev'));

// Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const doctorRoutes = require('./routes/doctor.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const paymentRoutes = require('./routes/payment.routes');
const adminRoutes = require('./routes/admin.routes');

// Định nghĩa các route cho API
app.use('/images/doctors', express.static(path.join(__dirname, 'public/images/doctors')));
app.use('/api/admins', adminRoutes);
app.use('/api/auth', authRoutes); // <-- chỉ dòng này thôi cho tất cả auth
app.use('/api/user', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);
// Static file để truy cập ảnh
app.use('/images/users', express.static(path.join(__dirname, 'public/images/users')));
// Middleware xử lý lỗi 404
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Global error handler middleware
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  const message = error.message || 'Internal Server Error';
  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : error.stack
  });
});
app.use((err, req, res, next) => {
  console.error('Global error handler caught:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

module.exports = app;
