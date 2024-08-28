require('dotenv').config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const express = require('express');
const cors = require('cors');

const { mongoose } = require('./src/database/mongo.js');
const { signUp, login } = require('./src/api/auth.js');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

//test connexion server
app.get('/', (req, res) => {
  res.json({ message: 'First message' });
}   );

app.post('/api/auth/signup', signUp);

app.post('/api/auth/login', login);

app.listen(PORT, function() {
    console.log(`Server is running on: ${PORT}`);
}); 