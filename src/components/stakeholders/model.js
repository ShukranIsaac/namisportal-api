const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose');

const StakeholderSchema = new Schema(
    {
        name: { type: String, unique: true, required: true },
        about: String,
        mission: String,
        vision: String,
        contacts: {
            email: { type: String, unique: true, required: true },
            telephone: String,
            website: String,
            address: String
        },
        image: String
    },
    {collection: 'stakeholder'}
);

StakeholderSchema.plugin(mongooseStringQuery)

module.exports = mongoose.model('Stakeholder', StakeholderSchema)