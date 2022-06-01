const Category = require('../models/Category');
const Product = require('../models/Product');
const ProductSearch = require('../models/ProductSearch');
const { getSessionInputs, flashErrorMessage } = require('../utils/session-validation');

async function index(req, res) {
    const searchQuery = {...req.params, ...req.query};
    const dataProvider = new ProductSearch(searchQuery);
    const categories = await Category.find();

    await dataProvider.prepareData();

    res.render('products/index', {
        dataProvider: dataProvider,
        categories: categories,
    });
}

async function store(req, res, next) {
    const { name, summary, description, price, category_id } = req.body;
    const images = req.files.map((file) => file.path);
    const { user } = req.session
    const product = new Product(name, price, summary, description, category_id, images, user);

    try {
        await product.validate();
    } catch(err) {
        return next(err);
    }

    if (!product.isValid) {
        
        product.removeUploadImages();

        flashErrorMessage(req, {
            name: name,
            price: price,
            summary: summary,
            description: description,
            category_id: category_id
        }, product.errorMessage);
        
        return res.redirect('/products/create')
    }

    await product.create();

    return res.redirect('/products');
}

async function create(req, res) {
    const categories = await Category.find();
    const inputs = getSessionInputs(req, {
        name: '',
        price: '',
        summary: '',
        category_id: '',
        description: ''
     });

    res.render('products/create', { inputs, categories });
}

module.exports = {
    index: index,
    store: store,
    create: create
}