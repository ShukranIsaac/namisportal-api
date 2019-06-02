const District = require('../districts/model')
const Polygon = require('../polygons/model')
const Transformer = require('./model')

const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    return Transformer.find({})
            .lean()
            .then(transformers => res.json(transformers))
            .catch((err) =>  console.error(err))
            
})

router.get('/:uid', (req, res) => {
    const { uid } = req.params

    return Transformer.findById(uid)
            .lean()
            .then(transformer => res.json(transformer))
            .catch(err => console.error(err))
})

router.post('/', (req, res, next) => {
    const {
        station,
        mass,
        voltage,
        MVARating,
        yearManufactured,
        manufacturer,
        district,
        region,
        feature,
        primary,
        position,
        feeder,
        location,
        barcode,
        serialNumber,
        cooling,
        SSNumber,
        oilVolume,

    } = req.body

    const summable = req.body.summable ?  Number(req.body.summable) : 0
    const lat = Number(req.body.lat)
    const lng = Number(req.body.lng)

    const newTransformer = {
        properties: {
            station,
            mass,
            voltage,
            MVARating,
            yearManufactured,
            manufacturer,
            district,
            region,
            feature,
            primary,
            position,
            feeder,
            location,
            barcode,
            serialNumber,
            cooling,
            SSNumber,
            oilVolume,
            summable
        },
        geometry: {
            type: 'Point',
            coordinates: {lat, lng}
        },
        geo: {
            type: 'Point',
            coordinates: [lng, lat]
        }
    }
    Transformer.create(newTransformer)
        .then(transformer => res.json(transformer))
        .catch(err => next(err))
})

module.exports = router