module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define(
      "User",
      {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
          },
        employeeId: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          // unique: true, 
        },
        mobile:{
          type: Sequelize.STRING,
          allowNull: false,
        },
        address: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        designation: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        otp: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        department: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        workingMode: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        role: {
            type: Sequelize.ENUM('ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_EMPLOYEE'),
            allowNull: false,
            defaultValue: 'ROLE_EMPLOYEE',
          },
        status: {
          type: Sequelize.STRING,
          allowNull: true,
        },
      },
      {
        timestamps: false,
        underscored: true,
        freezeTableName: true,
      }
    );
  
    return User;
  };
  