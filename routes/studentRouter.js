const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Handles GET /student
router.get('/', studentController.getDashboard);

// Handles GET /student/rescue
router.get('/rescue', studentController.getRescue);

// Handles POST /student/rescue
router.post('/rescue', studentController.postRescue);

module.exports = router;
