const express = require('express')
const router = express.Router()
const jwtm = require('../../middlewares/jwt')

const stakeholderService = require('./service')
const fileUploadMiddleware = require('../files/upload.middleware')

router.get('/', getAllStakeholders)
router.get('/:uid', getOneStakeholder)

router.post('/', addStakeholder)
router.patch('/:uid', updateStakeholder)
router.delete('/:uid', deleteStakeholder)
router.use('/:uid/files', jwtm, fileUploadMiddleware)

module.exports = router

function getAllStakeholders(req, res, next)  {
    const { baseUrl, query: {name}} = req
    console.log(baseUrl)
    return stakeholderService.getAll(name)
        .then( stakeholders => res.json(stakeholders))
        .catch( err => next(err))
}

function getOneStakeholder({params: {uid}}, res, next)  {
    return stakeholderService.getById(uid)
        .then( stakeholder => res.json(stakeholder))
        .catch( err => next(err))
}

function deleteStakeholder({params: {uid}}, res, next)  {
    return stakeholderService.delete(uid)
        .then( stakeholder => res.json(stakeholder))
        .catch( err => next(err))
}   

function updateStakeholder({params: {uid}, body}, res, next)  {
    return stakeholderService.getByIdMongooseUse(uid)
        .then( stakeholder => {
            doUpdate(stakeholder, body)
            .then( updated => res.json(updated))
            .catch( err => next(err))
        })
        .catch( err => next(err))
}

function addStakeholder({body}, res, next){
    return stakeholderService.createOne(body)
        .then( newCategory => res.json(newCategory) )
        .catch( err => next(err))
}

async function doUpdate(document, props){
    document.set(props)
    return await document.save()
}
