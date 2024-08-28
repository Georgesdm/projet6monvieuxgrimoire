const { Book } = require('../models/books.js');

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        console.error('Erreur lors de la récupération des livres:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};
