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

module.exports = {
  index,
};