const News = require('./model')

module.exports = {
    getAll: async () => await News.find({}).lean(),
    getById: async (id) => await News.findById(id).populate(populate).lean(),
    getImages: async (id) => await News.findById(id).populate('images').lean(),
    getByIdMongooseUse: async (id) => await News.findById(id),
    createOne: async (newNews) => await News.create(newNews),
    delete: async (id) => await News.findByIdAndDelete(id).lean()                                                                                                       
}



