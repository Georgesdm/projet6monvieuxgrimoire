const express = require('express');
const bookController = require('../controllers/booksController');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const multer = require('../middleware/multer-config');

router.get('/', bookController.getAllBooks);
router.post('/', authenticateToken, multer, bookController.createBook);

router.get('/bestrating', bookController.getBestRatedBooks);
router.get('/:id', bookController.getBook);
router.delete('/:id', authenticateToken, bookController.deleteBook);
router.post('/:id/rating', authenticateToken, bookController.ratingBook);
router.put('/:id', authenticateToken, multer, bookController.updateBook);


module.exports = router;