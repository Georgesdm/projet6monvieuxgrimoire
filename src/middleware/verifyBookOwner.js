const { Book } = require('../models/books.js');

exports.verifyBookOwner = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: 'unauthorized request' });
    }

    next();
  } catch (error) {
    next(error);
  }
};