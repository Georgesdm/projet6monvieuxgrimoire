require('dotenv').config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const express = require('express');
const cors = require('cors');
const { mongoose } = require('./src/database/mongo'); // Connexion à MongoDB
const authRoutes = require('./src/routes/auth'); // Import des routes d'authentification (mis à jour)

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Route de test pour s'assurer que le serveur fonctionne
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Utilisation des routes d'authentification
app.use('/api/auth', authRoutes);

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Server is running on: ${PORT}`);
});