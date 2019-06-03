const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose')
const District = require('../districts/model')

const SubStationSchema = new Schema(
    {
        properties: {
            region: String, 
            ta: String,
            location: String,
            district: String, 
            secondary: String,
            transmission: String,
            asset: String,
            name: String
        },
        geometry: {
            type: { type: Schema.Types.String},
            coordinates: {lng: Number, lat: Number}
        },
        geo: {
            type: { type: Schema.Types.String},
            coordinates: [Number, Number]
        }
    },
    {collection: 'sub_stations'}
);

SubStationSchema.index({ geo: "2dsphere" })
SubStationSchema.plugin(mongooseStringQuery)


SubStationSchema.post('save', async function(doc) {
   
    const district = await District.findOne({ 
        location: { 
            $geoIntersects: { 
                $geometry: { 
                    type: "Point", 
                    coordinates: doc.geo.coordinates 
                } 
            } 
        } 
    })
    const count = await mongoose.model('SubStation', SubStationSchema)
                        .find()
                        .where('geo')
                        .within(district.location).countDocuments()
    district.powerSubStations = {count}
    district.save()
});

SubStationSchema.post('insertMany', async function(docs, next) {
    const districts = await District.find({})
    
    districts.forEach( async (district) => {
        const count = await mongoose.model('SubStation', SubStationSchema)
                    .find()
                    .where('geo')
                    .within(district.location).countDocuments()
        district.powerSubStations = {count}
        district.save()
    })
    next()
});

SubStationSchema.post('remove', async function(doc) {
    
    const district = await District.findOne({ location: { $geoIntersects: { $geometry: { type: "Point", coordinates: doc.geo.coordinates } } } })
    const count = await mongoose.model('SubStation', SubStationSchema).find().where('geo').within(district.location).countDocuments()
    district.powerSubStations = {count}
    district.save()
});

module.exports = mongoose.model('SubStation', SubStationSchema)