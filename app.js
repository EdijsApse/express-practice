require('dotenv').config();

const path = require('path');
const express = require('express');
const app = express();

const session = require('./config/session');
const database = require('./database/connection');

const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const landingRoutes = require('./routes/landing');
const cartRoutes = require('./routes/cart');

const locals = require('./middlewares/locals');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(session);

app.use(locals.errorMessages);
app.use(locals.isAuth);
app.use(locals.sessionCart);

app.use(landingRoutes);
app.use(productRoutes);
app.use(authRoutes);
app.use(cartRoutes);

database.createConnection().then(() => {
    app.listen(3000);
})
.catch((err) => {
    console.log(err);
})