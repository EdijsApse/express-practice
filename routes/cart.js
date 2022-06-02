const express = require('express');
const router = express.Router();

const cartController = require('../controllers/CartController');

const accessMiddlewares = require('../middlewares/access');

router.get('/cart', cartController.index);
router.post('/cart/add', cartController.addProduct);
router.post('/cart/remove', cartController.removeProduct);
router.post('/cart/empty', cartController.emptyCart);
router.post('/cart/proceed', accessMiddlewares.proceedIfUser, cartController.createOrder);

module.exports = router;