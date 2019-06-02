const express = require('express')
const router = express.Router()

const powerPlantsService = require('./service')

router.get('/', getAllPlants)
router.get('/:uid', getOnePlant)
router.get('/:uid/filters', getFilters)

router.post('/', addNewPlant)

module.exports = router

function getAllPlants({query}, res, next)  {
    return powerPlantsService.getAll(query)
        .then( plants => res.json(plants))
        .catch( err => next(err))
}

function getOnePlant({params: {uid}}, res, next)  {
    return powerPlantsService.getById(uid)
        .then( plant => res.json(plant))
        .catch( err => next(err))
}

function addNewPlant({body}, res, next){
    const {
        status,
        plantType,
        region,
        district,
        name,
        ta
    } = body

    const capacityInMW = body.capacityInMW ?  Number(body.capacityInMW) : 0
    const lat = Number(body.lat)
    const lng = Number(body.lng)

    const newPlant = {
        properties: {
            status,
            plantType,
            region,
            district,
            name,
            ta,
            capacityInMW
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
    
    return powerPlantsService.addNew(newPlant)
        .then(plant => res.json(plant))
        .catch(err => next(err))
}

function getPlantTypes() {
    return new Promise((resolve, reject) => {
        return powerPlantsService.getPlantTypes()
            .then( plantTypes => {
                const typesArray = plantTypes.map(plantType => {
                    return plantType.properties.plantType
                })
                var uniq = [ ...new Set(typesArray) ];
                resolve(uniq)

            })
    })
}

function getCapacities() {

    return new Promise((resolve, reject) => {
        return powerPlantsService.getCapacities()
        .then( capacities => {
            const typesArray = capacities.map(({properties: {capacityInMW}}) => {
                if (capacityInMW > 50)
                    return 'above 50MW'
                else{
                    return 'below 50MW'
                }
            })
            var uniq = [ ...new Set(typesArray) ];
            resolve(uniq)

        })
    })
    
}

async function getFilters(req, res, next) {
    const capacities = await getCapacities()
    const plantTypes = await getPlantTypes()

    const filters = [
        {capacities},
        {plantTypes}
    ]

    res.json(filters)
}

