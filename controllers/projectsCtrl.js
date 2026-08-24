const Project = require('../models/project');
const Service = require('../models/service');
const Designer = require('../models/designer');

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
    const project = await Project.findOne({
      _id: req.params.id,
      designer: req.session.user._id,
    }).populate('services');

    const services = await Service.find();

    if (!project) {
      return res.redirect('/projects/dashboard');
    }

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

    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        designer: req.session.user._id,
      },
      req.body,
      { new: true }
    );

    if (!project) {
      return res.redirect('/projects/dashboard');
    }

    res.redirect(`/projects/${project._id}`);
  } catch (err) {
    console.log(err);
    res.redirect('/projects');
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      designer: req.session.user._id,
    });

    if (!project) {
      return res.redirect('/projects/dashboard');
    }

    res.redirect('/projects/dashboard');
  } catch (err) {
    console.log(err);
    res.redirect('/projects');
  }
};

const dashboard = async (req, res) => {
  try {
    const projects = await Project.find({
      designer: req.session.user._id,
    });

    const designer = await Designer.findOne({
      user: req.session.user._id,
    }).populate('user');

    res.render('projects/dashboard.ejs', {
      projects,
      designer,
    });
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
  dashboard,

};