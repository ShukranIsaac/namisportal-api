const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose');

const FileSchema = new Schema(
    {
        name: String,
        description: String,
        size: String,
        path: String,
        filename: String,
        categories: [
            { type: Schema.Types.ObjectId, ref: 'Category' }
        ],
    },
    {collection: 'files'}
);

FileSchema.plugin(mongooseStringQuery)

module.exports = mongoose.model('File', FileSchema)