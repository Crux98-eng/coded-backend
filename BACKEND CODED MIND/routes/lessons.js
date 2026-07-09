const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/auth");
const ctrl = require("../controllers/lessons");
const multer = require("multer");
// const Authenticate = require('../middleware/auth')
const upload = multer({ storage: multer.memoryStorage() });
const { checkBlocked } = require("../middleware/checkBlocked");
const {authenticate} = require('../middleware/auth')
const verifyFirebaseToken  = require('../middleware/adminAuthVerification');

// Creates a Lesson document: uploads video to ImageKit, then creates Lesson
//admin level routes
router.post("/", verifyFirebaseToken, upload.single("file"), ctrl.createLesson);
router.put("/:id", verifyFirebaseToken,ctrl.updateLesson);
router.delete("/:id",verifyFirebaseToken, ctrl.deleteLesson);
router.post("/cloudinary-notify",verifyFirebaseToken, ctrl.cloudinaryNotify);

//user level  access
router.get("/", authenticate,ctrl.listLessons);
router.get("/:id",authenticate, ctrl.getLesson);
router.post("/:id/rate", authenticate, ctrl.rateLesson);
module.exports = router;



