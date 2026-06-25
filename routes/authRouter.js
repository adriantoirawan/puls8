const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Make new controller for this
router.get('/', (req, res) => res.render('landing'));

router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/logout', authController.logout);

module.exports = router;
