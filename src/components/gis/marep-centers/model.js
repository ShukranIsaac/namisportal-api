const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose');

const MarepCenterSchema = new Schema(
    {
        properties: {
            district: String
        },
        geometry: {
            _type: String,
            coordinates: {lng: Number, lat: Number}
        }
    },
    {collection: 'marep_centres'}
);

MarepCenterSchema.plugin(mongooseStringQuery)

module.exports = mongoose.model('MarepCenter', MarepCenterSchema)