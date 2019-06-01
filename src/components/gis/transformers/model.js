const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose');

const TransformerSchema = new Schema(
    {
        properties: {
            station: String,
            mass: String,
            voltage: String,
            MVARating: String,
            yearManufactured: String,
            manufacturer: String,
            district: String,
            region: String,
            feature: String,
            primary: String,
            position: String,
            feeder: String,
            location: String,
            barcode: String,
            serialNumber: String,
            cooling: String,
            SSNumber: String,
            summable: Number,
            oilVolume: String
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
    {collection: 'transformers'}
);

TransformerSchema.index({ geo: "2dsphere" })
TransformerSchema.plugin(mongooseStringQuery)

module.exports = mongoose.model('Transformer', TransformerSchema)