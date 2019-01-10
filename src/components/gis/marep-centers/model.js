const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose');

const MarepCenterSchema = new Schema(
    {
        properties: {
            name: String,
            feature: String,
            status: Boolean,
            demographics: {
                TA: String,
                pupulation: Number
            }
        },
        geometry: {
            type: String,
            coordinates: {lng: Number, lat: Number}
        }
    },
    {collection: 'marep-centres'}
);

MarepCenterSchema.plugin(mongooseStringQuery)

module.exports = mongoose.model('MarepCenter', MarepCenterSchema)