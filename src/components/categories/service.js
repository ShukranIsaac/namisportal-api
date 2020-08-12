const Category = require('./model')
const UIDGenerator = require('../uuid.generate');
const Status = require('../status.codes');

const attributes = {
    exclude: ['id']
};

const subCategories = category => category.subCategories.map(({ 
    dataValues: {
        category, id, subCategories,...restSub
    } 
})=> {
    return Object.assign(restSub, { 
        subCategories: subCategories.map(({ _id })=>_id) 
    })
})

module.exports = {
    all: async ({ name }, res, next) => {
        if (name !== undefined && name !== null) {
            return await Category.findOne({ 
                    where: { name: name },
                    include: [{
                        model: Category,
                        as: 'subCategories',
                        include: [{
                            model: Category,
                            as: 'subCategories',
                            all: true,
                            attributes: {
                                exclude: ['id']
                            },
                            through: {
                                attributes: []
                            }
                        }],
                        all: true,
                        attributes: {
                            exclude: ['id']
                        },
                        through: {
                            attributes: []
                        }
                    }]
                })
                .then(response => {
                    if (!response) {
                        return res.status(Status.STATUS_NOT_FOUND).send({
                            success: false,
                            message: 'No category with name: ' + name
                        })
                    }

                    const { dataValues: {
                        category, id, shortname, ...rest} 
                    } = response;

                    return res.status(Status.STATUS_OK)
                    .send(Object.assign(rest, { 
                        shortName: shortname,
                        subCategories: subCategories(rest) 
                    }))
                }).catch(error => {
                    console.log(error)
                    res.status(Status.STATUS_BAD_REQUEST).send({
                        success: false,
                        message: error,
                    })
                })
        } else {
            return await Category.findAll({ 
                attributes,
                include: [{
                    model: Category,
                    as: 'subCategories',
                    all: true,
                    attributes: {
                        exclude: ['id']
                    },
                    through: {
                        attributes: []
                    }
                }]
            }).then(categories => {
                res.status(Status.STATUS_OK)
                    .send(categories.map(({ dataValues: {
                        category, id, shortname, ...rest
                    } }) => {
                        return Object.assign(rest, { 
                            shortName: shortname,
                            subCategories: rest.subCategories.map(({
                                _id, ...rest
                            })=>_id) 
                        });
                    }))
            }).catch(error => {
                console.log(error)
                res.status(400).send({
                    success: false,
                    error,
                })
            })
        }
    },

    subCategories: subCategories,

    getById: async (id) => await Category.findOne({
        where: { _id: id },
        attributes: {
            exclude: ['id']
        },
        include: [{
            model: Category,
            as: 'subCategories',
            all: true,
            attributes: {
                exclude: ['id']
            },
            through: {
                attributes: []
            },
            include: [{
                model: Category,
                as: 'subCategories',
                include: [{
                    model: Category,
                    as: 'subCategories',
                    all: true,
                    attributes: {
                        exclude: ['id']
                    },
                    through: {
                        attributes: []
                    }
                }],
                all: true,
                attributes: {
                    exclude: ['id']
                },
                through: {
                    attributes: []
                }
            }],
        }]
    }),

    getDocuments: async (id) => (
        await Category
                .findById(id)
                .populate('documents')
                .lean()
    ),

    addDocument: async (id, docId) => {
        try {
            const category = await Category.findById(id)
            category.documents.push(docId)
            return await category.save()
        } catch (error) {
            return Promise.reject(error)
        }
    },

    removeDocument: async (id, docId) => {
        try {
            const category = await Category.findById(id)
            category.documents.pull(docId)
            return await category.save()
        } catch (error) {
            return Promise.reject(error)
        }
    },

    getSubCategories: async (id, res) => (
        await Category.findAll({
            where: { _id: id },
            include: [{
                model: Category,
                as: 'subCategories',
                all: true,
                attributes: {
                    exclude: ['id']
                },
                through: {
                    attributes: []
                }
            }]
        }).then(categories => {
            res.status(Status.STATUS_OK)
                .send(categories.map(({ dataValues: {
                    category, id, ...rest
                } }) => Object.assign(rest, { 
                    subCategories: rest.subCategories.map(({
                        _id, ...rest
                    })=>_id) 
                })))
        }).catch(error => {
            console.log(error)
            res.status(400).send({
                success: false,
                error,
            })
        })
    ),

    getMainSubCategory: async (id) =>( 
        await Category
                .findById(id)
                .populate('mainSubCategory')
                .lean()
    ),

    getCategoryById: async (id) => await Category.findOne({
        where: { _id: id }
    }),

    createOne: async function({
        body: {
            name,
            shortName,
            about,
            content
        }
    }, res, next) {
        if (await Category.findOne({
            where: { name }
        })){
            return res.status(Status.STATUS_CONFLICT).send({
                success: false,
                message: `Category named ${name} already exists`
            })
        }

        return await Category.create({
            _id: UIDGenerator.UUID(),
            name,
            shortname: shortName,
            about,
            content
        }).then(({ dataValues: {
            category, id, ...rest
        } }) => {
            if(rest) {
                res.status(Status.STATUS_OK)
                    .json({
                        status: true,
                        message: `${name} successfully created`
                    });
            } else {
                res.status(Status.STATUS_INTERNAL_SERVER_ERROR)
                    .json({
                        status: false,
                        message: `Failed to create ${name} category`
                    });
            }
        }).catch(error => {
            console.log(error)
            res.status(Status.STATUS_INTERNAL_SERVER_ERROR)
                .json(error.errors)
        })
    },

    createSubCategory: async (id, { 
        name, shortName, about
    }, res) => {
        // Main category
        const mainCategory = await Category.findOne({
            where: { _id: id }
        })

        // check if main category exists
        if(mainCategory) {
            const categoryId = UIDGenerator.UUID();
            const sub_category = await Category.create({
                _id: categoryId,
                name,
                shortname: shortName,
                about
            })
            .catch(error => {
                console.log(error)
                return Promise.reject(error.errors)
            })

            // Sub Category id just created
            const sub_category_id = await getCategoryId(categoryId);

            await mainCategory.addSubCategory([ sub_category_id ]).then(sub => {
                res.status(Status.STATUS_OK)
                    .send({
                        success: true,
                        message: 'Sub-category successfully created'
                    })
            });
        } else {
            return new Promise((resolve, reject) => {
                return reject(`Category with id ${ id } does not exists`)
            })
        }
    },

    delete: async (id) => { 
        try {
            if (await Category.findOne({ where: { _id:id }})) {
                await Category.destroy({
                    where: { _id: id }
                })
    
                return Promise.resolve({
                    success: true,
                    message: "Resource successfully deleted."
                })   
            } else {
                return Promise.resolve({
                    success: false,
                    message: `Resource with id ${ id } does not exist.`
                }) 
            }
        } catch (error) {
            return Promise.reject({
                success: false,
                message: error
            })
        }
    },
    
    doUpdate: async (document, props) => {
        if (await Category.findOne({name: props.name})){
            throw `Category ${props.name} already exists`
        }
        document.set(props)
        return await document.save()
    },                                                                                                  
}

const getCategoryId = async id => {
    return await Category.findOne({
        where: { _id: id }
    })
    .then(({ dataValues: { id }}) => id)
    .catch(error => Promise.reject(error))
}