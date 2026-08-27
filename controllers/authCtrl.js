const bcrypt = require('bcrypt');
const User = require('../models/user');
const Designer = require('../models/designer');
const cloudinary = require('../config/cloudinary');

const SALT_ROUNDS = 10;

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

const signup = async (req, res) => {
  res.render('auth/sign-up.ejs');
};

const register = async (req, res) => {
  try {
    if (!req.body) {
      return res.send('No form data received');
    }

    const userInDatabase = await User.findOne({
      username: req.body.username,
    });

    if (userInDatabase) {
      return res.send('Username already exists');
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.send('Passwords do not match');
    }

    if (!req.file) {
      return res.send('Please choose a profile image');
    }

    const hashedPassword = bcrypt.hashSync(
      req.body.password,
      SALT_ROUNDS
    );

    const user = await User.create({
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
      role: 'designer',
    });

    const imageResult = await uploadImage(req.file.buffer);

    await Designer.create({
      user: user._id,
      bio: req.body.bio || '',
      specialization: req.body.specialization || '',
      profileImageUrl: imageResult.secure_url,
      profileImagePublicId: imageResult.public_id,
    });

    req.session.user = {
      username: user.username,
      _id: user._id,
      role: user.role,
    };

    req.session.save(() => {
      res.redirect('/');
    });
  } catch (err) {
    res.send('Something went wrong');
  }
};

const signin = async (req, res) => {
  res.render('auth/sign-in.ejs');
};

const login = async (req, res) => {
  const userInDatabase = await User.findOne({
    username: req.body.username,
  });

  if (!userInDatabase) {
    return res.send('Invalid credentials');
  }

  if (
    !bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    )
  ) {
    return res.send('Invalid credentials');
  }

  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id,
    role: userInDatabase.role,
  };

  req.session.save(() => {
    res.redirect('/');
  });
};

const signout = async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

module.exports = {
  signup,
  register,
  signin,
  login,
  signout,
};