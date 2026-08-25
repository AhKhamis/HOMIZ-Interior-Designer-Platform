const User = require('../models/user');
const Designer = require('../models/designer');
const Project = require('../models/project');

const dashboard = async (req, res) => {
  try {
    const users = await User.find();

    res.render('admin/dashboard.ejs', {
      users,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.redirect('/admin');
    }

    await Designer.findOneAndDelete({
      user: user._id,
    });

    await Project.deleteMany({
      designer: user._id,
    });

    await User.findByIdAndDelete(user._id);

    res.redirect('/admin');
  } catch (err) {
    console.log(err);
    res.redirect('/admin');
  }
};

module.exports = {
  dashboard,
  deleteUser,
};