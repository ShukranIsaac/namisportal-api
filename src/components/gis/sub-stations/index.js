const express = require('express')
const router = express.Router()

const subStationService = require('./service')

router.get('/', getAllSubStations)
router.get('/:uid', getOneSubStation)

router.post('/', addNewSubStation)

module.exports = router

function getAllSubStations({query}, res, next)  {
    return subStationService.getAll(query)
        .then( stations => res.json(stations))
        .catch( err => next(err))
}

function getOneSubStation({params: {uid}}, res, next)  {
    return subStationService.getById(uid)
        .then( station => res.json(station))
        .catch( err => next(err))
}

function addNewSubStation({body}, res, next){
    const {
        region, 
        ta,
        location,
        district, 
        secondary,
        transmission,
        asset,
        name
    } = body
    
    const lat = Number(body.lat)
    const lng = Number(body.lng)

    const newStation = {
        properties: {
            region, 
            ta,
            location,
            district, 
            secondary,
            transmission,
            asset,
            name
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
    
    return subStationService.addNew(newStation)
        .then(plant => res.json(plant))
        .catch(err => next(err))
}



