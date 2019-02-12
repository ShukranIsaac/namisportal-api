const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose');

const StakeholderSchema = new Schema(
    {
        name: String,
        about: String,
        mission: String,
        vision: String,
        contacts: {
            email: String,
            telephone: String,
            website: String,
        },
        image: String
    },
    {collection: 'stakeholder'}
);

StakeholderSchema.plugin(mongooseStringQuery)

module.exports = mongoose.model('Stakeholder', StakeholderSchema)