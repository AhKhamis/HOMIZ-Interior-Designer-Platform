const express = require('express');
const isSignedIn = require('../middleware/isSignedIn');
const designersCtrl = require('../controllers/designersCtrl');

const router = express.Router();

router.get('/', designersCtrl.index);

router.get(
  '/profile/edit',
  isSignedIn,
  designersCtrl.editProfile
);

router.put(
  '/profile',
  isSignedIn,
  designersCtrl.updateProfile
);

module.exports = router;