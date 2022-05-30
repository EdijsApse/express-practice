const express = require('express');
const router = express.Router();

const fileUpload = require('../config/file-upload');
const productController = require('../controllers/ProductController');

router.get('/products', productController.index);
router.get('/products/s-:slug', productController.index);
router.post('/products', fileUpload.array('product-images'), productController.store);
router.get('/products/create', productController.create);

module.exports = router;