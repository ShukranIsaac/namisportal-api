const express = require('express')
const router = express.Router()

const districts = require('./components/gis/districts/index')

router.route('/')
    .get(districts.get)


module.exports = router