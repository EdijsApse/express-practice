const { ObjectId } = require('mongodb');
const database = require('../database/connection');
const Product = require('./Product');

class Order {
    constructor(products, user) {
        this.products = products ?? [];
        this.user = user;
        this.created = false;
    }

    async createOrder() {

        const productPromises = [];

        this.products.forEach(product_id => {
            productPromises.push(Product.findById(product_id));
        });

        const products = await Promise.all(productPromises).then((productModels) => {
            return productModels;
        });

        const order = await database.getDb().collection('orders').insertOne({
            products: products,
            user: this.user,
            date: Date.now()
        });

        if (order) {
            this.created = true;
        }
    }

    static async findByUserId(userId) {
        const orders = await database.getDb().collection('orders').find({ 'user._id': new ObjectId(userId) }).toArray();
        return orders;
    }
}

module.exports = Order;