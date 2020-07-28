const File = require('./model')

module.exports = {
    getAll: async (name) =>  await File.find({}).lean(),
    getById: async (id) => await File.findById(id).populate('categories').lean(),
    getCategory: async (id) => await File.findById(id).populate('categories').lean(),
    getByIdMongooseUse: async (id) => await File.findById(id),
    createOne: async (newFile) => await File.create(newFile),
    delete: async (id) => await File.findByIdAndDelete(id).lean(),
    update: async (document, props) => {
        document.set(props)
        return await document.save()
    }                                                                                      
}



