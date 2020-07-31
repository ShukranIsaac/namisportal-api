const bodyParser  = require('body-parser')
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const logger = require('morgan');

const session = require('express-session')
// const MongoStore = require('connect-mongo')(session)

if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const news = require('./components/news')
const files = require('./components/files')
const users = require('./components/users')
const contacts = require('./components/contacts')
const categories = require('./components/categories')
const stakeHolders = require('./components/stakeholders/index')

//const routes = require('./routes')
// const db = mongoose.connection;

const app = express()

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    // store: new MongoStore({
    //     mongooseConnection: db,
    //     ttl: 5 * 24 * 60 * 60,
    //     touchAfter: 24 * 3600 // time period in seconds
    // })
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(logger('dev'))

//app.use(routes)
// app.use(helmet())
app.use('/stakeholders', stakeHolders)
app.use('/categories', categories)
app.use('/contacts', contacts)
app.use('/files', files)
app.use('/news', news)

 // use JWT auth to secure the api
app.use('/users', users)

//handle middleware
app.use((error, req, res, next) => {
    error = error.message ? error : {error}
    return res.status(422).json(error)
})

// db.on('error', console.error.bind(console, 'connection error:'))
// db.once('open', () =>  console.info('MongoDB successfully connected!'));

const PORT = process.env.PORT || '8083';
const HOSTNAME = '127.0.0.1';

app.get('/', function (req, res) {  
    res.json({
        message: 'Successfully connected...'
    })
})

app.listen(PORT, () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}`) 
    // mongoose.connect(`mongodb://${HOSTNAME}/admin`, { 
    //     useNewUrlParser: true, 
    //     useUnifiedTopology: true,
    //     useCreateIndex:true,
    // })
})

module.exports = app