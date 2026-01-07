const express = require('express');
const router = express.Router();
const User = require('../models/User');

console.log("userRoutes.js file loaded");

router.get('/un_approved_users',async(req, res)=>{
    try{
        const unApprovedUsers = await User.find({status:'PENDING'});
        res.json({users:unApprovedUsers});  
         
    }catch(error){
        throw error.message;
        console.log(error);
    }

})
module.exports = router;

