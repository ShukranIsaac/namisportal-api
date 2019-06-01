const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose');

const PolygonSchema = new Schema(
    {
        geometry: {
            type: String,
            coordinates: [
                [{ lat: Number, lng: Number}]
            ]
        },
        location: {
            type: String,
            coordinates: [
                [Number, Number]
            ]
        }
    },
    {collection: 'polygons'}
);

PolygonSchema.plugin(mongooseStringQuery)

module.exports = mongoose.model('Polygon', PolygonSchema)