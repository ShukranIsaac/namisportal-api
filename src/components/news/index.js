const express = require('express')
const router = express.Router()
const jwtm = require('../../middlewares/jwt')

const newsService = require('./service')
const fileUploadMiddleware = require('../files/upload.middleware')
const Status = require('../status.codes')

router.get('/', getAllNews)
router.get('/:uid', getOneNews)
router.get('/:uid/images', getImages)

router.post('/', jwtm, addNews)
router.use('/:uid/files', jwtm, fileUploadMiddleware)
router.put('/:uid/', jwtm, updateNews)
router.patch('/:uid/', jwtm, updateNews)
router.delete('/:uid/', jwtm, deleteNews)

module.exports = router

async function getAllNews(req, res, next)  {  
    return await newsService.getAll()
        .then(news => res.json(news))
        .catch(err => next(err))
}

async function getOneNews({params: {uid}}, res, next)  {
    return await newsService.getById(uid)
        .then( News => res.json(News))
        .catch( err => next(err))
}

async function getImages({params: {uid}}, res, next)  {
    return await newsService.getDocuments(uid)
        .then(News => res.json(News.documents))
        .catch(err => next(err))
}

async function deleteNews({params: {uid}}, res, next)  {
    return await newsService.delete(uid)
        .then( News => res.json(News))
        .catch( err => next(err))
}

async function updateNews({params: {uid}, body}, res, next)  {
    // return newsService.getByIdMongooseUse(uid)
    //     .then( News => {
    //         doUpdate(News, body)
    //         .then( updatedCat => res.json(updatedCat))
    //         .catch( err => next(err))
    //     })
    //     .catch( err => next(err))
    const article = await newsService.get(uid);

    await article.update(body)

    return await article.reload()
        .then(({ 
            dataValues: { 
                id, isPublished, ...rest 
            } 
        }) => res.status(Status.STATUS_OK).send(rest))
        .catch(error => res.status(Status.STATUS_INTERNAL_SERVER_ERROR).send({
            success: false,
            message: 'Failed to update article: ' + error
        }))
}

async function addNews({body}, res, next){
    return await newsService.createOne(body)
        .then( newNews => res.json(newNews) )
        .catch( err => next(err))
}

async function addFile({params: uid}, res, next){
    return await newsService.createOne(body)
        .then( newNews => res.json(newNews) )
        .catch( err => next(err))
}

async function doUpdate(document, props){
    document.set(props)
    return await document.save()
}
