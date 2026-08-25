const express = require('express');
const pagesCtrl = require('../controllers/pagesCtrl');

const router = express.Router();

router.get('/', pagesCtrl.home);

router.get('/pending', pagesCtrl.pending);

router.get('/rejected', pagesCtrl.rejected);

module.exports = router;
