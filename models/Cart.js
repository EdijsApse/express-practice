const { ObjectId } = require('mongodb');
const Product = require('./Product');

class Cart {

    static SESSION_STORAGE_KEY = 'products';

    constructor(products) {
        this.products = products ?? [];
    }

    isInProductList(product_id) {
        return this.products.findIndex((id) => id.equals(product_id)) !== -1;
    }

    addProduct(product_id) {
        if (!this.isInProductList(product_id)) {
            this.products.push(new ObjectId(product_id));
        }
    }

    removeItem(product_id) {
        const index = this.products.findIndex((id) => id.equals(product_id));

        if (index !== -1) {
            this.products.splice(index, 1);
        }
    }

    async loadProductModels() {
        const productPromises = [];
        const _this = this;

        this.products.forEach(id => {
            productPromises.push(Product.findById(id))
        });

        await Promise.all(productPromises).then((products) => {
            _this.products = products;
        })
    }

    getTotal() {
        const sum = 0;
        const total = this.products.reduce((item, current) => {
            const prevPrice = Number.parseFloat(item);
            const currenPrice = Number.parseFloat(current.price);
            return (prevPrice + currenPrice)
        }, sum);

        return total.toFixed(2);
    }

    getProducts() {
        return this.products.map((product) => {
            return new Product(product.name, product.price, product.summary, product.description, product.available, product.images, product._id);
        })
    }
}

module.exports = Cart;