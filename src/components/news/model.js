const Sequelize = require('sequelize');
const PostgresORM = require('../config/database.config');

const News = PostgresORM.define('news', {
    _id: { type: Sequelize.STRING, unique: true, allowNull: false },
    title: { type: Sequelize.STRING, allowNull: false },
    article: { type: Sequelize.STRING, allowNull: false },
    isPublished: { type: Sequelize.BOOLEAN, allowNull: false, default: false }
});

module.exports = News;