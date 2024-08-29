require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { mongoose } = require('./src/database/mongo'); // Connexion à MongoDB
const authRoutes = require('./src/routes/auth');
const booksRoutes = require('./src/routes/books');
const { authenticateToken } = require('./src/middleware/authMiddleware');
const path = require('path');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Route de test pour s'assurer que le serveur fonctionne
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);

//app.put('/api/bookis', authenticateToken, (req, res) => {
  //res.json({ message: 'Cette route est protégée, utilisateurs uniquement', userId: req.user.userId });
//});

app.use('/images', express.static(path.join(__dirname, 'src/images')));



// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Server is running on: ${PORT}`);
});