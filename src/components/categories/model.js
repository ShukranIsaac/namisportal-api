const Sequelize = require('sequelize');
const PostgresORM = require('../config/database.config');

// const SubCategory = require('./sub.model');

const Category = PostgresORM.define('categories', {
    _id: { type: Sequelize.STRING, unique: true, allowNull: false },
    name: { type: Sequelize.STRING, unique: true, allowNull: false },
    about: { type: Sequelize.TEXT, allowNull: false },
    shortname: { type: Sequelize.STRING, allowNull: false },
    content: {type: Sequelize.TEXT, allowNull: true},
    level: {type: Sequelize.INTEGER, allowNull: true}
});

Category.hasMany(Category, { 
    as: 'subCategories', 
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})
Category.belongsTo(Category, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

module.exports = Category;