const Contact = require('./model')

module.exports = {
    getContactInfo: async () => await Contact.find({}).lean(),
    getByIdMongooseUse: async (id) => await Contact.findById(id),
    delete: async (id) => await Contact.findByIdAndDelete(id).lean()                                                                                                       
}

