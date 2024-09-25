module.exports = (sequelize, Sequelize) => {
    const CreditReport = sequelize.define(
        "creditReport",
        {
            leadId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Lead',
                    key: 'id',
                },
                allowNull: false,
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'User',
                    key: 'id',
                },
                allowNull: false,
            },
            creditCardName:{
               type: Sequelize.STRING(255),
                allowNull: false,
            },
            totalOutstanding:{
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            }
           
        },
        {
            timestamps: false,
            underscored: true,
            freezeTableName: true,
        }
    );

    return CreditReport;
};
