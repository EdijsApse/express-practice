const express = require('express');
const router = express.Router();

const errorController = require('../controllers/ErrorController');

router.get('/403', errorController.accessDenied);
router.get('*', errorController.notFound);

module.exports = router;