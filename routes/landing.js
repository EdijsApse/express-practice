const express = require('express');
const router = express.Router();

const landingController = require('../controllers/LandingController');

router.get('/', landingController.index);

module.exports = router;