const Sequelize = require('sequelize');
const PostgresORM = require('../config/database.config');
const Category = require('../categories/model');
const Stakeholder = require('../stakeholders/model');

const File = PostgresORM.define('files', {
    _id: { type: Sequelize.STRING, unique: true, allowNull: false },
    name: { type: Sequelize.STRING, unique: true, allowNull: true },
    description: { type: Sequelize.TEXT, allowNull: true },
    size: { type: Sequelize.STRING, allowNull: false, default: false },
    path: { type: Sequelize.STRING, allowNull: false },
    filename: { type: Sequelize.STRING, allowNull: false }
});

File.hasMany(Category)
Category.belongsTo(File)

File.hasMany(Stakeholder)
Stakeholder.belongsTo(File)

module.exports = File
