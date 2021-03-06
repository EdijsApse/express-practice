const ProductForm = require('../forms/ProductForm');
const Category = require('../models/Category');
const Product = require('../models/Product');
const ProductSearch = require('../models/ProductSearch');
const FileHelper = require('../utils/FileHelper');
const SessionHelper = require('../utils/SessionHelper');

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
    const inputs = {
        ...req.body,
        user_id: req.session.user ? req.session.user._id : null,
        image: req.file ? req.file.path : null
    };
    const form = new ProductForm(inputs);

    try {
        await form.validate();
    } catch(err) {
        return next(err);
    }

    if (!form.isValid) {
        req.session.inputs = req.body;
        req.session.errors = form.errors;
        
        try {
            FileHelper.removeFile(form.image);
        } catch(err) {
            return next(err);
        }

        return res.redirect('/products/create');
    }
    
    const product = await Product.create({...form.getModelAttributes()});

    if (!product) {
        SessionHelper.flashMessage(req, 'Product not created!', false);
        return res.redirect('/products/create');
    }

    SessionHelper.flashMessage(req, 'Product created!');

    return res.redirect('/products');
}

async function create(req, res) {
    const categories = await Category.find();
    res.render('products/create', { categories });
}

module.exports = {
    index: index,
    store: store,
    create: create
}