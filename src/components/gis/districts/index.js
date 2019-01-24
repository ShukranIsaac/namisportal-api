const express = require('express')
const router = express.Router()

const districtsService = require('./service')

router.get('/', getAllDistricts)
router.get('/:uid', getOneDistrict)
router.get('/:uid/polygons', getPolygons)
router.get('/:uid/transformers', getTransformers)
router.get('/:uid/marep-centers', getMarepCenters)
router.get('/:uid/distribution-lines', getDistrinutionLines)

module.exports = router

function getAllDistricts({query: {name}}, res, next)  {
    return districtsService.getAll(name)
        .then( districts => res.json(districts))
        .catch( err => next(err))
}

function getOneDistrict({params: {uid}}, res, next)  {
    return districtsService.getById(uid)
        .then( districts => res.json(districts))
        .catch( err => next(err))
}

function getPolygons({params: {uid}}, res, next)  {
    return districtsService.getPolygons(uid)
        .then( districts => res.json(districts.polygons))
        .catch( err => next(err))
}

function getTransformers({params: {uid}}, res, next)  {
    return districtsService.getTransformers(uid)
        .then( districts => res.json(districts.transformers))
        .catch( err => next(err))
}

function getMarepCenters({params: {uid}}, res, next)  {
    return districtsService.getMarepcenters(uid)
        .then( districts => res.json(districts.marepCenters))
        .catch( err => next(err))
}

function getDistrinutionLines({params: {uid}}, res, next)  {
    return districtsService.getDistributionLines(uid)
        .then( districts => res.json(districts.distributionLines))
        .catch( err => next(err))
}