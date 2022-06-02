const { ObjectId } = require('mongodb');
const database = require('../database/connection');

class Order {
    constructor(products, user) {
        this.products = products;
        this.user = user;
        this.created = false;
    }

    async createOrder() {
        const order = await database.getDb().collection('orders').insertOne({
            products: this.products,
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