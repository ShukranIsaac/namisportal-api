const mongoose = require('mongoose')
const db = require('./mongoose-model')
const makeDistributionLinesServive = require('./service')

if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })

const dbConnection = mongoose.connection;
// dbConnection.on('error', console.error.bind(console, 'connection error:'))
// dbConnection.once('open', () =>  console.info('distribution lines connected'));

const distributionLinesServive = makeDistributionLinesServive({db})

module.exports = distributionLinesServive