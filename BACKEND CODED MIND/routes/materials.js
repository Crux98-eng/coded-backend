const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/auth');
const ctrl = require('../controllers/materials');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/',  upload.single('file'), ctrl.createMaterial);
router.get('/', ctrl.listMaterials);
router.get('/:id', ctrl.getMaterial);
router.put('/:id',  ctrl.updateMaterial);
router.delete('/:id',  ctrl.deleteMaterial);

module.exports = router;
