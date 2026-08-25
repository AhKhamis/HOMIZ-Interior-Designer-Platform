const express = require('express');
const blogCtrl = require('../controllers/blogCtrl');

const router = express.Router();

router.get('/', blogCtrl.index);

router.get('/:id', blogCtrl.show);

module.exports = router;