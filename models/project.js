const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  designer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Designer',
    required: true,
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
  }],
  status: {
  type: String,
  enum: ['pending', 'approved', 'rejected'],
  default: 'pending',
},
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;