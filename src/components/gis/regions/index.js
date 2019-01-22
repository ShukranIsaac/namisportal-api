const District = require('../districts/model')
const Polygon = require('../polygons/model')
const Region = require('./model')

const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    return Region.find({})
            .then(regions => res.json(regions))
            .catch((err) =>  console.error(err))
            
})

router.get('/:uid', (req, res) => {
    const { uid } = req.params
    return Region.findById(uid)
            .populate('polygons')
            .then(region => res.json(region))
})

router.get('/:uid/districts', (req, res) => {
    const { uid } = req.params

    return Region.findById(uid)
            .populate('districts')
            .then(region => res.json(region.districts))
})

module.exports = router