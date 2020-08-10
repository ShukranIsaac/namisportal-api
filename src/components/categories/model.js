const Sequelize = require('sequelize');
const PostgresORM = require('../config/database.config');

const SubCategory = require('./sub.model');

const Category = PostgresORM.define('categories', {
    _id: { type: Sequelize.STRING, unique: true, allowNull: false },
    name: { type: Sequelize.STRING, unique: true, allowNull: false },
    about: { type: Sequelize.TEXT, allowNull: false },
    shortname: { type: Sequelize.STRING, allowNull: false },
    content: {type: Sequelize.TEXT, allowNull: true}
});

Category.belongsToMany(Category, { 
    through: SubCategory, 
    as: 'category', 
    foreignKey: {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        allowNull: true,
        name: "category"
    } 
});

Category.belongsToMany(Category, { 
    through: SubCategory, 
    as: 'subCategories', 
    foreignKey: {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        allowNull: true,
        name: "subcategory"
    } 
});

module.exports = Category;