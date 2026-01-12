const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/auth');
const ctrl = require('../controllers/courses');

router.post('/', ctrl.createCourse);
router.get('/', ctrl.listCourses);
router.get('/:id', ctrl.getCourse);
router.put('/:id', ctrl.updateCourse);
router.delete('/:id', ctrl.deleteCourse);
router.get('/all/courses', ctrl.getAllcourses);

module.exports = router;
