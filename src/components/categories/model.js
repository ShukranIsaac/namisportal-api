const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose');

const CategorySchema = new Schema(
    {
        name: String,
        about: String,
        documents: [
            { type: Schema.Types.ObjectId, ref: 'File' }
        ],
        subCatigories: [
            { type: Schema.Types.ObjectId, ref: 'Category' }
        ],
    },
    {collection: 'categories'}
);

CategorySchema.plugin(mongooseStringQuery)

module.exports = mongoose.model('Category', CategorySchema)