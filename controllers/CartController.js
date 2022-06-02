const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { flashErrorMessage } = require('../utils/session-validation');

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
    res.render('cart/index', { totalCartValue: cart.getTotal(), products: cart.getProducts() });
}

function removeProduct(req, res) {
    const cart = new Cart(req.session.cart);
    const product = req.body.product_id;

    cart.removeItem(product);
    cart.updateList(req.session);

    res.redirect('/cart');
}

function emptyCart(req, res) {
    const cart = new Cart(req.session.cart);
    cart.emptyCart(req.session);
    res.redirect('/cart');
}

async function createOrder(req, res) {
    const products = req.session.cart;
    const user = req.session.user;

    const cart = new Cart(req.session.cart);
    const order = new Order(products, user);

    await order.createOrder();

    if (order.created) {
        cart.emptyCart(req.session);
        return res.redirect('/my-account/orders');
    }

    res.redirect('/cart');
}

module.exports = {
    addProduct: addProduct,
    index: index,
    removeProduct: removeProduct,
    emptyCart: emptyCart,
    createOrder: createOrder
};