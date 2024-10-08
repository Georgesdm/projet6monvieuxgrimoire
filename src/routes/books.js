const express = require('express');
const bookController = require('../controllers/booksController');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { verifyBookOwner } = require('../middleware/verifyBookOwner');
const { upload, optimizeImage } = require('../middleware/multer-config');

router.get('/', bookController.getAllBooks);
router.post('/', authenticateToken, upload, optimizeImage, bookController.createBook);

router.get('/bestrating', bookController.getBestRatedBooks);
router.get('/:id', bookController.getBook);
router.delete('/:id', authenticateToken, verifyBookOwner, bookController.deleteBook);
router.post('/:id/rating', authenticateToken, bookController.ratingBook);
router.put('/:id', authenticateToken, verifyBookOwner, upload, optimizeImage, bookController.updateBook);


module.exports = router;