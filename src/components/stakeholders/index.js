const express = require('express')
const router = express.Router()
const jwtm = require('../../middlewares/jwt')

const stakeholderService = require('./service')
const fileUploadMiddleware = require('../files/upload.middleware')
const Status = require('../status.codes')

router.get('/', getAllStakeholders)
router.get('/:uid', getOneStakeholder)

router.post('/', addStakeholder)
router.patch('/:uid', updateStakeholder)
router.put('/:uid', updateStakeholder)
router.delete('/:uid', deleteStakeholder)
router.use('/:uid/files', /*jwtm,*/ fileUploadMiddleware)

module.exports = router

async function getAllStakeholders(req, res, next)  {
    const { baseUrl, query: {name}} = req
    return await stakeholderService.getAll(name)
        .then(stakeholders => res.json(stakeholders))
        .catch(err => next(err))
}

async function getOneStakeholder({params: {uid}}, res, next)  {
    return await stakeholderService.getStakeholderById(uid)
        .then(({ dataValues: { contacts, ...rest } }) => {
            return res.status(Status.STATUS_OK)
                .send(Object.assign(rest, { 
                    contacts: contacts[0].dataValues 
                }));
        })
        .catch(err => next(err))
}

async function deleteStakeholder({params: {uid}}, res, next)  {
    return await stakeholderService.delete(uid)
        .then( stakeholder => res.json(stakeholder))
        .catch( err => next(err))
}   

async function updateStakeholder(req, res, next)  {
    return await stakeholderService.getById(req.params.uid)
        .then(stakeholder => {
            console.log(req.files)
            // doUpdate(stakeholder, body)
            // .then( updated => res.json(updated) )
            // .catch( err => next(err))
            return res.json(stakeholder);
        })
        .catch(err => next(err) )
}

async function addStakeholder({body}, res, next){
    return await stakeholderService.createOne(body, res)
        .then(({ dataValues }) => res.json(dataValues))
        .catch(err => next(err))
}

async function doUpdate(stakeholder, props){
    await stakeholder.update(props);
    return await stakeholder.reload();
}
