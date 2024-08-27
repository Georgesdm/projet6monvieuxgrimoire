const express = require('express');
const app = express();
const PORT = 4000;

app.get('/', (req, res) => {
  res.json({ message: 'Hello from server!' });
}   );

app.listen(PORT, function() {
    console.log(`Server is running on: ${PORT}`);
}); 