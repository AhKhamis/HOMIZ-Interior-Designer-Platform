const express = require('express');
const isSignedIn = require('../middleware/isSignedIn');
const uploadMultipleImages = require('../middleware/uploadMultiple');
const router = express.Router({ mergeParams: true });

const projectsCtrl = require('../controllers/projectsCtrl');

router.get('/', projectsCtrl.index);
router.get('/new', isSignedIn, projectsCtrl.newProject);

router.post(
  '/',
  isSignedIn,
  uploadMultipleImages,
  projectsCtrl.create
);

router.get('/:id/edit', isSignedIn, projectsCtrl.edit);

router.put(
  '/:id',
  isSignedIn,
  uploadMultipleImages,
  projectsCtrl.update
);

router.delete('/:id', isSignedIn, projectsCtrl.deleteProject);
router.get('/dashboard', isSignedIn, projectsCtrl.dashboard);

router.get('/:id', projectsCtrl.show);

module.exports = router;