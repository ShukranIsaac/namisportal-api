const bodyParser  = require('body-parser')
const mongoose = require('mongoose')
const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')

const jwt = require('./middlewares/jwt')
const users = require('./components/users')
const regions = require('./components/gis/regions')
const transformers = require('./components/gis/transformers')
const marepCenters = require('./components/gis/marep-centers')
const districts = require('./components/gis/districts/index')

//const routes = require('./routes')
const db = mongoose.connection;

const app = express()


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

//app.use(routes)

 app.use('/marep-centers', marepCenters);
 app.use('/transformers', transformers)
 app.use('/districts', districts)
 app.use('/regions', regions)

 // use JWT auth to secure the api
//app.use(jwt())

app.use('/users', users)


db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () =>  console.info('connekitedi'));

dotenv.config()

const PORT = process.env.PORT || '3300'

app.get('/', function (req, res) {  
     res.json({
         message: 'hello world'
     })
})

app.listen(PORT, () => {
  console.log(`server up at ${PORT}`) 

  mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true })
})

module.exports = app