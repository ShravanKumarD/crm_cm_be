const dbConfig = require("./../configs/db.config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  // operatorsAliases: false,
  timezone: "+05:30", 
  logging: false, 
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


db.Lead = require("./lead.model")(sequelize, Sequelize);
db.User = require("./user.model")(sequelize, Sequelize);
db.LeadAssignment = require("./LeadAssignment.model")(sequelize, Sequelize);
db.Task = require("./task.model")(sequelize, Sequelize);
db.loansReport = require("./loansReport.modal")(sequelize,Sequelize);
db.creditReport=require("./creditReport.modal")(sequelize,Sequelize);
db.HomeLoansReport=require("./homeLoanReport")(sequelize,Sequelize);


db.User.hasMany(db.Lead, { foreignKey: "userId" });
db.Lead.belongsTo(db.User, { foreignKey: "userId" });

db.User.hasMany(db.LeadAssignment, { foreignKey: "userId" });
db.LeadAssignment.belongsTo(db.User, { foreignKey: "userId" });

db.Lead.hasMany(db.LeadAssignment, { foreignKey: "leadId" });
db.LeadAssignment.belongsTo(db.Lead, {
  as: "assignedLead",
  foreignKey: "leadId",
});

db.User.hasMany(db.Task, {
  foreignKey: "userId",
  as: "tasks",
});
db.Lead.hasMany(db.Task, {
  foreignKey: "leadId",
  as: "tasks",
});
db.Lead.hasMany(db.loansReport, {
  foreignKey: "leadId",
  as: "loansReport",
});
db.loansReport.belongsTo(db.Lead, {
  foreignKey: "leadId",
  as: "lead",
});
db.HomeLoansReport.belongsTo(db.Lead,{
  foreignKey:"leadId",
  as:"lead"
})

db.Lead.hasMany(db.creditReport, {
  foreignKey: "leadId",
  as: "creditReports", 
});

db.creditReport.belongsTo(db.Lead, {
  foreignKey: "leadId",
  as: "lead",
});
db.Task.belongsTo(db.Lead, {
  foreignKey: "leadId",
  as: "lead",
});
db.Task.belongsTo(db.User, {
  foreignKey: "userId",
  as: "user",
});
module.exports = db;
