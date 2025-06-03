const Sequelize = require('sequelize');
const config = require('../config/config');

// Khởi tạo Sequelize trước
const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: config.development.dialect,
  }
);

const db = {};

// Import tất cả các model
db.User = require('./user.model')(sequelize, Sequelize.DataTypes);
db.Doctor = require('./doctor.model')(sequelize, Sequelize.DataTypes);
db.Appointment = require('./appointment.model')(sequelize, Sequelize.DataTypes);
db.Payment = require('./payment.model')(sequelize, Sequelize.DataTypes);
db.Admin = require('./admin.model')(sequelize, Sequelize.DataTypes);

// Gọi các hàm associate nếu model có định nghĩa
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
