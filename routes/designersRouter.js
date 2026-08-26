const express = require('express');
const isSignedIn = require('../middleware/isSignedIn');
const { uploadSingleImage } = require('../middleware/upload');
const designersCtrl = require('../controllers/designersCtrl');

const router = express.Router();

router.get('/', designersCtrl.index);

router.get('/:id', designersCtrl.showProfile);

router.get(
  '/profile/edit',
  isSignedIn,
  designersCtrl.editProfile
);

router.put(
  '/profile',
  isSignedIn,
  uploadSingleImage,
  designersCtrl.updateProfile
);

module.exports = router;