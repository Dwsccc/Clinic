// models/payment.model.js
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    appointment_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    method: {
      type: DataTypes.ENUM('cash', 'bank_transfer', 'momo', 'card'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('success', 'failed', 'pending'),
      defaultValue: 'pending'
    },
    payment_time: {
      type: DataTypes.DATE,
    }
  });

  Payment.associate = function(models) {
    Payment.belongsTo(models.Appointment, { foreignKey: 'appointment_id' });
  };

  return Payment;
};
