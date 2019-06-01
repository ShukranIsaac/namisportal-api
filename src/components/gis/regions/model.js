const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose');
//const MarepCenterSchema = require('../marep-centers/model')

const RegionSchema = new Schema(
    {
        properties: {
            name: String
        },
        polygons: [
            {
                geometry: {
                    type: { type: Schema.Types.String},
                    coordinates: [
                        [{}]
                    ]
                }
            }
        ],
        location: {
            type: { type: Schema.Types.String},
            coordinates: []
        },
        centroids: {
            lat: Number,
            lng: Number
        },
        districts: [
            { type: Schema.Types.ObjectId, ref: 'District' }
        ]
    },
    {collection: 'regions'}
);

RegionSchema.plugin(mongooseStringQuery)

module.exports = mongoose.model('Region', RegionSchema)