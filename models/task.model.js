// // models/leadAssignment.model.js
// module.exports = (sequelize, Sequelize) => {
//     const task = sequelize.define(
//         "task",
//         {
//             title:{
//                     type: Sequelize.STRING,
//                     allowNull: true
//             },
//             description:{
//                 type: Sequelize.STRING,
//                 allowNull: true
//             },
//             status:{
//                 type: Sequelize.STRING,
//                 allowNull: true
//             },
//             userId: {
//                 type: Sequelize.INTEGER,
//                 references: {
//                   model: 'Users',
//                   key: 'id'
//                 },
//             },
//                 leadId: {
//                     type: Sequelize.INTEGER,
//                     references: {
//                         model: 'Lead',
//                         key: 'id',
//                     },
//                     allowNull: false,
//                 },  
//         },
//         {
//             timestamps: false,
//             underscored: true,
//             freezeTableName: true,
//         }
//     );

//     return task;
// };
