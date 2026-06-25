const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/auth');
const ctrl = require('../controllers/modules');
const {authenticate}=require('../middleware/auth')

router.post('/',authenticate, ctrl.createModule);
router.get('/',authenticate, ctrl.listModules);
router.get('/:id',authenticate, ctrl.getModule);
router.put('/:id', authenticate,ctrl.updateModule);
router.delete('/:id', authenticate,ctrl.deleteModule);
router.get('/all/java',authenticate,ctrl.getAllJavaModules);
router.get('/all/c', authenticate,ctrl.getAllCPlusPlus);

module.exports = router;
