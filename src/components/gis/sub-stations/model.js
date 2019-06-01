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
    {collection: 'sub_stations'}
);

SubStationSchema.index({ geo: "2dsphere" })
SubStationSchema.plugin(mongooseStringQuery)

module.exports = mongoose.model('SubStation', SubStationSchema)