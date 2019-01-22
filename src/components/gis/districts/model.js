const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose');
//const MarepCenterSchema = require('../marep-centers/model')

const DistrictSchema = new Schema(
    {
        properties: {
            name: String
        },
        marepCenters: [
            { type: Schema.Types.ObjectId, ref: 'MarepCenter' }
        ],
        polygons: [
            { type: Schema.Types.ObjectId, ref: 'Polygon' }
        ],
        centroids: {
            lat: Number,
            lng: Number
        },
        distributionLines: [
            { type: Schema.Types.ObjectId, ref: 'DistributionLines' }
        ],
        transformers: [
            { type: Schema.Types.ObjectId, ref: 'Transformer'}
        ]
    },
    {collection: 'district'}
);

DistrictSchema.plugin(mongooseStringQuery)

module.exports = mongoose.model('District', DistrictSchema)