require('dotenv').config();
require('./config/database');
const path = require('path');
const express = require('express');
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo').MongoStore;
const methodOverride = require('method-override');
const morgan = require('morgan');
const isSignedIn = require('./middleware/isSignedIn');
const addUserToViews = require('./middleware/addUserToViews');
const authRouter = require('./routes/authRouter');
const pagesRouter = require('./routes/pagesRouter');
const designersRouter = require('./routes/designersRouter');
const adminRouter = require('./routes/adminRouter');
const blogRouter = require('./routes/blogRouter');
const projectsRouter = require('./routes/projectsRouter');
const port = process.env.PORT || '3000';

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

app.use(addUserToViews);

app.use('', pagesRouter);
app.use('/auth', authRouter);
app.use('/designers', designersRouter);
app.use('/admin', adminRouter);
app.use('/blog', blogRouter);
app.use('/projects', projectsRouter);

app.use(isSignedIn);

app.get('/protected', async (req, res) => {
  res.send(`You are logged in as ${req.session.user.username}`);
});

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});