const Designer = require('../models/designer');
const User = require('../models/user');
const cloudinary = require('../config/cloudinary');

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

const deleteImage = async (publicId) => {
  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId);
};

const index = async (req, res) => {
  try {
    const designers = await Designer.find().populate('user');

    res.render('designers/index.ejs', {
      designers,
    });
  } catch (err) {
    res.redirect('/');
  }
};

const showProfile = async (req, res) => {
  try {
    const designer = await Designer.findById(req.params.id).populate('user');

    if (!designer) {
      return res.redirect('/designers');
    }

    res.render('designers/profile.ejs', {
      designer,
    });
  } catch (err) {
    res.redirect('/designers');
  }
};

const editProfile = async (req, res) => {
  try {
    const designer = await Designer.findOne({
      user: req.session.user._id,
    }).populate('user');

    if (!designer) {
      return res.redirect('/projects/dashboard');
    }

    res.render('designers/edit.ejs', {
      designer,
    });
  } catch (err) {
    res.redirect('/projects/dashboard');
  }
};

const updateProfile = async (req, res) => {
  try {
    const designer = await Designer.findOne({
      user: req.session.user._id,
    });

    if (!designer) {
      return res.redirect('/projects/dashboard');
    }

    const user = await User.findById(req.session.user._id);

    if (!user) {
      return res.redirect('/projects/dashboard');
    }

    user.name = req.body.name;
    user.username = req.body.username;
    designer.bio = req.body.bio;
    designer.specialization = req.body.specialization;

    if (req.file) {
      if (designer.profileImagePublicId) {
        await deleteImage(designer.profileImagePublicId);
      }

      const imageResult = await uploadImage(req.file.buffer);

      designer.profileImageUrl = imageResult.secure_url;
      designer.profileImagePublicId = imageResult.public_id;
    }

    await user.save();
    await designer.save();

    req.session.user.username = user.username;

    req.session.save(() => {
      res.redirect('/projects/dashboard');
    });
  } catch (err) {
    res.redirect('/projects/dashboard');
  }
};

module.exports = {
  index,
  showProfile,
  editProfile,
  updateProfile,
};