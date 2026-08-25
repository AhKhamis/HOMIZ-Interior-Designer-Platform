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

const newBlog = async (req, res) => {
  res.render('blog/new.ejs');
};

const create = async (req, res) => {
  try {
    await Blog.create(req.body);

    res.redirect('/blog');
  } catch (err) {
    console.log(err);
    res.redirect('/blog');
  }
};

const edit = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    res.render('blog/edit.ejs', { blog });
  } catch (err) {
    console.log(err);
    res.redirect('/blog');
  }
};

const update = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.redirect(`/blog/${blog._id}`);
  } catch (err) {
    console.log(err);
    res.redirect('/blog');
  }
};

const deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);

    res.redirect('/blog');
  } catch (err) {
    console.log(err);
    res.redirect('/blog');
  }
};

module.exports = {
  index,
  show,
  newBlog,
  create,
  edit,
  update,
  deleteBlog,
};