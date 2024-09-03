// models/leadAssignment.model.js
module.exports = (sequelize, Sequelize) => {
    const LeadAssignment = sequelize.define(
        "LeadAssignment",
        {
            leadId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Lead',
                    key: 'id',
                },
                allowNull: false,
            },
            assignedByUserId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'User',
                    key: 'id',
                },
                allowNull: false,
            },
            assignedDate: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            assignedToUserId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'User',
                    key: 'id',
                },
                allowNull: false,
            },

            scheduledLeadDate: {
                type: Sequelize.DATE,
                allowNull: true
              },
              responseType: {
                type: Sequelize.STRING,
                allowNull: true
              },
              comment: {
                type: Sequelize.STRING,
                allowNull: true
              },
              note: {
                type: Sequelize.TEXT,
                allowNull: true
              },
              status:{
                type: Sequelize.STRING,
                allowNull: true
              }
           
        },
        {
            timestamps: false,
            underscored: true,
            freezeTableName: true,
        }
    );

    return LeadAssignment;
};
