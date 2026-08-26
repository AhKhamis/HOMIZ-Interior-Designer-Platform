const { upload } = require('./upload');

const uploadMultipleImages = (req, res, next) => {
  upload.array('images', 5)(req, res, (error) => {
    if (error) {
      return res.status(400).send(error.message);
    }

    return next();
  });
};

module.exports = uploadMultipleImages;