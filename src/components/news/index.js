const express = require('express')
const router = express.Router()
const jwtm = require('../../middlewares/jwt')

const newsService = require('./service')
const fileUploadMiddleware = require('../files/upload.middleware')

router.get('/', getAllNews)
router.get('/:uid', getOneNews)
router.get('/:uid/images', getImages)

router.post('/', jwtm, addNews)
router.use('/:uid/files', jwtm, fileUploadMiddleware)
router.patch('/:uid/', jwtm, updateNews)
router.delete('/:uid/', jwtm, deleteNews)

module.exports = router

function getAllNews(req, res, next)  {  
    return newsService.getAll()
        .then( News => res.json(News))
        .catch( err => next(err))
}

function getOneNews({params: {uid}}, res, next)  {
    return newsService.getById(uid)
        .then( News => res.json(News))
        .catch( err => next(err))
}

function getImages({params: {uid}}, res, next)  {
    return newsService.getDocuments(uid)
        .then( News => res.json(News.documents))
        .catch( err => next(err))
}

function deleteNews({params: {uid}}, res, next)  {
    return newsService.delete(uid)
        .then( News => res.json(News))
        .catch( err => next(err))
}

function updateNews({params: {uid}, body}, res, next)  {
    return newsService.getByIdMongooseUse(uid)
        .then( News => {
            doUpdate(News, body)
            .then( updatedCat => res.json(updatedCat))
            .catch( err => next(err))
        })
        .catch( err => next(err))
}

function addNews({body}, res, next){
    return newsService.createOne(body)
        .then( newNews => res.json(newNews) )
        .catch( err => next(err))
}

function addFile({params: uid}, res, next){

    return newsService.createOne(body)
        .then( newNews => res.json(newNews) )
        .catch( err => next(err))
}


async function doUpdate(document, props){
    document.set(props)
    return await document.save()
}
