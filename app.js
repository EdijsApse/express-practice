const path = require('path');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/products', (req, res) => {
    res.render('products/index');
});

app.get('/products/create', (req, res) => {
    res.render('products/create');
});

app.listen(3000);