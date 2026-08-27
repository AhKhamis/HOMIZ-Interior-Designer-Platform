const Blog = require('../models/blog');
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
    const blogs = await Blog.find();

    res.render('blog/index.ejs', {
      blogs,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

const show = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.redirect('/blog');
    }

    res.render('blog/show.ejs', {
      blog,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/blog');
  }
};

const newBlog = async (req, res) => {
  res.render('blog/new.ejs');
};

const create = async (req, res) => {
  try {
    let imageUrl = '';
    let imagePublicId = '';

    if (req.file) {
      const imageResult = await uploadImage(
        req.file.buffer
      );

      imageUrl = imageResult.secure_url;
      imagePublicId = imageResult.public_id;
    }

    await Blog.create({
      title: req.body.title,
      content: req.body.content,
      image: imageUrl,
      imagePublicId,
    });

    res.redirect('/blog');
  } catch (err) {
    console.log(err);
    res.redirect('/blog');
  }
};

const edit = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.redirect('/blog');
    }

    res.render('blog/edit.ejs', {
      blog,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/blog');
  }
};

const update = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.redirect('/blog');
    }

    blog.title = req.body.title;
    blog.content = req.body.content;

    if (req.file) {
      if (blog.imagePublicId) {
        await deleteImage(blog.imagePublicId);
      }

      const imageResult = await uploadImage(
        req.file.buffer
      );

      blog.image = imageResult.secure_url;
      blog.imagePublicId = imageResult.public_id;
    }

    await blog.save();

    res.redirect(`/blog/${blog._id}`);
  } catch (err) {
    console.log(err);
    res.redirect('/blog');
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.redirect('/blog');
    }

    if (blog.imagePublicId) {
      await deleteImage(blog.imagePublicId);
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.redirect('/blog');
  } catch (err) {
    console.log(err);
    res.redirect('/blog');
  }
};

module.exports = {
  index,
  show,
  newBlog,
  create,
  edit,
  update,
  deleteBlog,
};