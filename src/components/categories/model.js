const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose');

const CategorySchema = new Schema(
    {
        name: { type: String, unique: true, required: [true, 'Category name is required'] },
        about: { type: String, required: [true, 'Category about field is required'] },
        shortName: { type: String, required: [true, 'Category short name is required'] },
        content: {type:String},
        mainSubCategory: { type: Schema.Types.ObjectId, ref: 'Category' },
        documents: [
            { type: Schema.Types.ObjectId, ref: 'File' }
        ],
        subCategories: [
            { type: Schema.Types.ObjectId, ref: 'Category' }
        ],
    },
    {collection: 'categories'}
);

CategorySchema.plugin(mongooseStringQuery)

module.exports = mongoose.model('Category', CategorySchema)