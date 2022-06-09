const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
const SessionHelper = require('../utils/SessionHelper');

async function addProduct(req, res) {
    const { product_id } = req.body;
    const product = await Product.findById(product_id);
    const cart = new Cart(SessionHelper.get(req, Cart.SESSION_STORAGE_KEY));

    if (!product) {
        return res.redirect('/404');
    }

    cart.addProduct(product._id);

    SessionHelper.add(req, Cart.SESSION_STORAGE_KEY, cart.products);
    SessionHelper.flashMessage(req, 'Cart updated!');

    return res.redirect('/products');
}

async function index(req, res, next) {
    const cart = new Cart(SessionHelper.get(req, Cart.SESSION_STORAGE_KEY));
    try {
        cart.loadProductModels().then(() => {
            res.render('cart/index', { totalCartValue: cart.getTotal(), products: cart.products });
        });
    } catch(err) {
        next(err);
    }    
}

function removeProduct(req, res) {
    const cart = new Cart(SessionHelper.get(req, Cart.SESSION_STORAGE_KEY));
    const product = req.body.product_id;

    cart.removeItem(product);
    
    SessionHelper.add(req, Cart.SESSION_STORAGE_KEY, cart.products);
    SessionHelper.flashMessage(req, 'Cart updated!');

    res.redirect('/cart');
}

function emptyCart(req, res) {
    SessionHelper.destroy(req, Cart.SESSION_STORAGE_KEY);
    res.redirect('/cart');
}

async function createOrder(req, res) {
    const products = SessionHelper.get(req, Cart.SESSION_STORAGE_KEY);
    const user = SessionHelper.get(req, 'user');

    const order = new Order(products, user);

    await order.createOrder();

    if (order.created) {
        SessionHelper.destroy(req, Cart.SESSION_STORAGE_KEY);
        SessionHelper.flashMessage(req, 'Order created!');
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