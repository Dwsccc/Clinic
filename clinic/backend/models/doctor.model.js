module.exports = (sequelize, DataTypes) => {
  const Doctor = sequelize.define('Doctor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    experience: {
      type: DataTypes.ENUM(
        '1 Year', '2 Years', '3 Years', '4 Years', '5 Years',
        '6 Years', '7 Years', '8 Years', '9 Years', '10 Years'
      ),
      allowNull: false,
      defaultValue: '1 Year',
      comment: 'Years of experience as text'
    },
    fees: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    speciality: {
      type: DataTypes.ENUM('General physician', 'Gynecologist', 'Dermatologist', 'Pediatrician', 'Neurologist', 'Gastroenterologist'),
      allowNull: false
    },
    degree: {
      type: DataTypes.STRING(255),
    },
    address: {
      type: DataTypes.TEXT,
    },
    about: {
      type: DataTypes.TEXT,
    },
    avatar_url: {
      type: DataTypes.STRING(255),
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'doctors',
    timestamps: false,
  });

  // Định nghĩa associate nhận models từ bên ngoài (models/index.js)
  Doctor.associate = (models) => {
    Doctor.hasMany(models.Appointment, {
      foreignKey: 'doctor_id',
      as: 'appointments',
    });
  };

  return Doctor;
};
