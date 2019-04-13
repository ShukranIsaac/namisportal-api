const express = require('express')
const router = express.Router()
const jwtm = require('../../middlewares/jwt')

const categoriesService = require('./service')
const fileUploadMiddleware = require('../files/upload.middleware')

router.get('/', getAllCategories)
router.get('/:uid', getOneCategory)
router.get('/:uid/documents', getDocuments)
router.get('/:uid/sub-categories', getSubCategories)
router.get('/:uid/main-sub-category', getMainSubCategory)

router.post('/', jwtm, addCategory)
router.use('/:uid/files', jwtm, fileUploadMiddleware)
router.post('/:uid/sub-categories', jwtm, addSubCategory)
router.post('/:uid/main-sub-category', jwtm, addMainSubcategory)
router.patch('/:uid/', jwtm, updateCategory)
router.delete('/:uid/', jwtm, deleteCategory)

module.exports = router

function getAllCategories({query: {name}}, res, next)  {
    return categoriesService.getAll(name)
        .then( categories => res.json(categories))
        .catch( err => next(err))
}

function getOneCategory({params: {uid}}, res, next)  {
    return categoriesService.getById(uid)
        .then( categories => res.json(categories))
        .catch( err => next(err))
}

function getDocuments({params: {uid}}, res, next)  {
    return categoriesService.getDocuments(uid)
        .then( categories => res.json(categories.documents))
        .catch( err => next(err))
}

function getSubCategories({params: {uid}}, res, next)  {
    return categoriesService.getSubCategories(uid)
        .then( categories => res.json(categories.subCategories))
        .catch( err => next(err))
}

function getMainSubCategory({params: {uid}}, res, next)  {
    return categoriesService.getMainSubCategory(uid)
        .then( category => res.json(category.mainSubCategory))
        .catch( err => next(err))
}

function deleteCategory({params: {uid}}, res, next)  {
    return categoriesService.delete(uid)
        .then( category => res.json(category))
        .catch( err => next(err))
}

function updateCategory({params: {uid}, body}, res, next)  {
    return categoriesService.getByIdMongooseUse(uid)
        .then( category => {
            categoriesService.doUpdate(category, body)
            .then( updatedCat => res.json(updatedCat))
            .catch( err => next(err))
        })
        .catch( err => next(err))
}

function addCategory({body}, res, next){
    return categoriesService.createOne(body)
        .then( newCategory => res.json(newCategory) )
        .catch( err => {console.log(err);return next(err)})
}

function addFile({params: uid}, res, next){

    return categoriesService.createOne(body)
        .then( newCategory => res.json(newCategory) )
        .catch( err => next(err))
}

function addMainSubcategory({params: {uid}, body}, res, next){
    if (body.childUid !== undefined){
        
        return categoriesService.getByIdMongooseUse(uid)
            .then((parent) => {
                
                if (parent === null)
                    throw 'Parent category not found'
                categoriesService.getByIdMongooseUse(body.childUid)
                    .then((child) => {
                        
                        if (child === null)
                            throw 'Child category not found'

                        addMainChild(parent, child)
                            .then((result => res.json(result)))
                            .catch((err) => next(err))
                    })
                    .catch((err) => next(err))
            })
            .catch(err => next(err))
    }
}

function addSubCategory({params: {uid}, body}, res, next){
    if (body.childUid !== undefined){
        //no need to create new category if category to be assigned already exists

        return categoriesService.getByIdMongooseUse(uid)
            .then(parentCategory => {
                if (parentCategory === null)
                    throw 'Parent category not found'
                addChildCategory(parentCategory, body.childUid)
                .then(parentWithChild => res.json(parentWithChild))
                .catch( err => {
                    if (err.name === 'CastError'){
                        next(`Assigned sub-category not found`)
                    }
                    next(err)
                })
            })
            .catch( err => next(err))
    }
    else{
        // create new category if category to be assigned does not exist
        return categoriesService.createOne(body)
            .then(({_id}) => {
                categoriesService.getByIdMongooseUse(uid)
                .then( parentCategory => {
                    addChildCategory(parentCategory, _id)
                    .then(parentWithChild => res.json(parentWithChild))
                    .catch( err => next(err))
                })
        })
    }
    
}

async function addChildCategory(parent, childId){
    //first check if child is already subcategory 

    if(JSON.stringify(parent.subCategories).includes(childId)){
        throw `sub-category already exists`
    }

    parent.subCategories.push(childId)
    return await parent.save()
}

async function addMainChild(parent, child){
    
    if (parent.mainSubcategory !== child || parent.mainSubcategory === undefined || parent.mainSubcategory === null){
        
        parent.mainSubCategory = child._id
        console.log(parent.mainSubCategory)
        return await parent.save()
    }
    else{
        throw `${child.shortName} is already the main sub-category`
    }
}