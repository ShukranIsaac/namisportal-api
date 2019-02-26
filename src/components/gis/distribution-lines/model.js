const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose');

const DistributionLinesSchema = new Schema(
    {
        properties: {
            district: String,
            feeder: String,
            length: Number,
            region: String,
            voltage: String,
            status: String,
            conductor: String,
            primary: String,
            lineType: String,
            substation: String
        },
        geometry: {
            _type: String,
            coordinates: [
                [{ lat: Number, lng: Number}]
            ]
        }
    },
    {collection: 'distribution_lines'}
);

DistributionLinesSchema.plugin(mongooseStringQuery)

module.exports = mongoose.model('DistributionLines', DistributionLinesSchema)