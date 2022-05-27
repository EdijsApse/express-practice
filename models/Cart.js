class Cart {

    constructor(products) {
        this.products = products ?? [];
    }

    addProduct(product) {
        this.products.push(product);
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

    
}

module.exports = Cart;