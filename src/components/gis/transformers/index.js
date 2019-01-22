const District = require('../districts/model')
const Polygon = require('../polygons/model')
const Transformer = require('./model')

const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    return Transformer.find({})
            .then(transformers => res.json(transformers))
            .catch((err) =>  console.error(err))
            
})

router.get('/:uid', (req, res) => {
    const { uid } = req.params

    return Transformer.findById(uid)
            .then(transformer => res.json(transformer))
            .catch(err => console.error(err))
})

module.exports = router