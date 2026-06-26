const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');

// Handles GET /instructor
router.get('/', instructorController.getDashboard);

// Handles POST /instructor/resolve/:id (Phase Resolution Protocol)
router.post('/resolve/:id', instructorController.postResolveStudent);

// Handles POST /instructor/assign/:id
router.post('/assign/:id', instructorController.postAssignStudent);

// Handles GET /instructor/grade/:id
router.get('/grade/:id', instructorController.getGrade);

// Handles POST /instructor/grade/:id
router.post('/grade/:id', instructorController.postGrade);

// Handles GET /instructor/evaluate/:id
router.get('/evaluate/:id', instructorController.getEvaluate);

// Handles POST /instructor/evaluate/:id
router.post('/evaluate/:id', instructorController.postEvaluate);

// Handles GET /instructor/classes/add
router.get('/classes/add', instructorController.getAddClass);

// Handles POST /instructor/classes/add
router.post('/classes/add', instructorController.postAddClass);

// Handles GET /instructor/tasks/add
router.get('/tasks/add', instructorController.getAddTask);

// Handles POST /instructor/tasks/add
router.post('/tasks/add', instructorController.postAddTask);

module.exports = router;
