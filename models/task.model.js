const { create } = require("express-handlebars");

// models/leadAssignment.model.js
module.exports = (sequelize, Sequelize) => {
    const task = sequelize.define(
        "task",
        {
            // title:{
            //         type: Sequelize.STRING,
            //         allowNull: true
            // },   
            description:{
                type: Sequelize.STRING,
                allowNull: true
            },
            status:{
                type: Sequelize.STRING,
                allowNull: true
            },
            actionType:{
                type: Sequelize.STRING,
                allowNull: true
            },
            followUp:{
                type: Sequelize.STRING,
                allowNull: true
            },
            docsCollected: {
                // type: Sequelize.ENUM('Yes', 'No'),
                type: Sequelize.STRING,
                allowNull: true
            },
            taskStatus:{
                type: Sequelize.STRING,
                allowNull: true  
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                  model: 'User',
                  key: 'id'
                },
            },
                leadId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'Lead',
                        key: 'id',
                    },
                    allowNull: false,
                },
                  createdDate:{
                   type:Sequelize.STRING,
                   allowNull: true
                  },
                  updatedDate:{
                    type:Sequelize.STRING,
                    allowNull:true
                  }
        },

        {
            timestamps: false,
            underscored: true,
            freezeTableName: true,
        }
    );

    return task;
};
