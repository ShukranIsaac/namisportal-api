const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose');

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
            _type: String,
            coordinates: {lng: Number, lat: Number}
        }
    },
    {collection: 'sub_stations'}
);

SubStationSchema.plugin(mongooseStringQuery)

module.exports = mongoose.model('SubStation', SubStationSchema)