const Sequelize = require('sequelize');
const logger = require('morgan');

// module.exports = new Sequelize(process.env.DATABASE_URL, {
//     dialect: process.env.DATABASE_DIALECT,
//     password: process.env.DATABASE_PASSWORD,
//     user: process.env.DATABASE_USER,
//     database: process.env.DATABASE_NAME,
//     logging: logger.bind(this), //(...msg) => console.log(msg) or false
//     pool: {
//         max: 1,
//         // acquire: 30000,
//         // idle: 10000
//     },
//     // isolation level of each transaction
//     // defaults to dialect default
//     isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ
// });

module.exports = new Sequelize('postgres://vdssmrfbnomigk:198b00bd8259c15f4e7e2836a779535568dce85b5e189fce9cbd8e81568b3264@ec2-34-194-198-176.compute-1.amazonaws.com:5432/dldjaab0u9g55', {
    dialect: "postgres",
    password: "198b00bd8259c15f4e7e2836a779535568dce85b5e189fce9cbd8e81568b3264",
    user: "vdssmrfbnomigk",
    database: "dldjaab0u9g55",
    logging: logger.bind(this), //(...msg) => console.log(msg) or false
    pool: {
        max: 10,
        // acquire: 30000,
        // idle: 10000
    },
    // isolation level of each transaction
    // defaults to dialect default
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ
});