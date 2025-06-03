// config/config.js
module.exports = {
  development: {
    username: process.env.DB_USER || 'root',  // Tên người dùng MySQL
    password: process.env.DB_PASS || 'maket2412',      // Mật khẩu MySQL
    database: process.env.DB_NAME || 'clinic',  // Tên cơ sở dữ liệu
    host: process.env.DB_HOST || 'localhost',  // Địa chỉ máy chủ MySQL (localhost nếu chạy trên máy local)
    dialect: 'mysql' // Sử dụng MySQL
  },
  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'maket2412',
    database: process.env.DB_NAME || 'clinic',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql'
  },
  production: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'maket2412',
    database: process.env.DB_NAME || 'clinic',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql'
  }
};
