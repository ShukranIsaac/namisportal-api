const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose');

const NewsSchema = new Schema(
    {
        title: String,
        article: String,
        images: [
            { type: Schema.Types.ObjectId, ref: 'File' }
        ],
        createdDate: { type: Date, default: Date.now }
    },
    {collection: 'news'}
);

NewsSchema.plugin(mongooseStringQuery)

module.exports = mongoose.model('News', NewsSchema)