const ShippingAddressForm = require("../forms/ShippingAddressForm");
const Order = require("../models/Order");
const ShippingAddress = require("../models/ShippingAddress");
const SessionHelper = require("../utils/SessionHelper");

function profile(req, res) {
    return res.render('my-account/profile', { user: req.session.user });
}

function updateProfile(req, res) {

}

async function shippingAddress(req, res) {
    const user = SessionHelper.get(req, 'user');
    const address = await ShippingAddress.findByUserId(user._id);

    return res.render('my-account/shipping-address', { address });
}

async function storeShippingAddress(req, res, next) {
    const user = SessionHelper.get(req, 'user');
    const form = new ShippingAddressForm({...req.body, user_id: user._id});
    let address;
    try {
        await form.validate();
    } catch(err) {
        return next(err);
    }

    if (!form.isValid) {
        SessionHelper.add(req, 'errors', form.errors);
        SessionHelper.add(req, 'inputs', req.body);
        return res.redirect('/my-account/shipping-address');
    }

    if (req.body._id) {
        address = await ShippingAddress.updateById(req.body._id, form.getModelAttributes());
    } else {
        address = await ShippingAddress.create(form.getModelAttributes());
    }

    if (!address) {
        SessionHelper.flashMessage(req, 'Shipping address not updated!', false);
    }

    SessionHelper.flashMessage(req, 'Shipping address updated!');

    res.redirect('/my-account/shipping-address')

}

async function orders(req, res) {
    const orders = await Order.findByUserId(req.session.user._id);
    return res.render('my-account/orders', { orders });
}


module.exports = {
    profile: profile,
    shippingAddress: shippingAddress,
    updateProfile: updateProfile,
    orders: orders,
    storeShippingAddress: storeShippingAddress
}