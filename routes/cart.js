const express = require('express');
const router = express.Router();

const cartController = require('../controllers/CartController');

router.get('/cart', cartController.index);
router.post('/cart/add', cartController.addProduct);
router.post('/cart/remove', cartController.removeProduct);

module.exports = router;