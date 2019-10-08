const express = require('express')
const router = express.Router()
const nodePath = require('path')
const jwtm = require('../../middlewares/jwt')

const filesService = require('./service')
const upload = require('./upload.middleware')

router.get('/', getAllFiles)
router.get('/:uid', getOneFile)

router.patch('/:uid', jwtm, upload)
router.use('/upload', jwtm,  upload)
router.get('/download/:uid', downloadFile)
router.use('/images', express.static(require('path').join(__dirname, '../../../docs')))
router.use('/docs', express.static(require('path').join(__dirname, '../../../docs')))

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