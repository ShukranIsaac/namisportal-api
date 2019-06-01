const District = require('./model')
const SubStation = require('../sub-stations/model')
const MarepCenter = require('../marep-centers/model')
const Transformer = require('../transformers/model')

module.exports = {
    getAll: async (name) => {
        if (name !== undefined){
            return await District.findOne({properties: {name}}).select("-location").lean()
        }else{
            return await District.find({}).select("-location -geometry").lean()
        }
    },
    getById: async (id) => await District.findById(id).select("-location").lean(),
    getPolygons: async (id) => await District.findById(id).populate('polygons').lean(),
    getMarepcenters: async (id) => {
        const district = await District.findById(id).select('-geometry -properties')

        return await MarepCenter.find().where('geo').within(district.location).select('-geo').lean()
        
    },
    getTransformers: async (id, position=null) => {
        
        if (position !== null){
            const district = await District.findById(id).select('-geometry -properties')
            return await Transformer.find().where({'properties.position': position}).where('geo').within(district.location).select('-geo').lean()
        }
        else{
            const district = await District.findById(id).select('-geometry -properties')
            return await Transformer.find().where('geo').within(district.location).select('-geo').lean()
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
    getPowerSubStations: async (id) => await District.findById(id).populate('powerSubStations').lean(),
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



