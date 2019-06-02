const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose')
const District = require('../districts/model')

const PowerPlantSchema = new Schema(
    {
        properties: {
            status: String,
            plantType: String,
            capacityInMW: Number,
            region: String,
            district: String,
            name: String,
            ta: String
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
    {collection: 'power_plants'}
);

PowerPlantSchema.index({ geo: "2dsphere" })
PowerPlantSchema.plugin(mongooseStringQuery)

PowerPlantSchema.post('insertMany', async function(docs, next) {
    const districts = await District.find({})
    

    districts.forEach( async (district) => {
        const count = await mongoose.model(
                    'PowerPLant', PowerPlantSchema
                    )
                    .find()
                    .where('geo')
                    .within(district.location).countDocuments()
        district.powerPlants = {count}
        district.save()
    })
    next()
});


PowerPlantSchema.post('save', async function(doc) {
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
    const count = await mongoose.model(
                        'PowerPLant', PowerPlantSchema
                        )
                        .find()
                        .where('geo')
                        .within(district.location).count()
    district.powerPlants = {count}
    district.save()
});

PowerPlantSchema.post('remove', async function(doc) {
    
    const district = await District.findOne({ location: { $geoIntersects: { $geometry: { type: "Point", coordinates: doc.geo.coordinates } } } })
    const count = await mongoose.model('PowerPlant', PowerPlantSchema).find().where('geo').within(district.location).count()
    district.powerPlants = {count}
    district.save()
});

module.exports = mongoose.model('PowerPlant', PowerPlantSchema)

