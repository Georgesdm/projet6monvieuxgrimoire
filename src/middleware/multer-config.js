const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.memoryStorage();  // Use memory storage for optimization

const upload = multer({ storage: storage }).single('image');

const optimizeImage = async (req, res, next) => {
    if (!req.file) return next();  // If no file is uploaded, continue
    const filename = `${req.file.originalname.split(' ').join('_').split('.')[0]}_${Date.now()}.jpg`;
    const outputPath = path.join(__dirname, '../images', filename);

    try {
        //compress image
        await sharp(req.file.buffer)
            .jpeg({ quality: 75 })
            .toFile(outputPath);

        req.file.filename = filename;
        req.file.path = outputPath;

        next();
    } catch (error) {
        console.error('Error optimizing image:', error);
        res.status(500).json({ message: 'Erreur lors de l\'optimisation de l\'image' });
    }
};

module.exports = { upload, optimizeImage };