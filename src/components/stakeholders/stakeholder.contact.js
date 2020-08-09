const Sequelize = require('sequelize');
const PostgresORM = require('../config/database.config');
const Contact = require('../contacts/model');
const Stakeholder = require('./model');

const StakeholderContact = PostgresORM.define('stakeholdercontacts', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    stakeholderid: {
        type: Sequelize.INTEGER,
        references: {
            model: Stakeholder,
            key: 'id'
        }
    },
    contactid: {
        type: Sequelize.INTEGER,
        references: {
            model: Contact,
            key: 'id'
        }
    }
});

module.exports = StakeholderContact;