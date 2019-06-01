const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose');

const PowerPlantSchema = new Schema(
    {
        properties: {
            status: String,
            plantType: String,
            capacityInMW: Number,
            region: String,
            district: String,
            name: String,
            ta: String,

        },
        geometry: {
            type: { type: Schema.Types.String},
            coordinates: {lng: Number, lat: Number}
        },
        geo: {
            type: { type: Schema.Types.String},
            coordinates: [
                [Number, Number]
            ]
        }
    },
    {collection: 'power_plants'}
);

PowerPlantSchema.index({ geo: "2dsphere" })
PowerPlantSchema.plugin(mongooseStringQuery)

module.exports = mongoose.model('PowerPlant', PowerPlantSchema)