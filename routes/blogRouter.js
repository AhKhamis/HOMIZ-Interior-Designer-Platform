const express = require('express');
const isAdmin = require('../middleware/isAdmin');
const blogCtrl = require('../controllers/blogCtrl');

const router = express.Router();

router.get('/', blogCtrl.index);

router.get('/new', isAdmin, blogCtrl.newBlog);
router.post('/', isAdmin, blogCtrl.create);

router.get('/:id/edit', isAdmin, blogCtrl.edit);
router.put('/:id', isAdmin, blogCtrl.update);

router.delete('/:id', isAdmin, blogCtrl.deleteBlog);

router.get('/:id', blogCtrl.show);

module.exports = router;