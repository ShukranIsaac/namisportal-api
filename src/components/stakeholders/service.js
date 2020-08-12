const Stakeholder = require('./model')
const UIDGenerator = require('../uuid.generate')
const Status = require('../status.codes')
const Contact = require('../contacts/model')

module.exports = {
    getAll: async (name) => {
        if (name !== undefined){
            return await Stakeholder.findOne({
                name: name,
                include: [{
                    model: Contact,
                    as: 'contacts',
                    attributes: {
                        exclude: ['id']
                    },
                    through: {
                        attributes: []
                    }
                }]
            })
        } else {
            return await Stakeholder.findAll({
                attributes: {
                    exclude: ['id', 'typeId']
                },
                include: [{
                    model: Contact,
                    as: 'contacts',
                    attributes: {
                        exclude: ['id']
                    },
                    through: {
                        attributes: []
                    }
                }]
            })
        }
    },

    getStakeholderById: async (id) => await Stakeholder.findOne({
        where: { _id: id },
        attributes: {
            exclude: ['id', 'typeId']
        },
        include: [{
            model: Contact,
            as: 'contacts',
            attributes: {
                exclude: ['id', '_id', 'createdAt', 'updatedAt']
            },
            through: {
                attributes: []
            }
        }]
    }),

    getById: async (id) => await Stakeholder.findOne({
        where: { _id: id },
        attributes: {
            exclude: ['id', 'typeId']
        }
    }),

    createOne: async ({ contacts, ...rest }, res) => {
        if (await Stakeholder.findOne({
            where: { name: rest.name }
        })){
            return res.status(Status.STATUS_CONFLICT).send({
                success: false,
                message: `Stakeholder named ${rest.name} already exists`
            })
        }

        const stakeholder = await Stakeholder.create({
            _id: UIDGenerator.UUID(),
            ...rest
        })

        const uid = UIDGenerator.UUID();
        await Contact.create({ _id: uid, ...contacts })

        const contactId = await getContactId(uid);
        await stakeholder.addContacts([ contactId ])

        return Stakeholder.findOne({
            where: { name: rest.name },
            attributes: {
                exclude: ['id', 'typeId']
            },
            include: [{
                model: Contact,
                as: 'contacts',
                attributes: {
                    exclude: ['id']
                },
                through: {
                    attributes: []
                }
            }]
        })
    },

    updateStakeholderImage: async id => {
        const stakeholder = await Stakeholder.findOne({
            where: { _id:id }
        });
        console.log(stakeholder)
        return updateStakeholderImage;
    },

    delete: async (id) => await Stakeholder.destroy()                                                                                                       
}

const getContactId = async id => {
    return await Contact.findOne({
        where: { _id: id }
    })
    .then(({ dataValues: { id }}) => id)
    .catch(error => Promise.reject(error))
}
