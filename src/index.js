const bodyParser  = require('body-parser')
const mongoose = require('mongoose')
const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')

const marepCenters = require('./components/gis/marep-centers')
const districts = require('./components/gis/districts')
const db = mongoose.connection;

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cors)


app.use('/marep-centers', marepCenters);
app.use('/districts', districts)

db.on('error', console.error.bind(console, 'connection error:'));
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