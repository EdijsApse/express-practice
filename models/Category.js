const { ObjectId } = require('mongodb');
const database = require('../database/connection');
const slugify = require('slugify');

class Category {
    constructor(name, id = null) {
        if (id) {
            this._id = id;
        }

        this.name = name;
        this.slug = slugify(this.name);
        
        this.isValid = true;
        this.errorMessage = null;
    }

    validate() {
        this.validateName();
    }

    validateName() {
        const name = this.name.trim();

        if (name.length < 3) {
            this.isValid = false;
            this.errorMessage = 'Name should be atleast 3 characters long'
        }
    }

    async create() {
        await database.getDb().collection('categories').insertOne({
            name: this.name,
            slug: this.slug
        });
    }

    getProdcutCount() {
        return 10;
    }

    static async find() {
        const categories = await database.getDb().collection('categories').find().toArray();
        return categories.map((c) => new Category(c.name, c._id));
    }

    static async findById(id) {
        const category = await database.getDb().collection('categories').findOne({ _id: new ObjectId(id) });
        
        if (category) {
            return new Category(category.name, category._id);
        }

        return null;
    }

    async destroy() {
        await database.getDb().collection('categories').deleteOne({ _id: new ObjectId(this._id) });
    }
}

module.exports = Category;