const database = require('../database/connection');
const bcrypt = require('bcryptjs');
const { getSessionInputs, flashErrorMessage } = require('../utils/session-validation');

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

    const user = await database.getDb().collection('users').findOne({ email: email });

    if (!user) {
        flashErrorMessage(req, {
            email: email,
            password: password
        }, 'Invalid credentials!');

        return res.redirect('/login');
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
        flashErrorMessage(req, {
            email: email,
            password: password
        }, 'Invalid credentials!');

        return res.redirect('/login');
    }

    req.session.user = user;

    res.redirect('/');
}

async function signUp(req, res) {
    const { email, password, password_confirmation, name, surname } = req.body;

    if (password !== password_confirmation) {

        flashErrorMessage(req, {
            email: email,
            name: name,
            surname: surname
        }, 'Passwords doesnt match!');

        return res.redirect('/signup');
    }
    
    const emailTaken = await database.getDb().collection('users').findOne({ email: email });

    if (emailTaken) {
        
        flashErrorMessage(req, {
            email: email,
            name: name,
            surname: surname
        }, 'Email already taken');

        return res.redirect('/signup');
    }

    const hashedPwd = await bcrypt.hash(password, 12);

    const user = await database.getDb().collection('users').insertOne({
        email: email,
        password: hashedPwd,
        name: name,
        surname: surname
    })

    req.session.user = user;

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