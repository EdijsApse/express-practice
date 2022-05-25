const express = require('express');
const router = express.Router();

const authController = require('../controllers/AuthController');

router.get('/signup', authController.register);
router.post('/signup', authController.signUp);

router.get('/login', authController.login);
router.post('/login', authController.signIn);

router.post('/logout', authController.logout);

module.exports = router;