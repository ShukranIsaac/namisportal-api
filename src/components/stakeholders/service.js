const Stakeholder = require('./model')

module.exports = {
    getAll: async (name) => {
        if (name !== undefined){
            return await Stakeholder.findOne({name}).lean()
        }else{
            return await Stakeholder.find({}).lean()
        }
    },
    getById: async (id) => await Stakeholder.findById(id).lean(),
    getByIdMongooseUse: async (id) => await Stakeholder.findById(id),
    createOne: async (newStakeholder) => await Stakeholder.create(newStakeholder),
    delete: async (id) => await Stakeholder.findByIdAndDelete(id).lean()                                                                                                       
}

