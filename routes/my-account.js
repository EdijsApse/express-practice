const express = require('express');
const router = express.Router();
const myAccountController = require('../controllers/MyAccountController');

router.get('/my-account/profile', myAccountController.profile);
router.post('/my-account/profile', myAccountController.updateProfile);

router.get('/my-account/wallet', myAccountController.wallet);
router.get('/my-account/shipping-address', myAccountController.shippingAddress);

module.exports = router;