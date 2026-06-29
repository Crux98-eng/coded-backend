const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/auth');
const ctrl = require('../controllers/modules');
const {authenticate}=require('../middleware/auth')
const verifyFirebaseToken = require('../middleware/adminAuthVerification');


//user level routes
router.get('/',authenticate, ctrl.listModules);
router.get('/:id',authenticate, ctrl.getModule);
router.delete('/:id', authenticate,ctrl.deleteModule);
router.get('/all/java',authenticate,ctrl.getAllJavaModules);
router.get('/all/c', authenticate,ctrl.getAllCPlusPlus);

//admin level routes
router.put('/:id', verifyFirebaseToken,ctrl.updateModule);
router.post('/',verifyFirebaseToken, ctrl.createModule);
module.exports = router;
