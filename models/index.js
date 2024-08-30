const dbConfig = require("./../configs/db.config");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
    timezone: "+05:30",
    logging:false,
    dialectOptions: {
      dateStrings: true,
      typeCast: function (field, next) {
        if (field.type === "DATETIME") {
          return field.string();
        }
        return next();
      },
    },
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  });
  
  const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Lead = require('./lead.model')(sequelize,Sequelize);
db.User = require('./user.model')(sequelize,Sequelize);
db.LeadAssignment = require('./LeadAssignment.model')(sequelize, Sequelize);

db.User.hasMany(db.Lead, { foreignKey: 'userId' });
db.Lead.belongsTo(db.User, { foreignKey: 'userId' });
db.User.hasMany(db.LeadAssignment, { foreignKey: 'userId' });
db.LeadAssignment.belongsTo(db.User, { foreignKey: 'userId' });

db.Lead.hasMany(db.LeadAssignment, { foreignKey: 'leadId' });
db.LeadAssignment.belongsTo(db.Lead, { foreignKey: 'leadId' });
module.exports = db;