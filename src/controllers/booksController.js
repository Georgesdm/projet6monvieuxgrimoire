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

exports.createBook = async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        console.log('Request File:', req.file);

        const bookObject = JSON.parse(req.body.book);
        delete bookObject._id;  
        delete bookObject.userId;

        const book = new Book({
            ...bookObject,
            userId: req.auth.userId,  // Use userId from authenticated user
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        });

        await book.save();
        res.status(201).json({ message: 'Livre enregistré' });
    } catch (error) {
        console.error('Erreur creation du book', error);
        res.status(400).json({ error: error.message });
    }
};

exports.getBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }
        res.status(200).json(book);
    } catch (error) {
        console.error('Erreur lors de la récupération du livre:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};

exports.getBestRatedBooks = async (req, res) => {
    try {
        const bestRatedBooks = await Book.find().sort({ averageRating: -1 }).limit(3); // Find the top 3 books by average rating

        res.status(200).json(bestRatedBooks);
    } catch (error) {
        console.error('Erreur lors de la récupération des meilleurs livres:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};