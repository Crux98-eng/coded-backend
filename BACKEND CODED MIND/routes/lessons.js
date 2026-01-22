const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/auth');
const ctrl = require('../controllers/lessons');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Creates a Lesson document: uploads video to Cloudinary, then creates Lesson
router.post('/',  upload.single('file'), ctrl.createLesson);
router.get('/', ctrl.listLessons);
router.get('/:id', ctrl.getLesson);
router.put('/:id',  ctrl.updateLesson);
router.delete('/:id',  ctrl.deleteLesson);
router.post('/cloudinary-notify', ctrl.cloudinaryNotify);
module.exports = router;
