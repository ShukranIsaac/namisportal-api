const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose');
const MarepCenterSchema = require('../marep-centers/model')

const DistrictSchema = new Schema(
    {
        properties: {
            name: String
        },
        marepCenters: [MarepCenterSchema]
    },
    {collection: 'marep-centres'}
);

DistrictSchema.plugin(mongooseStringQuery)

module.exports = mongoose.model('District', DistrictSchema)