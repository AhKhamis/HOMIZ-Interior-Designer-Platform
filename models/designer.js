const mongoose = require('mongoose');

const designerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  bio: {
    type: String,
  },

  specialization: {
    type: String,
  },

  profileImageUrl: {
    type: String,
    default: '',
  },

  profileImagePublicId: {
    type: String,
    default: '',
  },
});

const Designer = mongoose.model(
  'Designer',
  designerSchema
);

module.exports = Designer;