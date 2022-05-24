require('dotenv').config();

const path = require('path');
const express = require('express');
const app = express();

const database = require('./database/connection');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

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

database.createConnection().then(() => {
    app.listen(3000);
})
.catch((err) => {
    console.log(err);
})