const Contact = require('./model')

module.exports = {
    createOne: async contact => await Contact.create(contact),
    getContactInfo: async () => await Contact.find({}).lean(),
    getByIdMongooseUse: async (id) => await Contact.findById(id),
    
    addStakeholderContact: async id => {
        console.log(id)
    },

    deleteStakeholderContact: async id => {
        console.log(id)
    },
    
    delete: async (id) => await Contact.findByIdAndDelete(id).lean()                                                                                                       
}

