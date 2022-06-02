const Order = require("../models/Order");

function profile(req, res) {
    return res.render('my-account/profile', { user: req.session.user });
}

function updateProfile(req, res) {
}

function wallet(req, res) {
    return res.render('my-account/wallet');
}

function shippingAddress(req, res) {
    return res.render('my-account/shipping-address');
}

async function orders(req, res) {
    const orders = await Order.findByUserId(req.session.user._id);
    return res.render('my-account/orders', { orders });
}


module.exports = {
    profile: profile,
    wallet: wallet,
    shippingAddress: shippingAddress,
    updateProfile: updateProfile,
    orders: orders
}