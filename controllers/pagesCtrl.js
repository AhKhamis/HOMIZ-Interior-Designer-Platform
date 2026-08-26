const cloudinary = require('../config/cloudinary');
const User = require('../models/user');
const Designer = require('../models/designer');

const home = async (req, res) => {
  let profile = null;

  if (req.session.user) {
    profile = await Designer.findOne({
      user: req.session.user._id,
    }).populate('user');
  }

  res.render('index.ejs', { profile });
};

const uploadImage = (imageBuffer) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result);
      }
    );

    uploadStream.end(imageBuffer);
  });

const uploadProfileImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('Please choose an image.');
  }

  try {
    const designer = await Designer.findOne({
      user: req.session.user._id,
    });

    if (!designer) {
      return res.status(404).send('Designer profile not found.');
    }

    const result = await uploadImage(req.file.buffer);

    designer.profileImageUrl = result.secure_url;
    designer.profileImagePublicId = result.public_id;

    await designer.save();

    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return res.status(500).send('The image could not be uploaded.');
  }
};

module.exports = {
  home,
  uploadProfileImage,
};