const User = require('../models/User');
const RegistrationForm = require('../forms/RegistrationForm');
const LoginForm = require('../forms/LoginForm');
const SessionHelper = require('../utils/SessionHelper');

function login(req, res) {
    res.render('auth/login');
}

function register(req, res) {
     res.render('auth/signup');
}

async function signIn(req, res) {
    const form = new LoginForm(req.body);

    await form.validate();

    if (!form.isValid) {
        SessionHelper.add(req, 'errors', form.errors);
        SessionHelper.add(req, 'inputs', req.body);

        return res.redirect('/login');
    }

    const user = await User.findByEmail(form.email);

    if (!user) {
        SessionHelper.flashMessage(req, 'Cant sign you in!', false);
        return res.redirect('/login');
    }

    user.login(req);

    SessionHelper.flashMessage(req, 'Welcome to MyCart online shop!');

    res.redirect('/');
}

async function signUp(req, res) {

    const form = new RegistrationForm(req.body);

    await form.validate();

    if (!form.isValid) {
        SessionHelper.add(req, 'errors', form.errors);
        SessionHelper.add(req, 'inputs', req.body);

        return res.redirect('/signup');
    }

    const user = await User.create(form.getModelAttributes());

    if (!user) {
        SessionHelper.flashMessage(req, 'Cannot create new user !', false);
        return res.redirect('/login');
    }
    
    SessionHelper.flashMessage(req, 'Welcome to MyCart online shop!');

    user.login(req);

    res.redirect('/');
}

function logout(req, res) {
    SessionHelper.destroy(req, 'user');
    res.redirect('/');
}

module.exports = {
    login: login,
    register: register,
    signIn: signIn,
    signUp: signUp,
    logout: logout
}