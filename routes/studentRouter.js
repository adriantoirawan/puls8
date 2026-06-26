const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Handles GET /student
router.get('/', studentController.getDashboard);

// Handles GET /student/rescue
router.get('/rescue', studentController.getRescue);

// Handles POST /student/rescue
router.post('/rescue', studentController.postRescue);

// Handles GET /student/profile
router.get('/profile', studentController.getProfile);

// Handles POST /student/profile
router.post('/profile', studentController.postProfile);

module.exports = router;
