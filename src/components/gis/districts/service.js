const District = require('./model')
const DistributionLines = require('../distribution-lines/model')
const MarepCenter = require('../marep-centers/model')

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
    getTransformers: async (id, position=null) => {
        
        if (position !== null){
            return await District.findById(id).populate({path: 'transformers', match: {'properties.position':position}}).lean() 
        }
        else{
            return await District.findById(id).populate('transformers').lean()
        }
        
    },
    getDistributionLines: async (id, voltage=null) => {
        
        if (voltage !== null){
            return await District.findById(id).populate({path: 'distributionLines', match: {'properties.voltage':voltage}}).lean() 
        }
        else{
            return await District.findById(id).populate('distributionLines').lean() 
        }
        
    },
    getAggregates: async (id) => await District.aggregate(
        [
            { $match: {"_id" : id}},
            { $unwind: "$marepCenters" },
            { $group: { count: { $sum: 1 } } }
        ]
    ),
    postMarepCenter: async ({districtId, districtName, lat, lng}) => {
        const center = {
            properties: {
                district: districtName
            },
            geometry: {
                _type: 'Point',
                coordinates: {lng, lat}
            }
        }
        return await MarepCenter.create(center)
    },
}



