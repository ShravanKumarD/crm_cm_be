module.exports = (sequelize, Sequelize) => {
    const LoansReport = sequelize.define(
        "LoansReport",
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
            bankName: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            loanAmount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            emi: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            outstanding: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
        },
        {
            timestamps: false,
            underscored: true,
            freezeTableName: true,
        }
    );

    return LoansReport;
};
