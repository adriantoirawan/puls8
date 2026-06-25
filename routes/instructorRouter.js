const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');

// Handles GET /instructor
router.get('/', instructorController.getDashboard);

// Handles POST /instructor/resolve/:id (Phase Resolution Protocol)
router.post('/resolve/:id', instructorController.postResolveStudent);

module.exports = router;
