const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose');

const PolygonSchema = new Schema(
    {
        geometry: {
            _type: String,
            coordinates: [
                [{ lat: Number, lng: Number}]
            ]
        }
    },
    {collection: 'polygons'}
);

PolygonSchema.plugin(mongooseStringQuery)

module.exports = mongoose.model('Polygon', PolygonSchema)