const Designer = require('../models/designer');

const index = async (req, res) => {
  try {
    const designers = await Designer.find().populate('user');

    res.render('designers/index.ejs', { designers });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

const editProfile = async (req, res) => {
  try {
    const designer = await Designer.findOne({
      user: req.session.user._id,
    }).populate('user');

    res.render('designers/edit.ejs', { designer });
  } catch (err) {
    console.log(err);
    res.redirect('/projects/dashboard');
  }
};

const updateProfile = async (req, res) => {
  try {
    await Designer.findOneAndUpdate(
      {
        user: req.session.user._id,
      },
      req.body,
      { new: true }
    );

    res.redirect('/projects/dashboard');
  } catch (err) {
    console.log(err);
    res.redirect('/projects/dashboard');
  }
};

module.exports = {
  index,
  editProfile,
  updateProfile,
};