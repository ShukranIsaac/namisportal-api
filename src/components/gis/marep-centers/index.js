const MarepCenter = require('./model')
const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
    MarepCenter.find({})
        .then(centers => res.json(centers))
        .catch(err => res.status(500).send(err))
})

router.get('/:uid', (req, res) => {
    const { uid } = req.params

    MarepCenter.findById(uid)
        .then(center => {
            res.json(center)
        })
})

router.post('/', (req, res) => {
    const {region, district, ta, lat, lng} = req.body
    const newCenter = {
        properties: {
            region, district, ta
        },
        geometry: {
            type: 'Point',
            coordinates: {lat: Number(lat), lng: Number(lng)}
        },
        geo: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)]
        }
    }
    MarepCenter.create(newCenter)
        .then(center => res.json(center))
})

module.exports = router



