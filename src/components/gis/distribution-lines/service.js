const DistributionLines = require('./model')

module.exports = {
    getAll: async (query=null) => {
        if(query.hasOwnProperty('count')){
            const count = await DistributionLines.find({}).select('-lines -geometry').count().lean()
            return Promise.resolve({count})
        }
        else
            return await DistributionLines.find({}).select('-lines').lean()
    },
    getById: async (id) => await DistributionLines.findById(id).select('-lines').lean(),
    addNew: async(body) => await DistributionLines.create(body)
}



