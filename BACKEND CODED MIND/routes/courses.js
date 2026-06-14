const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/auth');
const ctrl = require('../controllers/courses');
const { route } = require('./authRoutes');

router.post('/', ctrl.createCourse);
router.get('/', ctrl.listCourses);
router.get('/:id', ctrl.getCourse);
router.put('/:id', ctrl.updateCourse);
router.delete('/:id', ctrl.deleteCourse);
router.get('/all/courses', ctrl.getAllcourses);
router.get('/related/java',ctrl.getJava);
router.get('/related/c',getC_courses);

module.exports = router;
