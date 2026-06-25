const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/auth");
const ctrl = require("../controllers/lessons");
const multer = require("multer");
// const Authenticate = require('../middleware/auth')
const upload = multer({ storage: multer.memoryStorage() });
const { checkBlocked } = require("../middleware/checkBlocked");
const {authenticate} = require('../middleware/auth')

// Creates a Lesson document: uploads video to ImageKit, then creates Lesson
router.post("/", authenticate,upload.single("file"), ctrl.createLesson);
router.get("/", authenticate,ctrl.listLessons);
router.get("/:id",authenticate, ctrl.getLesson);
router.put("/:id", authenticate,ctrl.updateLesson);
router.delete("/:id",authenticate, ctrl.deleteLesson);
router.post("/cloudinary-notify",authenticate, ctrl.cloudinaryNotify);
module.exports = router;
