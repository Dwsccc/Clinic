const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'maket2412',       // hoặc mật khẩu của bạn
  database: 'clinic'  // tên database bạn đã tạo
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Kết nối thất bại:', err);
  } else {
    console.log('✅ Kết nối database thành công!');
  }
});

module.exports = connection;
