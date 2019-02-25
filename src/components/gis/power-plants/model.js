const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose');

const PowerPlantSchema = new Schema(
    {
        properties: {
            status: String,
            plantType: String,
            capacityInMW: String,
            region: String,
            district: String,
            name: String,
            ta: String,
            
        },
        geometry: {
            _type: String,
            coordinates: {lng: Number, lat: Number}
        }
    },
    {collection: 'power_plants'}
);

PowerPlantSchema.plugin(mongooseStringQuery)

module.exports = mongoose.model('PowerPlant', PowerPlantSchema)