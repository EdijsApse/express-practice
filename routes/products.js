const express = require('express');
const database = require('../database/connection');
const router = express.Router();

router.get('/products', async (req, res) => {

    const products = await database.getDb().collection('products').find().toArray();

    res.render('products/index', {
        products
    });
});

router.post('/products', async (req, res) => {
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

router.get('/products/create', (req, res) => {
    res.render('products/create');
});

module.exports = router;