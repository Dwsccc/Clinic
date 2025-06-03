module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
      defaultValue: 'pending',
    },
    payment_status: {
      type: DataTypes.ENUM('unpaid', 'paid'),
      defaultValue: 'unpaid',
    },
  }, {
    tableName: 'appointments',
    timestamps: true,
  });

  Appointment.associate = (models) => {
    Appointment.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    Appointment.belongsTo(models.Doctor, {
      foreignKey: 'doctor_id',
      as: 'doctor',
    });
  };

  return Appointment;
};
