require('dotenv').config();

const path = require('path');
const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');

const session = require('./session/store-config');
const database = require('./database/connection');

const { getSessionInputs, flashErrorMessage } = require('./utils/session-validation')

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(session);

app.use((req, res, next) => {
    const { hasError, errorMessage } = req.session;

    res.locals.hasError = hasError;
    res.locals.errorMessage = errorMessage;

    req.session.hasError = false;
    req.session.errorMessage = null;

    next();
})

app.use((req, res, next) => {
    const { user } = req.session;

    res.locals.isAuth = false;

    if (user) {
        res.locals.isAuth = true;
    }

    next();
})

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/products', async (req, res) => {

    const products = await database.getDb().collection('products').find().toArray();

    res.render('products/index', {
        products
    });
});

app.post('/products', async (req, res) => {
    const { name, summary, description, price } = req.body;

    const newProduct = {
        name: name,
        summary: summary,
        price: price,
        description: description,
    }

    await database.getDb().collection('products').insertOne(newProduct)

    res.redirect('/products');
});

app.get('/products/create', (req, res) => {
    res.render('products/create');
});

app.get('/signup', (req, res) => {

    const inputs = getSessionInputs(req, {
       name: '',
       surname: '',
       email: ''
    });

    res.render('auth/signup', {
        inputs: inputs
    });
})

app.post('/signup', async (req, res) => {
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
})

app.get('/login', (req, res) => {
    const inputs = getSessionInputs(req, {
        email: '',
        password: ''
     });

    res.render('auth/login', { inputs: inputs });
})

app.post('/login', async (req, res) => {
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
})

app.post('/logout', async (req, res) => {
    req.session.user = null;
    res.redirect('/');
})

database.createConnection().then(() => {
    app.listen(3000);
})
.catch((err) => {
    console.log(err);
})