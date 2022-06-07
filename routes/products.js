const express = require('express');
const router = express.Router();

const fileUpload = require('../config/file-upload');
const productController = require('../controllers/ProductController');

const accessMiddlewares = require('../middlewares/access');

router.get('/products', productController.index);
router.get('/products/s-:slug', productController.index);
router.post('/products', accessMiddlewares.proceedIfUser, fileUpload.single('image'), productController.store);
router.get('/products/create', accessMiddlewares.proceedIfUser, productController.create);

module.exports = router;