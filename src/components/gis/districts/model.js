const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose');
//const MarepCenterSchema = require('../marep-centers/model')

const DistrictSchema = new Schema(
    {
        properties: {
            name: String
        },
        // marepCenters: [
        //     { type: Schema.Types.ObjectId, ref: 'MarepCenter' }
        // ],
        marepCenters: { count: String },
        geometry: {
            type: { type: Schema.Types.String},
            coordinates: [
                [{}]
            ]
        },
        location: {
            type: { type: Schema.Types.String},
            coordinates: [
                []
            ]
        },
        centroids: {
            lat: Number,
            lng: Number
        },
        // distributionLines: [
        //     { type: Schema.Types.ObjectId, ref: 'DistributionLines' }
        // ], 
        // transformers: [
        //     { type: Schema.Types.ObjectId, ref: 'Transformer'}
        // ],
        // powerPlants: [
        //     { type: Schema.Types.ObjectId, ref: 'PowerPlant'}
        // ],
        // powerSubStations: [
        //     { type: Schema.Types.ObjectId, ref: 'SubStation' }
        // ]
        
    },
    {collection: 'district'}
);

DistrictSchema.plugin(mongooseStringQuery)

module.exports = mongoose.model('District', DistrictSchema)