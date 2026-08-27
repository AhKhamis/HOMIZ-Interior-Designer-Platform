const express = require('express');
const isAdmin = require('../middleware/isAdmin');
const blogCtrl = require('../controllers/blogCtrl');
const { uploadSingleImage } = require('../middleware/upload');

const router = express.Router();

router.get('/', blogCtrl.index);

router.get('/new', isAdmin, blogCtrl.newBlog);

router.post(
  '/',
  isAdmin,
  uploadSingleImage,
  blogCtrl.create
);

router.get('/:id/edit', isAdmin, blogCtrl.edit);

router.put(
  '/:id',
  isAdmin,
  uploadSingleImage,
  blogCtrl.update
);

router.delete(
  '/:id',
  isAdmin,
  blogCtrl.deleteBlog
);

router.get('/:id', blogCtrl.show);

module.exports = router;