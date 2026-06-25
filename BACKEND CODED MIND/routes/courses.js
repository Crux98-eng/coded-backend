const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/auth');
const ctrl = require('../controllers/courses');
const { route } = require('./authRoutes');
const {authenticate} = require('../middleware/auth');
const { auth } = require('firebase-admin');

router.post('/',authenticate, ctrl.createCourse);
router.get('/', authenticate,ctrl.listCourses);
router.get('/:id',authenticate, ctrl.getCourse);
router.put('/:id', authenticate,ctrl.updateCourse);
router.delete('/:id',authenticate, ctrl.deleteCourse);
router.get('/all/courses',authenticate, ctrl.getAllcourses);
router.get('/related/java',authenticate,ctrl.getJava);
router.get('/related/c',authenticate,ctrl.getCplusPlus);

module.exports = router;
