const SubStation = require('./model')

module.exports = {
    getAll: async (query=null) => {
        if(query.hasOwnProperty('count')){
            const count = await SubStation.find({}).select('-geo -geometry').count().lean()
            return Promise.resolve({count})
        }
        else
            return await SubStation.find({}).select('-geo').lean()
    },
    getById: async (id) => await SubStation.findById(id).lean(),
    addNew: async(body) => await SubStation.create(body)
}



