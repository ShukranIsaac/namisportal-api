const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose');

const ContactSchema = new Schema(
    {
        email: { type: Array, default: [] },
        telephone: { type: Array, default: [] },
        website: { type: String, default: null },
        address: { type: Array, default: [] }
    },
    {collection: 'contact'}
);

ContactSchema.plugin(mongooseStringQuery)

module.exports = mongoose.model('Contact', ContactSchema)