//TODO
// use async await for crud requests
// create separate routes file
// make script for loading gis data
// make proper endpoints for districts and marep centers
// make transormer, distribution lines, regions, meters models
// find goodly commenting library
// compresss json response
// make goodly README file
// find out how to draww directory structure
const District = require('./model')
const Polygon = require('../polygons/model')
const MarepCenter = require('../marep-centers/model')
const DistributionLines = require('../distribution-lines/model')
const express = require('express')

const fs = require("fs");
const polygonJson = fs.readFileSync(__dirname + '/polygon.test.json')
const docPolygon = JSON.parse(polygonJson)

const router = express.Router()

router.post('/', (req, res, next) => {
    const { name, lat, lng } = req.body

    const district = {
        properties: {
            name
        },
        centroids: {
            lat,
            lng
        }
    }

    const data = req.body;
    console.log(district)
    //res.send('oki')
    District.create(district)
        .then(district => res.json(district))
        .catch(err => res.status(500).send(err))
})
.get('/', (req, res, next) => {
    const opts = [
        { path: 'marepCenters', select: 'geometry' }
      , { path: 'polygons' }
    ]
    const {query: {name}} = req
    if (name !== undefined){
        District.find({properties: {name}})
        .then(districts => res.json(districts[0]))
        .catch(err => res.status(500).send(err))
    }else{
        District.find({})
            .then(districts => {
                res.json(districts)
            })
            .catch(err => res.status(500).send(err))
    }
    
})

/*router.get('/:uid/marep-centers', (req, res) => {
    const { uid } = req.params

    District.findById(uid)
        .populate('marepCenters')
        .then(district => {
            res.json(district.marepCenters)
        })
})*/

router.get('/:name/marep-centers', (req, res) => {
    const { name } = req.params
    District.find({properties: {name}})
        .populate('marepCenters')
        .then(district => {
            res.json(district.marepCenters)
        })
})

router.get('/:uid', (req, res) => {
    const { uid } = req.params
    const opts = [
        { path: 'marepCenters', select: 'geometry' }
      , { path: 'polygons', select: 'geometry' }
      , { path: 'distributionLines', select: 'geometry' }
    ]

    District.findById(uid)
        //.populate(opts)
        .then(district => {
            res.json(district)
        })
        .catch(err => res.status(500).send(err))
})

router.post('/:uid/marep-centers/:muid', (req, res, next) => {
    console.log(req.params);
    //res.send('oki')

    const { uid, muid} = req.params;

    District.findById(uid)
        .then( district => {
            district.marepCenters.push({_id: muid})

            district.save()
                .then(center => res.json(center))
                .catch(err => res.status(500).send(err))
        })
        .catch(err => res.status(500).send(err))
})

router.get('/:uid/polygons', (req, res) => {
    const { uid, puid} = req.params;

    District.findById(uid)
        .populate('polygons')
        .then( district => {
            console.log(district.polygons)
            return res.json(district.polygons)
        } )
        .catch(err => res.status(500).send(err))
})

router.post('/:uid/polygons/:puid', (req, res, next) => {
    console.log(req.params);
    //res.send('oki')

    const { uid, puid} = req.params;

    District.findById(uid)
        .then( district => {
            district.polygons.push({_id: puid})

            district.save()
                .then(polygon => res.json(polygon))
                .catch(err => res.status(500).send(err))
        })
        .catch(err => res.status(500).send(err))
})

router.get('/:uid/polygons/:puid', (req, res) => {
    const { uid, puid} = req.params;

    Polygon.findById(puid)
        .then( polygon => {
            console.log(polygon)
            return res.json(polygon)
        } )
        .catch(err => res.status(500).send(err))
})

router.get('/:uid/distribution-lines/:puid', (req, res) => {
    const { uid, puid} = req.params;

    DistributionLines.findById(puid)
        .then( polygon => {
            console.log(polygon)
            return res.json(polygon)
        } )
        .catch(err => res.status(500).send(err))
})

router.get('/:uid/distribution-lines', (req, res) => {
    const { uid } = req.params

    District.findById(uid)
        .populate('distributionLines')
        .then(district => {
            res.json(district.distributionLines)
        })
        .catch(err => res.status(500).send(err))
})



router.post('/:uid/polygons', async (req, res, next) => {
    console.log(req.params);
    //res.send('oki')

    const { uid } = req.params;
    
    const {_id} = await Polygon.create({geometry: docPolygon})

    District.findById(uid)
        .then( district => {
            district.polygons.push({ _id })

            district.save()
                 .then(polygon => res.json(polygon))
                 .catch(err => res.status(500).send(err))
        })
        .catch(err => res.status(500).send(err))
})

router.post('/:uid/marep-centers', async (req, res) => {
    const { uid } = req.params;
    const { _id } = await MarepCenters.create({geometry: docPolygon})
})



/*router.get('/', (req, res, next) => {
    const opts = [
        { path: 'marepCenters', select: 'geometry' }
      , { path: 'polygons' }
    ]
    District.find({})
        .populate(opts)
        .then(centers => res.json(centers))
        .catch(err => res.status(500).send(err))
})*/

module.exports = router



