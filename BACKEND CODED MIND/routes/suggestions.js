const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/suggestions");
const { authenticate } = require("../middleware/auth");
const verifyFirebaseToken = require("../middleware/adminAuthVerification");

router.post("/", authenticate, ctrl.createSuggestion);
router.get("/", verifyFirebaseToken, ctrl.getSuggestions);

module.exports = router;
