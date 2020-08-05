const Sequelize = require('sequelize');
const PostgresORM = require('../config/database.config');
const Category = require('./model');

var SubCategory = PostgresORM.define('subcategories', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    category: {
        type: Sequelize.INTEGER,
        references: {
            model: Category,
            key: 'id'
        }
    },
    subcategory: {
        type: Sequelize.INTEGER,
        references: {
            model: Category,
            key: 'id'
        }
    },
})

module.exports = SubCategory;