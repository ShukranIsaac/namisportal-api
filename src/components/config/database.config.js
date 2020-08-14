const Sequelize = require('sequelize');
const logger = require('morgan');

module.exports = new Sequelize(process.env.DATABASE_URL, {
    dialect: process.env.DATABASE_DIALECT,
    password: process.env.DATABASE_PASSWORD,
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE_NAME,
    logging: logger.bind(this), //(...msg) => console.log(msg) or false
    pool: {
        max: 10,
        min: 0,
        // acquire: 30000,
        // idle: 10000
    },
    // isolation level of each transaction
    // defaults to dialect default
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ
});