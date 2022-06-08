const { ObjectId } = require("mongodb");
const database = require('../database/connection');
const Category = require("./Category");
const User = require("./User");

class Product {
    constructor(collectionRecord) {
        const { name, price, description, summary, _id, created, user, category, image } = collectionRecord;

        this.name = name;
        this.price = price;
        this.summary = summary;
        this.description = description;
        this.image = image;
        this.category = category;
        this.user = user;
        this._id = new ObjectId(_id);
        this.created = created;
    }

    static async create(attributes) {
        const { name, price, summary, description, image, category_id, user_id } = attributes;

        const category = await Category.findById(category_id);

        const user = await User.findById(user_id);

        const { insertedId } = await database.getDb().collection('products').insertOne({
            name: name,
            price: Number.parseFloat(price).toFixed(2),
            summary: summary,
            description: description,
            created: new Date(),
            user: {
                _id: user._id,
                email: user.email
            },
            category: {
                _id: category._id,
                name: category.name,
                slug: category.slug
            },
            image: image
        });

        if (insertedId) {
            const product = await Product.findById(insertedId);
            return new Product(product);
        }
        
        return null;
    }

    static async findById(id) {
        const product = await database.getDb().collection('products').findOne({ _id: new ObjectId(id) });
        
        if (product) {
            return new Product(product);
        }

        return null;
    }

    static async find() {
        const products = await database.getDb().collection('products').find({}).toArray();
        return products.map((product) => {
            return new Product(product);
        })
    }

    getImage() {
        return this.image ? this.image : process.env.NO_IMAGE_PATH;
    }

    getShortSummary() {
        return `${this.summary.slice(0, 200)} ...`;
    }
}

module.exports = Product;