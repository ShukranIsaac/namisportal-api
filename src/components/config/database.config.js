const Sequelize = require('sequelize');
const logger = require('morgan');

const DATABASE_URL = process.env.NODE_ENV !== 'production'? `${process.env.DATABASE_URL}` : 'postgres://namis@localhost:5432/namisportal'

const DATABASE_USER = process.env.NODE_ENV !== 'production'? `${process.env.DATABASE_USER}` : 'namis'

const DATABASE_PASSWORD = process.env.NODE_ENV !== 'production'? `${process.env.DATABASE_PASSWORD}` : 'namis@123'

const DATABASE_DIALECT = process.env.NODE_ENV !== 'production'? `${process.env.DATABASE_DIALECT}` : 'postgres'

const DATABASE_NAME = process.env.NODE_ENV !== 'production'? `${process.env.DATABASE_NAME}` : 'namisportal'

module.exports = new Sequelize(DATABASE_URL, {
    dialect: DATABASE_DIALECT,
    password: DATABASE_PASSWORD,
    user: DATABASE_USER,
    database: DATABASE_NAME,
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

// psql -h ec2-34-194-198-176.compute-1.amazonaws.com -p 5432 -d dldjaab0u9g55 -U vdssmrfbnomigk -W -f namisportaldump.sql

// module.exports = new Sequelize('postgres://vdssmrfbnomigk:198b00bd8259c15f4e7e2836a779535568dce85b5e189fce9cbd8e81568b3264@ec2-34-194-198-176.compute-1.amazonaws.com:5432/dldjaab0u9g55', {
//     dialect: "postgres",
//     password: "198b00bd8259c15f4e7e2836a779535568dce85b5e189fce9cbd8e81568b3264",
//     user: "vdssmrfbnomigk",
//     database: "dldjaab0u9g55",
//     host: "ec2-34-194-198-176.compute-1.amazonaws.com",
//     logging: logger.bind(this), //(...msg) => console.log(msg) or false
//     dialectOptions: {
//         ssl: {
//             require: true,
//             rejectUnauthorized: false // <<<<<<< YOU NEED THIS
//         }
//     },
//     pool: {
//         max: 10,
//         // acquire: 30000,
//         // idle: 100,
//         // maxUses: Infinity
//     },
//     // isolation level of each transaction
//     // defaults to dialect default
//     isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ
// });