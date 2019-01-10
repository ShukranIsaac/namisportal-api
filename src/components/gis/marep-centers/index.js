const MarepCenter = require('./model')
const express = require('express')

const router = express.Router()

router.post('/', (req, res, next) => {

    const { _type, lat, lng, name } = req.body

    const center = {
        properties: { name },
        geometry: {
            _type,
            coordinates: {lat, lng}
        }
    }

    const data = req.body;
    console.log(center)
    //res.send('oki')
    MarepCenter.create(center)
        .then(center => res.json(center))
        .catch(err => res.status(500).send(err))
})

router.get('/', (req, res, next) => {
    MarepCenter.find({})
        .then(centers => res.json(centers))
        .catch(err => res.status(500).send(err))
})

module.exports = router



