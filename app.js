require('dotenv').config();

const path = require('path');
const express = require('express');
const app = express();


const session = require('./session/store-config');
const database = require('./database/connection');

const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const landingRoutes = require('./routes/landing');

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

app.use(landingRoutes);
app.use(productRoutes);
app.use(authRoutes);

database.createConnection().then(() => {
    app.listen(3000);
})
.catch((err) => {
    console.log(err);
})