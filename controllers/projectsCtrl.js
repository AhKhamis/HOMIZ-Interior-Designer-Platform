const Project = require('../models/project');
const Service = require('../models/service');

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
    const project = await Project.findById(req.params.id).populate('services');
    res.render('projects/show.ejs', { project });
  } catch (err) {
    console.log(err);
    res.redirect('/projects');
  }
};

const newProject = async (req, res) => {
  try {
    const services = await Service.find();
    res.render('projects/new.ejs', { services });
  } catch (err) {
    console.log(err);
    res.redirect('/projects');
  }
};

const create = async (req, res) => {
  try {
    req.body.designer = req.session.user._id;

    if (req.body.services && !Array.isArray(req.body.services)) {
      req.body.services = [req.body.services];
    }

    const project = await Project.create(req.body);

    res.redirect(`/projects/${project._id}`);
  } catch (err) {
    console.log(err);
    res.redirect('/projects');
  }
};

const edit = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('services');
    const services = await Service.find();

    res.render('projects/edit.ejs', { project, services });
  } catch (err) {
    console.log(err);
    res.redirect('/projects');
  }
};

const update = async (req, res) => {
  try {
    if (req.body.services && !Array.isArray(req.body.services)) {
      req.body.services = [req.body.services];
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.redirect(`/projects/${project._id}`);
  } catch (err) {
    console.log(err);
    res.redirect('/projects');
  }
};

const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.redirect('/projects');
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
  edit,
  update,
  deleteProject,

};