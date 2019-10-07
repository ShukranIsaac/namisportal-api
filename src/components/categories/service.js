const Category = require('./model')
const mongoose = require('mongoose')

const populate = [
    { path: 'subCategories', populate: { path: 'subCategories' }},
    { path: 'mainSubCategory' }
]

module.exports = {
    getAll: async (name) => {
        if (name !== undefined){
            return await Category
                            .findOne({name})
                            .populate(populate)
                            .lean()
        }else{
            return await Category
                            .find({})
                            .lean()
        }
    },
    getById: async (id) => (
        await Category
                .findById(id)
                .populate(populate)
                .lean()
    ),
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
    } ,
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
        await Category
                .findById(id)
    ),
    createOne: async (newCategory) => {
        if (await Category.findOne({name:newCategory.name})){
            throw `Category named ${newCategory.name} already exists`
        }
        return await Category.create(newCategory)
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