const MarepCenter = require('./model')
const express = require('express')

const router = express.Router()

router.post('/', (req, res, next) => {
    const data = req.body;
    console.log(req.body)
    MarepCenter.create(data)
        .then(center => res.json(center))
        .catch(err => res.status(500).send(err))
})

router.get('/', (req, res, next) => {
    MarepCenter.find({})
        .then(centers => res.json(centers))
        .catch(err => res.status(500).send(err))
})

module.exports = router



