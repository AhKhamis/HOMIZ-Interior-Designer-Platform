const Blog = require('../models/blog');

const index = async (req, res) => {
  try {
    const blogs = await Blog.find();

    res.render('blog/index.ejs', { blogs });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

const show = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    res.render('blog/show.ejs', { blog });
  } catch (err) {
    console.log(err);
    res.redirect('/blog');
  }
};

module.exports = {
  index,
  show,
};