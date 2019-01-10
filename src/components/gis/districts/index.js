const District = require('./model')
const Polygon = require('../polygons/model')
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

router.get('/', (req, res, next) => {
    const opts = [
        { path: 'marepCenters', select: 'geometry' }
      , { path: 'polygons' }
    ]
    District.find({})
        .populate(opts)
        .then(centers => res.json(centers))
        .catch(err => res.status(500).send(err))
})

module.exports = router



