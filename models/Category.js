const { ObjectId } = require('mongodb');
const database = require('../database/connection');
const slugify = require('slugify');

class Category {
    constructor(collectionRecord) {
        const {name, _id, slug} = collectionRecord;

        this._id = new ObjectId(_id);
        this.name = name;
        this.slug = slug;
    }

    static async create(attributes) {
        const {name } = attributes;
        const { insertedId } = await database.getDb().collection('categories').insertOne({
            name: name,
            slug: slugify(name)
        });

        if (insertedId) {
            const category = await Category.findById(insertedId);
            return category;
        }

        return null;
    }

    async getProdcutCount() {
        const count = await database.getDb().collection('products').countDocuments({
            'category._id': this._id
        });
        return count;
    }

    static async find() {
        const categories = await database.getDb().collection('categories').find().toArray();
        return categories.map((category) => new Category(category));
    }

    static async findById(id) {
        const category = await database.getDb().collection('categories').findOne({ _id: new ObjectId(id) });
        
        if (category) {
            return new Category(category);
        }

        return null;
    }

    async destroy() {
        await database.getDb().collection('categories').deleteOne({ _id: this._id });
    }

    static async findBySlug(slug) {
        const category = await database.getDb().collection('categories').findOne({ slug: slugify(slug) });

        if (category) {
            return new Category(category);
        }

        return null;
    }
}

module.exports = Category;