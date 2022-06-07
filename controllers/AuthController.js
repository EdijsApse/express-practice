const { getSessionInputs, flashErrorMessage } = require('../utils/session-validation');
const User = require('../models/User');
const RegistrationForm = require('../forms/RegistrationForm');

function login(req, res) {
    const inputs = getSessionInputs(req, {
        email: '',
        password: ''
     });

    res.render('auth/login', { inputs: inputs });
}

function register(req, res) {
    const inputs = getSessionInputs(req, {
        name: '',
        surname: '',
        email: ''
     });
 
     res.render('auth/signup', {
         inputs: inputs
     });
}

async function signIn(req, res) {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    
    if (user) {
        await user.comparePasswords(password);
    }

    if (!user || !user.isValid) {
        const errMessage = user ? user.errorMessage : 'Invalid credentials';

        flashErrorMessage(req, {
            email: email,
            password: password
        }, errMessage);

        return res.redirect('/login');
    }

    user.login(req);

    res.redirect('/');
}

async function signUp(req, res) {

    const form = new RegistrationForm(req.body);

    await form.validate();

    if (!form.isValid) {
        req.session.inputs = req.body;
        req.session.errors = form.errors;

        return res.redirect('/signup');
    }

    const user = new User(form.name, form.surname, form.email, form.password);

    await user.register();
    
    user.login(req);

    res.redirect('/');
}

function logout(req, res) {
    req.session.user = null;
    res.redirect('/');
}

module.exports = {
    login: login,
    register: register,
    signIn: signIn,
    signUp: signUp,
    logout: logout
}