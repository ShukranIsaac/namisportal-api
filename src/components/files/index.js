const express = require('express')
const router = express.Router()
const uploads = express.Router()
const nodePath = require('path')

const filesService = require('./service')
const upload = require('./upload.middleware')

router.get('/', getAllFiles)
router.get('/:uid', getOneFile)

router.use('/upload', upload)
router.patch('/:uid/', updateFile)
router.get('/download/:uid', downloadFile)

module.exports = router

function getAllFiles({query: {name}}, res, next)  {
    return filesService.getAll(name)
        .then( files => res.json(files))
        .catch( err => next(err))
}

function getOneFile({params: {uid}}, res, next)  {
    return filesService.getById(uid)
        .then( file => res.json(file))
        .catch( err => next(err))
}

function downloadFile({params: {uid}}, res, next)  {
    return filesService.getByIdMongooseUse(uid)
        .then( ({path, name}) => res.download( path, `${name}.${nodePath.extname(path)}`, err => next(err)))
        .catch( err => next(err))
}

function updateFile({params: {uid}, body}, res, next)  {
    return categoriesService.getByIdMongooseUse(uid)
        .then( file => {
            doUpdate(file, body)
            .then( updatedFile => res.json(updatedFile))
            .catch( err => next(err))
        })
        .catch( err => next(err))
}

async function doUpdate(document, props){
    document.set(props)
    return await document.save()
}