module.exports = ({db}) => {
    return Object.freeze({
        getAll,
        getById,
        addNew,
        insertMany
    })

    async function getAll(query=null){
        if(query && query.hasOwnProperty('count')){
            const count = await db.find({}).select('-lines -geometry').count().lean()
            return Promise.resolve({count})
        }
        else
            return await db.find({}).select('-lines').lean()
    }

    async function getById(id) {
        return await db.findById(id).select('-lines').lean()
    }

    async function addNew(body) {
        return await db.create(body)
    }

    async function insertMany(body) {
        return await db.insertMany(body)
    }
}

