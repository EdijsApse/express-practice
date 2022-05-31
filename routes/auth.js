const express = require('express');
const router = express.Router();

const authController = require('../controllers/AuthController');
const accessMiddlewares = require('../middlewares/access');

router.get('/signup', accessMiddlewares.proceedIfGuest, authController.register);
router.post('/signup', accessMiddlewares.proceedIfGuest, authController.signUp);

router.get('/login', accessMiddlewares.proceedIfGuest, authController.login);
router.post('/login', accessMiddlewares.proceedIfGuest, authController.signIn);

router.post('/logout',accessMiddlewares.proceedIfUser, authController.logout);

module.exports = router;