const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose');
const District = require('../districts/model')
const MarepCenterSchema = new Schema(
    {
        properties: {
            district: String
        },
        geometry: {
            type: { type: Schema.Types.String},
            coordinates: {}
        },
        geo: {
            type: { type: Schema.Types.String},
            coordinates: []
        }
    },
    {collection: 'marep_centres'}
);

MarepCenterSchema.index({ geo: "2dsphere" })

MarepCenterSchema.post('save', async function(doc) {
    
    const district = await District.findOne({ location: { $geoIntersects: { $geometry: { type: "Point", coordinates: doc.geo.coordinates } } } })
    const count = await mongoose.model('MarepCenter').find().where('geo').within(district.location).count()
    district.marepCenters = {count}
    district.save()
});

MarepCenterSchema.post('insertMany', async function(docs, next) {
    const districts = await District.find({})
    
    districts.forEach( async (district) => {
        const count = await mongoose.model('MarepCenter', MarepCenterSchema)
                    .find()
                    .where('geo')
                    .within(district.location).countDocuments()
        district.marepCenters = {count}
        district.save()
    })
    next()
});

MarepCenterSchema.post('remove', async function(doc) {
    
    const district = await District.findOne({ location: { $geoIntersects: { $geometry: { type: "Point", coordinates: doc.geo.coordinates } } } })
    const count = await mongoose.model('MarepCenter').find().where('geo').within(district.location).count()
    district.marepCenters = {count}
    district.save()
});

MarepCenterSchema.plugin(mongooseStringQuery)

module.exports = mongoose.model('MarepCenter', MarepCenterSchema)   