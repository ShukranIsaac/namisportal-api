const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose');

const NewsSchema = new Schema(
    {
        title: { type: String, required: true },
        article: { type: String, required: true },
        images: [
            { type: Schema.Types.ObjectId, ref: 'File' }
        ],
        createdDate: { type: Date, default: Date.now },
        isPublished: {type: Boolean, default: false}
    },
    {collection: 'news'}
);

NewsSchema.plugin(mongooseStringQuery)

module.exports = mongoose.model('News', NewsSchema)