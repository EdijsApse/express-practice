const { ObjectId } = require("mongodb");
const database = require('../database/connection');
const fs = require('fs');

class Product {
    constructor(name, price, summary, description, available, images, id = null) {

        if (id) {
            this._id = new ObjectId(id);
        }

        this.name = name;
        this.price = price;
        this.summary = summary;
        this.description = description;
        this.images = images;
        this.available = available;

        this.errorMessage = null;
        this.isValid = true;
    }

    async create() {

        this.price = Number.parseFloat(this.price).toFixed(2);
        this.available = Number.parseFloat(this.available).toFixed();

        await database.getDb().collection('products').insertOne({
            name: this.name,
            price: this.price,
            summary: this.summary,
            description: this.description,
            available: this.available,
            created: new Date(),
            images: this.images
        });
    }

    validate() {
        this.validateName();
        this.validateAvailable();
        this.validatePrice();
    }

    validateName() {
        const name = this.name.trim();

        if (name.length < 5) {
            this.isValid = false;
            this.errorMessage = 'Name must be atleast 2 characters long';
        }
    }

    validateAvailable() {
        const isValidNumber = !isNaN(this.available);

        if (!isValidNumber) {
            this.isValid = false;
            this.errorMessage = 'Value of "Available in stock" must be number!';
        }
    }

    validatePrice() {
        const isValidPrice = !isNaN(this.price);

        if (!isValidPrice) {
            this.isValid = false;
            this.errorMessage = 'Price is not valid!';
        }
    }

    removeUploadImages() {
        this.images.forEach(imgPath => {
            fs.unlink(imgPath, (err) => {
                if (err) {
                    throw err
                }
            })
        });
    }
}

module.exports = Product;