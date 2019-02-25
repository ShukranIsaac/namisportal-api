const express = require('express')
const router = express.Router()

const powerPlantsService = require('./service')

router.get('/', getAllPlants)
router.get('/:uid', getOnePlant)

module.exports = router

function getAllPlants(req, res, next)  {
    return powerPlantsService.getAll()
        .then( plants => res.json(plants))
        .catch( err => next(err))
}

function getOnePlant({params: {uid}}, res, next)  {
    return powerPlantsService.getById(uid)
        .then( plant => res.json(plant))
        .catch( err => next(err))
}