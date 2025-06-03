// models/admin.model.js
module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    }
  } , {
    timestamps: false  // <-- Thêm dòng này để tắt createdAt, updatedAt
  });



  return Admin;
};
