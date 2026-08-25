const express = require('express');
const isAdmin = require('../middleware/isAdmin');
const adminCtrl = require('../controllers/adminCtrl');

const router = express.Router();

router.get('/', isAdmin, adminCtrl.dashboard);

router.put(
  '/designers/:id/approve',
  isAdmin,
  adminCtrl.approveDesigner
);

router.put(
  '/designers/:id/reject',
  isAdmin,
  adminCtrl.rejectDesigner
);

module.exports = router;