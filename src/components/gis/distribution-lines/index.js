const express = require('express')
const router = express.Router()

const distributionLinesService = require('./service')
const upload = require('../../files/upload.middleware')

router.get('/', getAllLines)
router.get('/:uid', getOneLine)

router.post('/upload', upload)

module.exports = router

function getAllLines({query}, res, next)  {
    return distributionLinesService.getAll(query)
        .then( lines => res.json(lines))
        .catch( err => next(err))
}

function getOneLine({params: {uid}}, res, next)  {
    return distributionLinesService.getById(uid)
        .then( lines => res.json(lines))
        .catch( err => next(err))
}

function addNewLines({body}, res, next){
    const {
        district,
        feeder,
        region,
        voltage,
        status,
        conductor,
        primary,
        lineType,
        substation
    } = body
    
    const length = Number(body.length)
    const lat = Number(body.lat)
    const lng = Number(body.lng)

    const newlines = {
        properties: {
            district,
            feeder,
            region,
            voltage,
            status,
            conductor,
            primary,
            lineType,
            substation,
            length
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
    
    return distributionLinesService.addNew(newlines)
        .then(plant => res.json(plant))
        .catch(err => next(err))
}



