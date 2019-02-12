const bodyParser  = require('body-parser')
const mongoose = require('mongoose')
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')


if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const files = require('./components/files')
const users = require('./components/users')
const regions = require('./components/gis/regions')
const categories = require('./components/categories')
const transformers = require('./components/gis/transformers')
const marepCenters = require('./components/gis/marep-centers')
const districts = require('./components/gis/districts/index')
const stakeHolders = require('./components/stakeholders/index')

//const routes = require('./routes')
const db = mongoose.connection;

const app = express()


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

//app.use(routes)
app.use(helmet())
app.use('/marep-centers', marepCenters)
app.use('/stakeholders', stakeHolders)
app.use('/transformers', transformers)
app.use('/categories', categories)
app.use('/districts', districts)
app.use('/regions', regions)
app.use('/files', files)

 // use JWT auth to secure the api


app.use('/users', users)


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