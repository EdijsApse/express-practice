const { ObjectId } = require("mongodb");
const database = require('../database/connection');
const Category = require("./Category");
const User = require("./User");

class Product {
    constructor(name, price, summary, description, category_id, image, user, id = null) {

        if (id) {
            this._id = new ObjectId(id);
        }

        this.name = name;
        this.price = price;
        this.summary = summary;
        this.description = description;
        this.image = image;
        this.category_id = category_id;
        this.user = user;
    }

    async create() {
        const category = await Category.findById(this.category_id);

        this.price = Number.parseFloat(this.price).toFixed(2);

        await database.getDb().collection('products').insertOne({
            name: this.name,
            price: this.price,
            summary: this.summary,
            description: this.description,
            created: new Date(),
            user: {
                _id: this.user._id,
                email: this.user.email
            },
            category: {
                _id: category._id,
                name: category.name,
                slug: category.slug
            },
            image: this.image
        });
    }

    static async findById(id) {
        return await database.getDb().collection('products').findOne({ _id: new ObjectId(id) });
    }

    static async find() {
        const products = await database.getDb().collection('products').find({}).toArray();
        return products.map((product) => {
            return new Product(product.name, product.price, product.summary, product.description, product.available, product.image, product.user, product._id);
        })
    }

    async validate() {
        this.validateName();
        this.validatePrice();
        await this.validateCategory();
        await this.validateUser();
    }

    async validateUser() {
        const user = await User.findById(this.user._id);
        if (!user) {
            this.errorMessage = 'User not found!';
            this.isValid = false;
        }
    }

    validateName() {
        const name = this.name.trim();

        if (name.length < 5) {
            this.isValid = false;
            this.errorMessage = 'Name must be atleast 5 characters long';
        }
    }

    async validateCategory() {
        const category = await Category.findById(this.category_id);
        if (!category) {
            this.isValid = false;
            this.errorMessage = 'Category not found!';
        }
    }

    validatePrice() {
        const isValidPrice = (!isNaN(this.price) && this.price !== '');
        if (!isValidPrice) {
            this.errorMessage = 'Price is not valid!';
            this.isValid = false;
        }
    }

    getImage() {
        return this.image ? this.image : process.env.NO_IMAGE_PATH;
    }

    getShortSummary() {
        return `${this.summary.slice(0, 200)} ...`;
    }
}

module.exports = Product;