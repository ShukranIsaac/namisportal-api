const District = require('../districts/model')
const Polygon = require('../polygons/model')
const Region = require('./model')

const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    return Region.find({})
            .populate('districts', 'properties')
            .lean()
            .then(regions => res.json(regions))
            .catch((err) =>  console.error(err))
            
})

router.get('/:uid', (req, res) => {
    const { uid } = req.params
    const opts = [
        { path: 'polygons', select: 'geometry' },
        { path: 'districts', select: 'properties' }
    ]

    return Region.findById(uid)
            .populate(opts)
            .lean()
            .then(region => res.json(region))
})

router.get('/:uid/districts', (req, res) => {
    const { uid } = req.params

    return Region.findById(uid)
            .populate('districts')
            .lean()
            .then(region => res.json(region.districts))
})

module.exports = router