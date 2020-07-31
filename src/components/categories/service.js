const Category = require('./model')
const UIDGenerator = require('../uuid.generate');
const Status = require('../status.codes');

const attributes = {
    exclude: ['id']
};

const populate = [
    { path: 'subCategories', populate: { path: 'subCategories' }},
    { path: 'mainSubCategory' }
];

module.exports = {
    all: async ({ name }, res, next) => {
        if (name !== undefined && name !== null) {
            return await Category.findOne({ 
                    name: name, 
                    attributes
                })
                .then(category => category 
                    ? res.json(category.dataValues) 
                    : res.status(404).send({
                        success: false,
                        message: 'No category with name: ' + name
                    }
                )).catch(error => {
                    console.log(error)
                    next(res.status(400).send({
                        success: false,
                        error,
                    }))
                })
        } else {
            return await Category.findAll({ attributes })
                .then(category => res.json(category))
                .catch(error => {
                    console.log(error)
                    res.status(400).send({
                        success: false,
                        error,
                    })
                })
        }
    },

    getById: async (id) => await Category.findById(id),

    getDocuments: async (id) => (
        await Category
                .findById(id)
                .populate('documents')
                .lean()
    ),

    addDocument: async (id, docId) => {
        try {
            const category = await Category.findById(id)
            category.documents.push(docId)
            return await category.save()
        } catch (error) {
            return Promise.reject(error)
        }
    },

    removeDocument: async (id, docId) => {
        try {
            const category = await Category.findById(id)
            category.documents.pull(docId)
            return await category.save()
        } catch (error) {
            return Promise.reject(error)
        }
    },

    getSubCategories: async (id) => (
        await Category
                .findById(id)
                .populate('subCategories')
                .lean()
    ),

    getMainSubCategory: async (id) =>( 
        await Category
                .findById(id)
                .populate('mainSubCategory')
                .lean()
    ),

    getByIdMongooseUse: async (id) => (
        await Category.findById(id)
    ),

    createOne: async function({
        body: {
            name,
            shortName,
            about,
            content
        }
    }, res, next) {
        if (await Category.findOne({
            where: { name }
        })){
            return res.status(Status.STATUS_CONFLICT).send({
                success: false,
                message: `Category named ${name} already exists`
            })
        }

        return await Category.create({
            _id: UIDGenerator.UUID(),
            name,
            shortname: shortName,
            about,
            content
        }).then(category => {
            delete category.dataValues.id;
            res.status(Status.STATUS_OK)
                .json(category.dataValues);
        }).catch(error => {
            console.log(error)
            res.status(Status.STATUS_INTERNAL_SERVER_ERROR)
            .json(error.errors)
        })
    },

    delete: async (id) => { 
        try {
            const category = await Category.findById(id)
            
            const removed = await deleteCat(category)

            return Promise.resolve(removed)

        } catch (error) {
            return Promise.reject(error)
        }
    },
    
    doUpdate: async (document, props) => {
        if (await Category.findOne({name: props.name})){
            throw `Category ${props.name} already exists`
        }
        document.set(props)
        return await document.save()
    },                                                                                                  
}

function deleteCat(category){
    return new Promise((resolve, reject) => {
        category.delete( (error, removed) => {
            if (error) return reject(error)

            resolve(removed)
        } )

    })
}