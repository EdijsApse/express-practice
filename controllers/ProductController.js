const database = require('../database/connection');

async function index(req, res) {
    const products = await database.getDb().collection('products').find().toArray();

    res.render('products/index', { products });
}

async function store(req, res) {
    const { name, summary, description, price } = req.body;

    const newProduct = {
        name: name,
        summary: summary,
        price: price,
        description: description,
    }

    await database.getDb().collection('products').insertOne(newProduct)

    res.redirect('/products');
}

function create(req, res) {
    res.render('products/create');
}

module.exports = {
    index: index,
    store: store,
    create: create
}