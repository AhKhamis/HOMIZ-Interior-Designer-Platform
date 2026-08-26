const express = require('express');
const isSignedIn = require('../middleware/isSignedIn');
const { uploadSingleImage } = require('../middleware/upload');
const router = express.Router({ mergeParams: true });
const authCtrl = require('../controllers/authCtrl');

router.get('/sign-up', authCtrl.signup);
router.post('/sign-up', uploadSingleImage, authCtrl.register);
router.get('/sign-in', authCtrl.signin);
router.post('/sign-in', authCtrl.login);
router.get('/sign-out', isSignedIn, authCtrl.signout);

module.exports = router;