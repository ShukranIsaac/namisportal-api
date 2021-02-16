const bodyParser = require('body-parser')
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const logger = require('morgan');
const rfs = require('rotating-file-stream')
const path = require('path')

const session = require('express-session')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const files = require('./components/files')
const users = require('./components/users')
const contacts = require('./components/contacts')
const categories = require('./components/categories')
const stakeHolders = require('./components/stakeholders/index')

const app = express()

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}))

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, '../logs')
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(logger('[:date[web]] :method :url :status :res[content-length] - :remote-addr - :response-time ms'))
app.use(logger('[:date[web]] :method :url :status :res[content-length] - :remote-addr - :response-time ms',
    { stream: accessLogStream }))

app.use(helmet())
app.use('/stakeholders', stakeHolders)
app.use('/categories', categories)
app.use('/contacts', contacts)
app.use('/files', files)

// use JWT auth to secure the api
app.use('/users', users)

//handle middleware
app.use((error, req, res, next) => {
    error = error.message ? error : { error }
    return res.status(422).json(error)
})

const PORT = process.env.PORT || '8083';
const HOSTNAME = '127.0.0.1';

app.get('/', function (req, res) {
    res.json({
        message: 'Successfully connected...'
    })
})

app.listen(PORT, () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}`)
})

module.exports = app