const express = require('express');
const bookController = require('../controllers/booksController');
const router = express.Router();

router.get('/', bookController.getAllBooks);


module.exports = router;