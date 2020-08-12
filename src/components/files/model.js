const Sequelize = require('sequelize');
const PostgresORM = require('../config/database.config');

const File = PostgresORM.define('files', {
    _id: { type: Sequelize.STRING, unique: true, allowNull: false },
    name: { type: Sequelize.STRING, unique: true, allowNull: false },
    description: { type: Sequelize.TEXT, allowNull: false },
    size: { type: Sequelize.STRING, allowNull: false, default: false },
    path: { type: Sequelize.STRING, allowNull: false },
    filename: { type: Sequelize.STRING, allowNull: false }
});

module.exports = File
