module.exports = (sequelize, Sequelize) => {
    const Lead = sequelize.define(
      "Lead",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        assignedDate: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        dateImported:{
          type: Sequelize.STRING,
          allowNull: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        phone: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: true,
          validate: {
            isEmail: true,
          },
        },
        leadSource: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        leadOwner: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        gender: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        dob: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        company: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        city: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        tags: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        //   type: Sequelize.JSON,
        //   allowNull: true,
        //   get() {
        //     const value = this.getDataValue('tags');
        //     return value ? JSON.parse(value) : [];
        //   },
        //   set(value) {
        //     this.setDataValue('tags', JSON.stringify(value));
        //   },
        // },
        status: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        followUp:{
          type: Sequelize.STRING,
          allowNull: true
      },
        userId: { 
            type: Sequelize.INTEGER,
            references: {
              model: 'User',
              key: 'id',
            },
            allowNull: true,
          },
          assignedTo:{
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
  
    return Lead;
  };
  