const Project = require('../models/project');

const index = async (req, res) => {
  try {
    const projects = await Project.find();
    res.render('projects/index.ejs', { projects });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

const show = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.render('projects/show.ejs', { project });
  } catch (err) {
    console.log(err);
    res.redirect('/projects');
  }
};

const newProject = async (req, res) => {
  res.render('projects/new.ejs');
};

const create = async (req, res) => {
  try {
    req.body.designer = req.session.user._id;

    const project = await Project.create(req.body);

    res.redirect(`/projects/${project._id}`);
  } catch (err) {
    console.log(err);
    res.redirect('/projects');
  }
};

module.exports = {
  index,
  show,
  newProject,
  create,

};