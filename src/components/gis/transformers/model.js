const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose');
const District = require('../districts/model')

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
            coordinates: [Number, Number]
        }
    },
    {collection: 'transformers'}
);

TransformerSchema.index({ geo: "2dsphere" })

TransformerSchema.post('save', async function(doc) {
    const district = await District.findOne({ location: { $geoIntersects: { $geometry: { type: "Point", coordinates: doc.geo.coordinates } } } })
    const count = await mongoose.model('Transformer').find().where('geo').within(district.location).count()
    district.transformers = {count}
    district.save()
});

TransformerSchema.post('insertMany', async function(docs, next) {
    const districts = await District.find({})
    
    districts.forEach( async (district) => {
        const count = await mongoose.model('Transformer', TransformerSchema)
                    .find()
                    .where('geo')
                    .within(district.location).countDocuments()
        district.transformers = {count}
        district.save()
    })
    next()
});

TransformerSchema.post('remove', async function(doc) {
    
    const district = await District.findOne({ location: { $geoIntersects: { $geometry: { type: "Point", coordinates: doc.geo.coordinates } } } })
    const count = await mongoose.model('Transformer').find().where('geo').within(district.location).count()
    district.transformers = {count}
    district.save()
});

TransformerSchema.plugin(mongooseStringQuery)

module.exports = mongoose.model('Transformer', TransformerSchema)