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

module.exports = {
    profile: profile,
    wallet: wallet,
    shippingAddress: shippingAddress,
    updateProfile: updateProfile
}