const Cart = require('../models/Cart');
const Product = require('../models/Product');

async function addProduct(req, res) {
    const { product_id } = req.body;
    const product = await Product.findById(product_id);
    const cart = new Cart(req.session.cart);

    if (!product) {
        return res.send(`${product_id}`);
    }

    cart.addProduct(product);

    cart.updateList(req.session);

    return res.redirect('/products');
}

function index(req, res) {
    const cart = new Cart(req.session.cart);
    res.render('cart/index', { totalCartValue: cart.getTotal() });
}

function removeProduct(req, res) {
    const cart = new Cart(req.session.cart);
    const product = req.body.product_id;

    cart.removeItem(product);
    cart.updateList(req.session);

    res.redirect('/cart');
}

module.exports = {
    addProduct: addProduct,
    index: index,
    removeProduct: removeProduct
};