const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    if (err.name === 'MongoError') {
      return res.status(400).json({ message: err.message });
    }
  
    res.status(500).json({ message: err.message }); // Retourner le message d'erreur d'origine
  };
  
  module.exports = errorHandler;