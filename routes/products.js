const express = require('express');
const router = express.Router();

const productController = require('../controllers/ProductController');

router.get('/products', productController.index);
router.post('/products', productController.store);
router.get('/products/create', productController.create);

module.exports = router;