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

// Perform Cascade operation for document
FileSchema.post('remove', function(doc, next) {
    
    const Category = mongoose.model('Category', CategorySchema)

    // get all parent categories
    Category.aggregate([
        { 
            "$lookup": {
                "from": 'categories',
                "localField": "documents",
                "foreignField": "_id",
                "as": "documents"
            }
        },
        { "$unwind": "$documents" }, //return parent object for every subcCategory
        { "$match": { 
            'documents': mongoose.Types.ObjectId(doc._id.toString()) 
            } 
        },
    ],
    function(err, results) {
        if (err) return console.warn(err)
        // foreach parent, remove the child from subCategories array
        return results.map(async ({_id, documents}) => {
            documents = documents.toString()
            const category = await Category.findById(_id)
            category.documents.pull(documents)
            category.save()

            return category
        })
    })

    next();
});


// Perform Cascade operation for news
// FileSchema.post('remove', function(doc, next) {
    
//     const News = mongoose.model('News', CategorySchema)

//     // get all parent categories
//     News.aggregate([
//         { 
//             "$lookup": {
//                 "from": 'news',
//                 "localField": "images",
//                 "foreignField": "_id",
//                 "as": "images"
//             }
//         },
//         { "$unwind": "$images" }, //return parent object for every subcCategory
//         { "$match": { 
//             'images': mongoose.Types.ObjectId(doc._id.toString()) 
//             } 
//         },
//     ],
//     function(err, results) {
//         if (err) return console.warn(err)
//         // foreach parent, remove the child from subCategories array
//         return results.map(async ({_id, images}) => {
//             images = images.toString()
//             const news = await News.findById(_id)
//             news.images.pull(images)
//             news.save()

//             return news
//         })
//     })

//     next();
// });

module.exports = mongoose.model('File', FileSchema)