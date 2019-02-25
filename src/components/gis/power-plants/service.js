const PowerPlant = require('./model')

module.exports = {
    getAll: async () => await PowerPlant.find({}).lean(),
    getById: async (id) => await PowerPlant.findById(id).lean()
}



