const dbConfig = require("./../configs/db.config");
const Sequelize = require("sequelize");
console.log(dbConfig)
const sequelize = new Sequelize('Creditmitra', 'root', ' ', {
  host: 'localhost',
  dialect: 'mysql',
  // operatorsAliases: false, // Set to false for best practice
  timezone: "+05:30", // Set the timezone for your region
  logging: false, // Disable logging for production
  dialectOptions: {
    dateStrings: true, // Ensures dates are returned as strings
    typeCast: function (field, next) {
      if (field.type === "DATETIME") {
        return field.string(); // Converts DATETIME fields to strings
      }
      return next();
    },
  },
  pool: {
    max: dbConfig.pool.max, // Maximum number of connections
    min: dbConfig.pool.min, // Minimum number of connections
    acquire: dbConfig.pool.acquire, // Maximum time (ms) to try getting a connection before throwing an error
    idle: dbConfig.pool.idle, // Maximum time (ms) that a connection can be idle before being released
  },
});

const db = {};

// Add Sequelize and sequelize instances to db object
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models and associate them
db.Lead = require("./lead.model")(sequelize, Sequelize);
db.User = require("./user.model")(sequelize, Sequelize);
db.LeadAssignment = require("./LeadAssignment.model")(sequelize, Sequelize);
db.Task = require("./task.model")(sequelize, Sequelize);
db.loansReport = require("./loansReport.modal")(sequelize,Sequelize);
db.creditReport=require("./creditReport.modal")(sequelize,Sequelize);

// Define associations
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
