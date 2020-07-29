const Sequelize = require('sequelize');
const logger = require('morgan');

module.exports = new Sequelize(process.env.DATABASE_URL, {
    dialect: process.env.DATABASE_DIALECT,
    password: process.env.DATABASE_PASSWORD,
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE_NAME,
    logging: logger.bind(this) //(...msg) => console.log(msg) or false
});