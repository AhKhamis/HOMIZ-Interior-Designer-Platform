const Project = require('../models/project');

const Service = require('../models/service');

const Designer = require('../models/designer');

const cloudinary = require('../config/cloudinary');


// =========================================================
// PROJECTS INDEX
// =========================================================

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


// =========================================================
// SHOW PROJECT
// =========================================================

const show = async (req, res) => {
  try {
    const project = await Project.findById(
      req.params.id
    )
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


// =========================================================
// NEW PROJECT
// =========================================================

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


// =========================================================
// CLOUDINARY UPLOAD
// =========================================================

const uploadImage = (imageBuffer) =>
  new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          allowed_formats: [
            'jpg',
            'jpeg',
            'png',
            'webp',
          ],
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


// =========================================================
// CLOUDINARY DELETE
// =========================================================

const deleteImage = async (publicId) => {
  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId);
};


// =========================================================
// CREATE PROJECT
// =========================================================

const create = async (req, res) => {
  try {

    // Find the Designer belonging to
    // the currently signed-in User

    const designer = await Designer.findOne({
      user: req.session.user._id,
    });

    if (!designer) {
      return res.redirect('/projects/new');
    }


    // IMPORTANT:
    // Project.designer expects Designer._id
    // NOT User._id

    req.body.designer = designer._id;


    // Make services an array

    if (
      req.body.services &&
      !Array.isArray(req.body.services)
    ) {
      req.body.services = [
        req.body.services,
      ];
    }


    // Check images

    if (
      !req.files ||
      req.files.length === 0
    ) {
      return res.redirect('/projects/new');
    }


    // Main image index

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


    // Separate main image

    const mainImageFile =
      req.files[mainImageIndex];


    const galleryFiles = req.files.filter(
      (file, index) =>
        index !== mainImageIndex
    );


    // Upload main image

    const mainImageResult =
      await uploadImage(
        mainImageFile.buffer
      );


    // Upload gallery images

    const galleryResults =
      await Promise.all(
        galleryFiles.map((file) =>
          uploadImage(file.buffer)
        )
      );


    // Save main image

    req.body.mainImage = {
      url: mainImageResult.secure_url,
      publicId: mainImageResult.public_id,
    };


    // Save gallery images

    req.body.galleryImages =
      galleryResults.map((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
      }));


    delete req.body.mainImageIndex;


    // Create project

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


// =========================================================
// EDIT PROJECT
// =========================================================

const edit = async (req, res) => {
  try {

    const designer =
      await Designer.findOne({
        user: req.session.user._id,
      });


    if (!designer) {
      return res.redirect(
        '/projects/dashboard'
      );
    }


    const project =
      await Project.findOne({
        _id: req.params.id,
        designer: designer._id,
      }).populate('services');


    if (!project) {
      return res.redirect(
        '/projects/dashboard'
      );
    }


    const services =
      await Service.find();


    res.render('projects/edit.ejs', {
      project,
      services,
    });

  } catch (err) {
    console.log(err);

    res.redirect('/projects');
  }
};


// =========================================================
// UPDATE PROJECT
// =========================================================

const update = async (req, res) => {
  try {

    const designer =
      await Designer.findOne({
        user: req.session.user._id,
      });


    if (!designer) {
      return res.redirect(
        '/projects/dashboard'
      );
    }


    if (
      req.body.services &&
      !Array.isArray(req.body.services)
    ) {
      req.body.services = [
        req.body.services,
      ];
    }


    const project =
      await Project.findOne({
        _id: req.params.id,
        designer: designer._id,
      });


    if (!project) {
      return res.redirect(
        '/projects/dashboard'
      );
    }


    // =====================================================
    // UPDATE IMAGES
    // =====================================================

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


      // Delete old main image

      if (
        project.mainImage &&
        project.mainImage.publicId
      ) {
        await deleteImage(
          project.mainImage.publicId
        );
      }


      // Delete old gallery images

      if (
        project.galleryImages &&
        project.galleryImages.length > 0
      ) {
        await Promise.all(
          project.galleryImages.map(
            (image) =>
              deleteImage(image.publicId)
          )
        );
      }


      // Separate images

      const mainImageFile =
        req.files[mainImageIndex];


      const galleryFiles =
        req.files.filter(
          (file, index) =>
            index !== mainImageIndex
        );


      // Upload new main image

      const mainImageResult =
        await uploadImage(
          mainImageFile.buffer
        );


      // Upload new gallery images

      const galleryResults =
        await Promise.all(
          galleryFiles.map((file) =>
            uploadImage(file.buffer)
          )
        );


      // Save main image

      project.mainImage = {
        url: mainImageResult.secure_url,
        publicId: mainImageResult.public_id,
      };


      // Save gallery images

      project.galleryImages =
        galleryResults.map((result) => ({
          url: result.secure_url,
          publicId: result.public_id,
        }));
    }


    // =====================================================
    // UPDATE DATA
    // =====================================================

    project.title =
      req.body.title;

    project.description =
      req.body.description;

    project.category =
      req.body.category;

    project.location =
      req.body.location;

    project.services =
      req.body.services || [];


    await project.save();


    res.redirect(
      `/projects/${project._id}`
    );

  } catch (err) {
    console.log(err);

    res.redirect('/projects');
  }
};


// =========================================================
// DELETE PROJECT
// =========================================================

const deleteProject = async (
  req,
  res
) => {
  try {

    const designer =
      await Designer.findOne({
        user: req.session.user._id,
      });


    if (!designer) {
      return res.redirect(
        '/projects/dashboard'
      );
    }


    const project =
      await Project.findOne({
        _id: req.params.id,
        designer: designer._id,
      });


    if (!project) {
      return res.redirect(
        '/projects/dashboard'
      );
    }


    // Delete main image

    if (
      project.mainImage &&
      project.mainImage.publicId
    ) {
      await deleteImage(
        project.mainImage.publicId
      );
    }


    // Delete gallery images

    if (
      project.galleryImages &&
      project.galleryImages.length > 0
    ) {
      await Promise.all(
        project.galleryImages.map(
          (image) =>
            deleteImage(image.publicId)
        )
      );
    }


    // Delete project

    await Project.findByIdAndDelete(
      project._id
    );


    res.redirect(
      '/projects/dashboard'
    );

  } catch (err) {
    console.log(err);

    res.redirect(
      '/projects/dashboard'
    );
  }
};


// =========================================================
// DESIGNER DASHBOARD
// =========================================================

const dashboard = async (
  req,
  res
) => {
  try {

    const designer =
      await Designer.findOne({
        user: req.session.user._id,
      }).populate('user');


    if (!designer) {
      return res.redirect('/');
    }


    const projects =
      await Project.find({
        designer: designer._id,
      });


    res.render(
      'projects/dashboard.ejs',
      {
        projects,
        designer,
      }
    );

  } catch (err) {
    console.log(err);

    res.redirect('/projects');
  }
};


// =========================================================
// EXPORTS
// =========================================================

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