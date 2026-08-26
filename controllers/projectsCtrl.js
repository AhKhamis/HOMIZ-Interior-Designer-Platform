const Project = require('../models/project');
const Service = require('../models/service');
const Designer = require('../models/designer');
const cloudinary = require('../config/cloudinary');

const index = async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ _id: -1 })
      .populate({
        path: 'designer',
        populate: {
          path: 'user',
        },
      });

    res.render('projects/index.ejs', {
      projects,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

const show = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('services')
      .populate({
        path: 'designer',
        populate: {
          path: 'user',
        },
      });

    if (!project) {
      return res.redirect('/projects');
    }

    res.render('projects/show.ejs', {
      project,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/projects');
  }
};

const newProject = async (req, res) => {
  try {
    const services = await Service.find();

    res.render('projects/new.ejs', {
      services,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/projects');
  }
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

const deleteImage = async (publicId) => {
  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId);
};

const create = async (req, res) => {
  try {
    const designer = await Designer.findOne({
      user: req.session.user._id,
    });

    if (!designer) {
      return res.redirect('/projects/new');
    }

    req.body.designer = designer._id;

    if (
      req.body.services &&
      !Array.isArray(req.body.services)
    ) {
      req.body.services = [req.body.services];
    }

    if (!req.files || req.files.length === 0) {
      return res.redirect('/projects/new');
    }

    const mainImageIndex = Number(
      req.body.mainImageIndex
    );

    if (
      Number.isNaN(mainImageIndex) ||
      mainImageIndex < 0 ||
      mainImageIndex >= req.files.length
    ) {
      return res.redirect('/projects/new');
    }

    const mainImageFile =
      req.files[mainImageIndex];

    const galleryFiles = req.files.filter(
      (file, index) =>
        index !== mainImageIndex
    );

    const mainImageResult = await uploadImage(
      mainImageFile.buffer
    );

    const galleryResults = await Promise.all(
      galleryFiles.map((file) =>
        uploadImage(file.buffer)
      )
    );

    req.body.mainImage = {
      url: mainImageResult.secure_url,
      publicId: mainImageResult.public_id,
    };

    req.body.galleryImages =
      galleryResults.map((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
      }));

    delete req.body.mainImageIndex;

    const project =
      await Project.create(req.body);

    res.redirect(
      `/projects/${project._id}`
    );
  } catch (err) {
    console.log(err);
    res.redirect('/projects');
  }
};

const edit = async (req, res) => {
  try {
    const designer = await Designer.findOne({
      user: req.session.user._id,
    });

    if (!designer) {
      return res.redirect('/projects/dashboard');
    }

    const project = await Project.findOne({
      _id: req.params.id,
      designer: designer._id,
    }).populate('services');

    if (!project) {
      return res.redirect('/projects/dashboard');
    }

    const services = await Service.find();

    res.render('projects/edit.ejs', {
      project,
      services,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/projects');
  }
};

const update = async (req, res) => {
  try {
    const designer = await Designer.findOne({
      user: req.session.user._id,
    });

    if (!designer) {
      return res.redirect('/projects/dashboard');
    }

    if (
      req.body.services &&
      !Array.isArray(req.body.services)
    ) {
      req.body.services = [req.body.services];
    }

    const project = await Project.findOne({
      _id: req.params.id,
      designer: designer._id,
    });

    if (!project) {
      return res.redirect('/projects/dashboard');
    }

    if (
      req.files &&
      req.files.length > 0
    ) {
      const mainImageIndex = Number(
        req.body.mainImageIndex
      );

      if (
        Number.isNaN(mainImageIndex) ||
        mainImageIndex < 0 ||
        mainImageIndex >= req.files.length
      ) {
        return res.redirect(
          `/projects/${project._id}/edit`
        );
      }

      if (
        project.mainImage &&
        project.mainImage.publicId
      ) {
        await deleteImage(
          project.mainImage.publicId
        );
      }

      if (
        project.galleryImages &&
        project.galleryImages.length > 0
      ) {
        await Promise.all(
          project.galleryImages.map((image) =>
            deleteImage(image.publicId)
          )
        );
      }

      const mainImageFile =
        req.files[mainImageIndex];

      const galleryFiles = req.files.filter(
        (file, index) =>
          index !== mainImageIndex
      );

      const mainImageResult =
        await uploadImage(
          mainImageFile.buffer
        );

      const galleryResults =
        await Promise.all(
          galleryFiles.map((file) =>
            uploadImage(file.buffer)
          )
        );

      project.mainImage = {
        url: mainImageResult.secure_url,
        publicId: mainImageResult.public_id,
      };

      project.galleryImages =
        galleryResults.map((result) => ({
          url: result.secure_url,
          publicId: result.public_id,
        }));
    }

    project.title = req.body.title;
    project.description = req.body.description;
    project.category = req.body.category;
    project.location = req.body.location;
    project.services = req.body.services || [];

    await project.save();

    res.redirect(
      `/projects/${project._id}`
    );
  } catch (err) {
    console.log(err);
    res.redirect('/projects');
  }
};

const deleteProject = async (req, res) => {
  try {
    const designer = await Designer.findOne({
      user: req.session.user._id,
    });

    if (!designer) {
      return res.redirect('/projects/dashboard');
    }

    const project = await Project.findOne({
      _id: req.params.id,
      designer: designer._id,
    });

    if (!project) {
      return res.redirect('/projects/dashboard');
    }

    if (
      project.mainImage &&
      project.mainImage.publicId
    ) {
      await deleteImage(
        project.mainImage.publicId
      );
    }

    if (
      project.galleryImages &&
      project.galleryImages.length > 0
    ) {
      await Promise.all(
        project.galleryImages.map((image) =>
          deleteImage(image.publicId)
        )
      );
    }

    await Project.findByIdAndDelete(
      project._id
    );

    res.redirect('/projects/dashboard');
  } catch (err) {
    console.log(err);
    res.redirect('/projects/dashboard');
  }
};

const dashboard = async (req, res) => {
  try {
    const designer = await Designer.findOne({
      user: req.session.user._id,
    }).populate('user');

    if (!designer) {
      return res.redirect('/');
    }

    const projects = await Project.find({
      designer: designer._id,
    });

    res.render('designers/dashboard.ejs', {
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