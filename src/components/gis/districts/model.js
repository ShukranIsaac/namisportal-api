const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose');
//const MarepCenterSchema = require('../marep-centers/model')

const DistrictSchema = new Schema(
    {
        properties: {
            name: String
        },
        marepCenters: { count: Number },
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
            coordinates: [
            ]
        },
        centroids: {
            lat: Number,
            lng: Number
        },
        distributionLines: { count: Number }, 
        transformers: { count: Number },
        powerPlants: { count: Number },
        powerSubStations: { count: Number }
        
    },
    {collection: 'district'}
);


// DistrictSchema.index({ location: "2dsphere" })
DistrictSchema.plugin(mongooseStringQuery)

module.exports = mongoose.model('District', DistrictSchema)