const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/CategoriesControler');

router.get('/categories', categoriesController.index);
router.post('/categories', categoriesController.store);
router.get('/categories/create', categoriesController.create);
router.post('/categories/delete', categoriesController.deleteCategory);

module.exports = router;