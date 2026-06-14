const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/auth');
const ctrl = require('../controllers/modules');

router.post('/', ctrl.createModule);
router.get('/', ctrl.listModules);
router.get('/:id', ctrl.getModule);
router.put('/:id', ctrl.updateModule);
router.delete('/:id', ctrl.deleteModule);
router.get('/all/java',ctrl.getAllJavaModules);
router.get('/all/c', ctrl.getAllCPlusPlus);

module.exports = router;
