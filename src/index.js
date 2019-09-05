const bodyParser  = require('body-parser')
const mongoose = require('mongoose')
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')


const session = require('express-session')
const MongoStore = require('connect-mongo')(session)


if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const news = require('./components/news')
const files = require('./components/files')
const users = require('./components/users')
const contacts = require('./components/contacts')
const regions = require('./components/gis/regions')
const categories = require('./components/categories')
const powerPlants = require('./components/gis/power-plants')
const subStations = require('./components/gis/sub-stations')
const transformers = require('./components/gis/transformers')
const marepCenters = require('./components/gis/marep-centers')
const districts = require('./components/gis/districts/index')
const stakeHolders = require('./components/stakeholders/index')
const distributionLines = require('./components/gis/distribution-lines')

//const routes = require('./routes')
const db = mongoose.connection;

const app = express()

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
      mongooseConnection: db,
      ttl: 5 * 24 * 60 * 60,
      touchAfter: 24 * 3600 // time period in seconds
  })
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

//app.use(routes)
app.use(helmet())
app.use('/distribution-lines', distributionLines)
app.use('/power-plants', powerPlants)
app.use('/marep-centers', marepCenters)
app.use('/stakeholders', stakeHolders)
app.use('/transformers', transformers)
app.use('/sub-stations', subStations)
app.use('/categories', categories)
app.use('/districts', districts)
app.use('/regions', regions)
app.use('/contacts', contacts)
app.use('/files', files)
app.use('/news', news)

 // use JWT auth to secure the api


app.use('/users', users)

//handle middleware
app.use((error, req, res, next) => {
  console.log(error)
  error = error.message ? error : {error}
  return res.status(422).json(error)
})

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () =>  console.info('connekitedi'));


const PORT = process.env.PORT || '3300'

app.get('/', function (req, res) {  
     res.json({
         message: 'hello world'
     })
})

app.listen(PORT, () => {
  console.log(`server up at ${PORT}`) 

  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
})

module.exports = app