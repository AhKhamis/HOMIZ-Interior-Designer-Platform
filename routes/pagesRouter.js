const express = require('express');

const pagesCtrl = require('../controllers/pagesCtrl');
const isSignedIn = require('../middleware/isSignedIn');
const { uploadSingleImage } = require('../middleware/upload');

const router = express.Router();

router.get('/', pagesCtrl.home);

router.post(
  '/profile-image',
  isSignedIn,
  uploadSingleImage,
  pagesCtrl.uploadProfileImage
);

module.exports = router;