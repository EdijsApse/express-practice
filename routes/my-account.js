const express = require('express');
const router = express.Router();
const myAccountController = require('../controllers/MyAccountController');

const accessMiddlewares = require('../middlewares/access');

router.get('/my-account/profile', accessMiddlewares.proceedIfUser, myAccountController.profile);
router.post('/my-account/profile', accessMiddlewares.proceedIfUser, myAccountController.updateProfile);

router.get('/my-account/wallet', accessMiddlewares.proceedIfUser, myAccountController.wallet);
router.get('/my-account/shipping-address', accessMiddlewares.proceedIfUser, myAccountController.shippingAddress);

router.get('/my-account/orders', accessMiddlewares.proceedIfUser, myAccountController.orders);

module.exports = router;