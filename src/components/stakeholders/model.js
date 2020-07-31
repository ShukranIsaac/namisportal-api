const Sequelize = require('sequelize');
const PostgresORM = require('../config/database.config');

const Stakeholder = PostgresORM.define('stakeholders', {
    _id: { type: Sequelize.STRING, unique: true, allowNull: false },
    name: { type: Sequelize.STRING, unique: true, allowNull: false },
    about: { type: Sequelize.TEXT, allowNull: false },
    mission: { type: Sequelize.TEXT, allowNull: false },
    vision: { type: Sequelize.TEXT, allowNull: false },
    image: { type: Sequelize.TEXT, allowNull: false }
});

module.exports = Stakeholder;