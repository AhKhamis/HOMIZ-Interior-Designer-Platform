const express = require('express');

const isAdmin = require('../middleware/isAdmin');
const adminCtrl = require('../controllers/adminCtrl');

const router = express.Router();

router.get('/', isAdmin, adminCtrl.dashboard);

router.delete(
  '/users/:id',
  isAdmin,
  adminCtrl.deleteUser
);

module.exports = router;