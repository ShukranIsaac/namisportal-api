const Sequelize = require('sequelize');
const PostgresORM = require('../config/database.config');

const mongooseStringQuery = require('mongoose-string-query')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose');
const SubCategory = require('./sub.model');

const Category = PostgresORM.define('categories', {
    _id: { type: Sequelize.STRING, unique: true, allowNull: false },
    name: { type: Sequelize.STRING, unique: true, allowNull: false },
    about: { type: Sequelize.STRING, allowNull: false },
    shortname: { type: Sequelize.STRING, allowNull: false },
    content: {type: Sequelize.STRING, allowNull: true}
});

Category.belongsToMany(Category, { 
    through: SubCategory, 
    as: 'category', 
    foreignKey: {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        allowNull: true,
        name: "category"
    } 
});

Category.belongsToMany(Category, { 
    through: SubCategory, 
    as: 'subCategories', 
    foreignKey: {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        allowNull: true,
        name: "subcategory"
    } 
});

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

// Perform Cascade operation
CategorySchema.post('remove', function(doc, next) {
    
    const Category = mongoose.model('Category', CategorySchema)

    // get all parent categories
    Category.aggregate([
        { 
            "$lookup": {
                "from": 'categories',
                "localField": "subCategories",
                "foreignField": "_id",
                "as": "categories"
            }
        },
        { "$unwind": "$subCategories" }, //return parent object for every subcCategory
        { "$match": { 
            'subCategories': mongoose.Types.ObjectId(doc._id.toString()) 
            } 
        },
    ],
    function(err, results) {
        if (err) return console.warn(err)
        // foreach parent, remove the child from subCategories array
        return results.map(async ({_id, subCategories}) => {
            subCategories = subCategories.toString()
            const category = await Category.findById(_id)
            category.subCategories.pull(subCategories)
            category.save()

            return category
        })
    })

    next();
});

module.exports = Category;