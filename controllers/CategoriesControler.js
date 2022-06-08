const CategoryForm = require("../forms/CategoryForm");
const Category = require("../models/Category");
const SessionHelper = require("../utils/SessionHelper");

async function index(req, res) {
    const categories = await Category.find();
    const productCountPromises = [];
    
    categories.forEach(category => {
        productCountPromises.push(
            category.getProdcutCount()
            .then((count) => {
                category.productCount = count;
            })
            .catch(() => {
                category.productCount = 0
            })
        );
    });

    Promise.all(productCountPromises).then(() => {
        res.render('categories/index', { categories: categories });
    })
}

function create(req, res) {
    res.render('categories/create');
}

async function store(req, res) {
    const form = new CategoryForm(req.body);
    
    try {
        await form.validate();
    } catch(err) {
        return next(err);
    }

    if (!form.isValid) {
        req.session.inputs = req.body;
        req.session.errors = form.errors;
        return res.redirect('/categories/create');
    }

    const category = await Category.create(form.getModelAttributes());

    if (!category) {
        SessionHelper.flashMessage(req, 'Category not created!', false);
        return res.redirect('/categories/create');
    }

    SessionHelper.flashMessage(req, 'Category created!');

    res.redirect('/categories');
}

async function deleteCategory(req, res) {
    const category = await Category.findById(req.body.categoryId);

    if (!category) {
        return res.redirect('/404');
    }

    await category.destroy();

    SessionHelper.flashMessage(req, 'Category deleted!');

    res.redirect('/categories');
}

module.exports = {
    index: index,
    create: create,
    store: store,
    deleteCategory: deleteCategory
}