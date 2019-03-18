const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose');

const ContactSchema = new Schema(
    {
        email: String,
        telephone: String,
        website: String,
        address: String
    },
    {collection: 'contact'}
);

ContactSchema.plugin(mongooseStringQuery)

module.exports = mongoose.model('Contact', ContactSchema)