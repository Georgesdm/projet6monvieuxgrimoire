const { Book } = require('../models/books.js');
const fs = require('fs');
const path = require('path');

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

exports.deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id;

        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }

        //image path
        const imagePath = path.join(__dirname, '../images', book.imageUrl.split('/images/')[1]);

        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error('Erreur lors de la suppression de l\'image:', err);
            }
        });

        await Book.findByIdAndDelete(bookId);

        res.status(200).json({ message: 'Livre et image associés supprimés avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du livre:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};

// Add a rating to a book
exports.ratingBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const { userId, rating } = req.body;

        if (rating < 0 || rating > 5) {
            return res.status(400).json({ message: 'La note doit être comprise entre 0 et 5.' });
        }

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }

        const existingRating = book.ratings.find(r => r.userId.toString() === userId);
        if (existingRating) {
            return res.status(400).json({ message: 'Vous avez déjà noté ce livre.' });
        }

        book.ratings.push({ userId, grade: rating });

        const totalRating = book.ratings.reduce((acc, curr) => acc + curr.grade, 0);
        book.averageRating = totalRating / book.ratings.length;

        // Save the updated book
        await book.save();

        res.status(200).json(book);
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la note:', error);  
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const bookId = req.params.id;

        const bookObject = req.body.book ? JSON.parse(req.body.book) : req.body;
        delete bookObject._id;
        delete bookObject.userId;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }

        if (req.file) {
            if (book.imageUrl) {
                const oldImagePath = path.join(__dirname, '../images', book.imageUrl.split('/images/')[1]);
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error('Erreur lors de la suppression de l\'ancienne image:', err);
                    }
                });
            }
            bookObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        }

        // Update the book details
        Object.assign(book, bookObject);

        await book.save();

        res.status(200).json({ message: 'Livre mis à jour avec succès', book });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du livre:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};