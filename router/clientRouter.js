const router = require('express').Router();
const itemController = require('../controllers/itemController');
// const userController = require('../controllers/userController');
const transController = require('../controllers/transactionsController');
const search = require('../search/search.js');
const passport = require('passport');
const images = require('../controllers/imageController');
const suggestions = require('../controllers/suggestionController');
const categories = require('../controllers/categoryController');

// General Routes for everything related to items including buying, selling, confirming, and finding user role
router
  .get('/items/categories', itemController.getCategories)
  .get('/items/:id', itemController.getItem)
  .post('/items/:id/buy', itemController.buyItem)
  .get('/items/:id/confirm', itemController.boughtConfirmation)
  .post('/items/sell', itemController.sellItem)
  .get('/items/:id/shipped', itemController.shippedItem)
  .put('/items/:id/update', itemController.updateItem)
  .delete('/items/:id', itemController.deleteItem)
  .get('/disputes', itemController.getDisputes)
  .post('/disputes', itemController.resolveDisputes)
  .post('/disputes/:id', itemController.startDispute)

// Transaction routes
  .get('/items/:id/:email/transaction', transController.findUserRole)
  .post('/items/transaction', transController.sendPayment)

// Images Routes for uploading images to AWS
  .post('/image', images.addImage)

// Categorization Routes for sending to flask service so that it can categorize an item based on the title and description
  .post('/categories/predict', categories.predict)
  .post('/categories/fit', categories.fit)
// Search routes for getting recent queries from elastic search and suggestions based on recent
  .get('suggestions', suggestions.getSuggestions)
  .get('recent', suggestions.getRecent)
  .get('/search/:q/:cat?', search);

module.exports = router;
