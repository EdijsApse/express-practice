const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/CategoriesControler');

const accessMiddlewares = require('../middlewares/access');

router.get('/categories', accessMiddlewares.proceedIfAdmin, categoriesController.index);
router.post('/categories', accessMiddlewares.proceedIfAdmin, categoriesController.store);
router.get('/categories/create', accessMiddlewares.proceedIfAdmin, categoriesController.create);
router.post('/categories/delete', accessMiddlewares.proceedIfAdmin, categoriesController.deleteCategory);

module.exports = router;