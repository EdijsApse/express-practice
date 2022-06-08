const UrlHelper = require('../utils/UrlHelper')
const FormHelper = require('../utils/FormHelper');

function flashMessage(req, res, next) {
    const { flashMessage } = req.session;
    res.locals.hasFlashMessage = false;

    if (flashMessage) {
        const { type, message } = flashMessage;
        res.locals.hasFlashMessage = true;
        res.locals.type = type;
        res.locals.message = message;
        req.session.flashMessage = null
    }

    next();
}

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
    const { products } = req.session;

    res.locals.products = [];

    if (products) {
        res.locals.products = products;
    }

    next();
}

function urlBuilder(req, res, next) {
    res.locals.urlHelper = new UrlHelper(req);
    next();
}

function formHelper(req, res, next) {
    const inputs = req.session.inputs ? req.session.inputs : {};
    const errors = req.session.errors ? req.session.errors : [];

    const formHelper = new FormHelper(inputs, errors);

    res.locals.formHelper = formHelper;
    
    req.session.inputs = null;
    req.session.errors = null;

    next();
}

module.exports = {
    errorMessages: errorMessages,
    isAuth: isAuth,
    sessionCart: sessionCart,
    urlBuilder: urlBuilder,
    formHelper: formHelper,
    flashMessage: flashMessage
}