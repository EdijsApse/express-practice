const database = require('../database/connection');
const Product = require('../models/Product');
const { getSessionInputs, flashErrorMessage } = require('../utils/session-validation');

async function index(req, res) {
    const products = await database.getDb().collection('products').find().toArray();

    res.render('products/index', { products });
}

async function store(req, res) {
    const { name, summary, description, price, available } = req.body;
    const images = req.files.map((file) => file.path);
    const product = new Product(name, price, summary, description, available, images);

    product.validate();

    if (!product.isValid) {
        
        product.removeUploadImages();

        flashErrorMessage(req, {
            name: name,
            price: price,
            summary: summary,
            description: description,
            available: available
        }, product.errorMessage);
    }

    await product.create();

    return res.redirect('/products');
}

function create(req, res) {
    const inputs = getSessionInputs(req, {
        name: '',
        price: '',
        summary: '',
        description: '',
        available: ''
     });

    res.render('products/create', { inputs });
}

module.exports = {
    index: index,
    store: store,
    create: create
}