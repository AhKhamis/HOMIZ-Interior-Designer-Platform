const Designer = require('../models/designer');
const Project = require('../models/project');

const dashboard = async (req, res) => {
  try {
    const designers = await Designer.find({
      status: 'pending',
    }).populate('user');

    const projects = await Project.find({
      status: 'pending',
    });

    res.render('admin/dashboard.ejs', {
      designers,
      projects,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

const approveDesigner = async (req, res) => {
  try {
    await Designer.findByIdAndUpdate(req.params.id, {
      status: 'approved',
    });

    res.redirect('/admin');
  } catch (err) {
    console.log(err);
    res.redirect('/admin');
  }
};

const rejectDesigner = async (req, res) => {
  try {
    await Designer.findByIdAndUpdate(req.params.id, {
      status: 'rejected',
    });

    res.redirect('/admin');
  } catch (err) {
    console.log(err);
    res.redirect('/admin');
  }
};

module.exports = {
  dashboard,
  approveDesigner,
  rejectDesigner,
};