const Category = require('./model')

const populate = { path: 'subCategories', populate: { path: 'subCategories' }}

module.exports = {
    getAll: async (name) => {
        if (name !== undefined){
            return await Category.findOne({name}).populate(populate).lean()
        }else{
            return await Category.find({}).lean()
        }
    },
    getById: async (id) => await Category.findById(id).populate(populate).lean(),
    getDocuments: async (id) => await Category.findById(id).populate('documents').lean(),
    getSubCategories: async (id) => await Category.findById(id).populate('subCategories').lean(),
    getByIdMongooseUse: async (id) => await Category.findById(id),
    createOne: async (newCategory) => await Category.create(newCategory),
    delete: async (id) => await Category.findByIdAndDelete(id).lean()                                                                                                       
}



