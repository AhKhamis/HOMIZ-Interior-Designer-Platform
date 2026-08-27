const User = require('../models/user');
const Designer = require('../models/designer');
const Project = require('../models/project');
const Blog = require('../models/blog');

const dashboard = async (req, res) => {
  try {
    const users = await User.find();
    const designers = await Designer.find().populate('user');
    const blogs = await Blog.find();

    res.render('admin/dashboard.ejs', {
      users,
      designers,
      blogs,
    });
  } catch (err) {
    res.redirect('/');
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.redirect('/admin');
    }

    const designer = await Designer.findOneAndDelete({
      user: user._id,
    });

    if (designer) {
      await Project.deleteMany({
        designer: designer._id,
      });
    }

    await User.findByIdAndDelete(user._id);

    res.redirect('/admin');
  } catch (err) {
    res.redirect('/admin');
  }
};

module.exports = {
  dashboard,
  deleteUser,
};