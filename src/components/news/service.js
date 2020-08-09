const News = require('./model')
const UIDGenerator = require('../uuid.generate')

module.exports = {
    getAll: async () => await News.findAll({
        attributes: { exclude: ['id', 'isPublished'] }
    }),
    getById: async (id) => await News.findOne({
        where: { _id: id },
        attributes: { exclude: ['id', 'isPublished'] }
    }),
    get: async (id) => await News.findOne({
        where: { _id: id }
    }),
    getImages: async (id) => await News.findById(id).populate('images').lean(),
    createOne: async (newNews) => await News.create({
        _id: UIDGenerator.UUID(),
        isPublished: false,
        ...newNews
    }).then(({ dataValues: { id, isPublished, ...rest} }) => rest),
    delete: async (id) => await News.destroy({
        where: { _id: id }
    })                                                                                                       
}



