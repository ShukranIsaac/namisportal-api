const Sequelize = require('sequelize');
const PostgresORM = require('../config/database.config');

const Contact = PostgresORM.define('contacts', {
    _id: { type: Sequelize.STRING, unique: true, allowNull: false },
    email: { type: Sequelize.STRING, unique: true, allowNull: true },
    telephone: { type: Sequelize.STRING, unique: true, allowNull: true },
    website: { type: Sequelize.STRING, allowNull: true },
    address: { type: Sequelize.STRING, allowNull: false }
});

module.exports = Contact;