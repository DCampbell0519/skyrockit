const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

const authController = require('./controllers/auth.js');
const applicationController = require('./controllers/applicationController.js');

const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passUserToView);

// Protected Routes
// any routes under here are protected and user 
// must be signed in to access them
/*
Action	Route	HTTP Verb
Index	'/users/:userId/applications'	GET
New	'/users/:userId/applications/new'	GET
Create	'/users/:userId/applications'	POST
Show	'/users/:userId/applications/:applicationId'	GET
Edit	'/users/:userId/applications/:applicationId/edit'	GET
Update	'/users/:userId/applications/:applicationId'	PUT
Delete	'/users/:userId/applications/:applicationId'	DELETE
*/




app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect(`/users/${req.session.user._id}/applications`)
  } else {
    res.render('index.ejs');
  }
});

app.use('/auth', authController);
app.use(isSignedIn);
app.use('/users/:userId/applications', applicationController);

app.listen(port, () => {
  console.log(`Welcome to the Thunderdome!`);
});
