const File = require('./model')
const UIDGenerator = require('../uuid.generate')

module.exports = {
    getAll: async () =>  await File.findAll(),
    getById: async (id) => await File.findOne({ where: { _id:id }}),
    getCategory: async (id) => await File.findOne({ where: { _id:id }}),
    getByIdUse: async (id) => await File.findOne({ where: { _id:id }}),
    createOne: async (newFile) => await File.create({
        _id: UIDGenerator.UUID(),
        ...newFile
    }),
    delete: async (id) => await File.destroy(id),
    update: async (document, props) => {
        await document.update(props)
        return await document.reload();
    }                                                                                      
}
