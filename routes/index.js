const express = require('express');
const router = express.Router();
const authRouter = require('./authRouter');
const instructorRouter = require('./instructorRouter');
const studentRouter = require('./studentRouter');

// Auth routes (Landing, Login, Register)
router.use('/', authRouter);

// Global Authentication Middleware
router.use((req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login?error=Please+login+first');
  }
  next();
});

// Routers for instructor links
router.use('/instructor', instructorRouter);

// Routers for student links
router.use('/student', studentRouter);

// Router for master view, don't forget to turn this off when demoing
router.get('/master', (req, res) => res.render('master'));

module.exports = router;
