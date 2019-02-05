const District = require('./model')
const DistributionLines = require('../distribution-lines/model')

module.exports = {
    getAll: async (name) => {
        if (name !== undefined){
            return await District.findOne({properties: {name}}).populate('polygons').lean()
        }else{
            return await District.find({}).lean()
        }
    },
    getById: async (id) => await District.findById(id).populate('polygons').lean(),
    getPolygons: async (id) => await District.findById(id).populate('polygons').lean(),
    getMarepcenters: async (id) => await District.findById(id).populate('marepCenters').lean(),
    getTransformers: async (id) => await District.findById(id).populate('transformers').lean(),
    getDistributionLines: async (id) => await District.findById(id).populate('distributionLines').lean(),
    getAggregates: async (id) => await District.aggregate(
        [{ $match: {
        "_id" : id
        }},
        { $unwind: "$marepCenters" },
        { $group: {
            count: { $sum: 1 }
        }}]
    )
}



