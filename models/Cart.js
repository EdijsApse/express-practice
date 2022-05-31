const Product = require('./Product');

class Cart {

    constructor(products) {
        this.products = products ?? [];
    }

    isInProductList(product_id) {
        return this.products.findIndex((product) => product._id.equals(product_id)) !== -1;
    }

    addProduct(product) {
        if (!this.isInProductList(product._id)) {
            this.products.push(product);
        }
    }

    removeItem(product_id) {
        const index = this.products.findIndex((product) => product._id.equals(product_id));

        if (index !== -1) {
            this.products.splice(index, 1);
        }
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

    updateList(session) {
        session.cart = this.products;
    }

    getProducts() {
        return this.products.map((product) => {
            return new Product(product.name, product.price, product.summary, product.description, product.available, product.images, product._id);
        })
    }

    emptyCart(session) {
        session.cart = [];
    }
}

module.exports = Cart;