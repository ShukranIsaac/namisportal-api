const MarepCenter = require('./model')
const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
    MarepCenter.find({})
        .then(centers => res.json(centers))
        .catch(err => res.status(500).send(err))
})

router.get('/:uid', (req, res) => {
    const { uid } = req.params

    MarepCenter.findById(uid)
        .then(center => {
            res.json(center)
        })
})

// router.get('/aggregates', (req, res) => {
//     MarepCenter.aggregate()
//     MarepCenter.count({}).then((centers => console.log(centers)))
//         .catch(err => console.log(err))
// })

module.exports = router



