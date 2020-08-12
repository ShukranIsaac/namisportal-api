const express = require('express')
const router = express.Router()
const jwtm = require('../../middlewares/jwt')

const categoriesService = require('./service')
const fileServise = require('../files/service')
const fileUploadMiddleware = require('../files/upload.middleware')
const Status = require('../status.codes')

async function removeDocument(req, res, next){
    const {params: {uid, docId}} = req
    try {
        const file = await fileServise.getById(docId)

        if(file){
            return categoriesService.removeDocument(uid, docId)
                .then(categoryWithRemovedDoc => res.json(categoryWithRemovedDoc))
                .catch(error => next(error))
        }
    } catch (error) {
        return next(error)
    }
}

async function addDocument(req, res, next){
    const {params: {uid}, body: {docId}} = req
    try {
        const file = await fileServise.getById(docId)

        if(file){
            return categoriesService.addDocument(uid, docId)
                .then(categoryWithNewDoc => res.json(categoryWithNewDoc))
                .catch(error => next(error))
        }
    } catch (error) {
        return next(error)
    }
}


function getByChild(req, res, next){
    return categoriesService.searchByChild()
        .then(found => console.log(found))
        .catch(error => console.error(error))
}

function getAllCategories({query}, res, next) {
    return categoriesService.all(query, res, next);
}

async function getOneCategory({params: {uid}}, res, next)  {
    return await categoriesService.getById(uid)
        .then(response => {
            if (!response) {
                return res.status(Status.STATUS_NOT_FOUND).send({
                    success: false,
                    message: 'No category with id: ' + uid
                })
            }

            const { dataValues: { category, id, shortname, ...rest } } = response;

            // TODO: Finish here
            const cateSubs = categoriesService.subCategories(rest)
            // const subs = cateSubs.subCategories.map(({
            //     dataValues: { category, id, ...rest }
            // })=> Object.assign(rest, {
            //     subCategories: categoriesService.subCategories(rest)
            // }));

            return res.status(Status.STATUS_OK)
                .send(Object.assign(rest, { 
                    shortName: shortname,
                    subCategories: cateSubs 
                }))
        })
        .catch(err => res.status(Status.STATUS_INTERNAL_SERVER_ERROR).send({
            success: false,
            message: err
        }))
}

async function getDocuments({params: {uid}}, res, next)  {
    return await categoriesService.getDocuments(uid)
        .then( categories => res.json(categories.documents))
        .catch( err => next(err))
}

function getSubCategories({params: {uid}}, res, next)  {
    categoriesService.getSubCategories(uid, res);
}

async function getMainSubCategory({params: {uid}}, res, next)  {
    return await categoriesService.getMainSubCategory(uid)
        .then( category => res.json(category.mainSubCategory))
        .catch( err => next(err))
}

async function deleteCategory({params: {uid}}, res, next)  {
    return await categoriesService.delete(uid)
        .then(response => res.json(response))
        .catch( err => next(err))
}

async function updateCategory({params: {uid}, body}, res, next)  {
    return await categoriesService.getCategoryById(uid)
        .then(category => {
            // categoriesService.doUpdate(category, body)
            //     .then(updatedCat => res.json(updatedCat))
            //     .catch(err => next(err))
            if (!category) {
                return res.status(Status.STATUS_NOT_FOUND).send({
                    success: false,
                    message: 'No category with id: ' + uid
                })
            }
            doUpdate(category, body, res);
        }).catch(err => next(err))
}

async function doUpdate(category, {
    name, shortName, about
}, res) {
    await category.update({ name, shortname: shortName, about })

    return await category.reload()

    .then(_category => _category ? 
        res.status(Status.STATUS_OK).send({
            success: true,
            message: "Category successfully updated."
        }) : 
        res.status(Status.STATUS_INTERNAL_SERVER_ERROR).send({
            success: false,
            message: 'Category resource failed to update. Try again.'
        })
    );
}

const addCategory = (req, res, next) => categoriesService.createOne(req, res, next);

const addFile = async ({params: uid}, res, next) => await categoriesService
    .createOne(body).then( newCategory => res.json(newCategory) )
    .catch( err => next(err))

async function addMainSubcategory({params: {uid}, body}, res, next){
    if (body.childUid !== undefined){
        return await categoriesService.getByIdMongooseUse(uid)
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

async function addSubCategory({params: {uid}, body}, res, next){
    if (body.childUid !== undefined){
        //no need to create new category if category to be assigned already exists

        return await categoriesService.getById(uid)
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
        await categoriesService.createSubCategory(uid, body, res)
            .catch(error => {
                console.log(error)
                res.status(Status.STATUS_INTERNAL_SERVER_ERROR)
                    .send({
                        success: false,
                        message: error
                    });
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
    
    if (parent.mainSubCategory.toString() !== child._id.toString() || parent.mainSubCategory === undefined || parent.mainSubCategory === null){
        
        parent.mainSubCategory = child._id
        return await parent.save()
    }
    else{
        throw `${child.shortName} is already the main sub-category`
    }
}

router.get('/', getAllCategories);
router.get('/:uid', getOneCategory);
router.get('/:uid/documents', getDocuments)
router.get('/:uid/sub-categories', getSubCategories)
router.get('/:uid/main-sub-category', getMainSubCategory)
router.get('/:uid/by-child', getByChild)

router.post('/', /*jwtm,*/ addCategory)
router.use('/:uid/files', /*jwtm,*/ fileUploadMiddleware)
router.post('/:uid/sub-categories', /*jwtm,*/ addSubCategory)
router.post('/:uid/main-sub-category', /*jwtm,*/ addMainSubcategory)
router.patch('/:uid/', /*jwtm,*/ updateCategory)
router.delete('/:uid/', /*jwtm,*/ deleteCategory)

router.post('/:uid/documents', addDocument)
router.delete('/:uid/documents/:docId', removeDocument)

module.exports = router