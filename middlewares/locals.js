function errorMessages(req, res, next) {
    const { hasError, errorMessage } = req.session;

    res.locals.hasError = hasError;
    res.locals.errorMessage = errorMessage;

    req.session.hasError = false;
    req.session.errorMessage = null;

    next();
}

function isAuth(req, res, next) {
    const { user } = req.session;

    res.locals.isAuth = false;

    if (user) {
        res.locals.isAuth = true;
    }

    next();
}

function sessionCart(req, res, next) {
    const { cart } = req.session;

    res.locals.cart = [];

    if (cart) {
        res.locals.cart = cart;
    }

    next();
}

module.exports = {
    errorMessages: errorMessages,
    isAuth: isAuth,
    sessionCart: sessionCart
}