const express = require('express');
const router = express.Router({ mergeParams: true });

const projectsCtrl = require('../controllers/projectsCtrl');

router.get('/', projectsCtrl.index);

module.exports = router;