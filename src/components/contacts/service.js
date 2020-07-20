const Contact = require('./model')

module.exports = {
    createOne: async contact => await Contact.create(contact),
    getContactInfo: async () => await Contact.find({}).lean(),
    getByIdMongooseUse: async (id) => await Contact.findById(id),
    delete: async (id) => await Contact.findByIdAndDelete(id).lean()                                                                                                       
}

