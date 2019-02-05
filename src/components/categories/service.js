const Category = require('./model')

module.exports = {
    getAll: async (name) => {
        if (name !== undefined){
            return await Category.findOne({name}).lean()
        }else{
            return await Category.find({}).lean()
        }
    },
    getById: async (id) => await Category.findById(id).lean(),
    getDocuments: async (id) => await Category.findById(id).populate('documents').lean(),
    getSubCategories: async (id) => await Category.findById(id).populate('subCategories').lean(),
    getByIdMongooseUse: async (id) => await Category.findById(id),
    createOne: async (newCategory) => await Category.create(newCategory),
    delete: async (id) => await Category.findByIdAndDelete(id).lean()                                                                                                       
}



