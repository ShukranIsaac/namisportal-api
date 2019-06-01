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
            type: { type: Schema.Types.String},
            coordinates: [
                [{lat: { type: Schema.Types.Number}, lng: { type: Schema.Types.Number}}]
            ]
        },
        lines: {
            type: { type: Schema.Types.String},
            coordinates: [
                [{ type: Schema.Types.Number}, { type: Schema.Types.Number}]
            ]
        },
    },
    {collection: 'distribution_lines'}
);

DistributionLinesSchema.index({ lines: "2dsphere" })
DistributionLinesSchema.plugin(mongooseStringQuery)

module.exports = mongoose.model('DistributionLines', DistributionLinesSchema)