const Sequelize = require('sequelize');
const PostgresORM = require('../config/database.config');
const { User, Role } = require('./user.model');

const UserRole = PostgresORM.define('userroles', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userid: {
        type: Sequelize.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    roleid: {
        type: Sequelize.INTEGER,
        references: {
            model: Role,
            key: 'id'
        }
    }
});

module.exports = UserRole;