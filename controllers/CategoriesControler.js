const Category = require("../models/Category");
const { flashErrorMessage, getSessionInputs } = require('../utils/session-validation');

async function index(req, res) {
    const categories = await Category.find();
    res.render('categories/index', { categories });
}

function create(req, res) {
    const inputs = getSessionInputs(req, { name: '' });
    res.render('categories/create', { inputs });
}

async function store(req, res) {
    const { name } = req.body;
    const category = new Category(name);
    
    category.validate();
    
    if (!category.isValid) {
        flashErrorMessage(req, {
            name: name,
        }, category.errorMessage);
        return res.redirect('/categories/create');
    }

    await category.create();

    res.redirect('/categories');
}

async function deleteCategory(req, res) {
    const category = await Category.findById(req.body.categoryId);

    if (!category) {
        return res.redirect('/404');
    }

    await category.destroy();

    res.redirect('/categories');
}

module.exports = {
    index: index,
    create: create,
    store: store,
    deleteCategory: deleteCategory
}