const multer = require('multer');

const allowedImageTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fields: 10,
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, done) => {
    if (!allowedImageTypes.has(file.mimetype)) {
      return done(new Error('Please choose a JPG, PNG, or WebP image.'));
    }

    return done(null, true);
  },
});

const uploadSingleImage = (req, res, next) => {
  upload.single('image')(req, res, (error) => {
    if (error) {
      return res.status(400).send(error.message);
    }

    return next();
  });
};

module.exports = {
  upload,
  uploadSingleImage,
};