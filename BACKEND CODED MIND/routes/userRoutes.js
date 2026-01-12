const express = require('express');
const router = express.Router();
const User = require('../models/User');

console.log("userRoutes.js file loaded");

router.get('/un_approved_users',async(req, res)=>{
    try{
        const unApprovedUsers = await User.find({status:'PENDING'});
        res.json({users:unApprovedUsers});  
         
    }catch(error){
         console.error("Error fetching unapproved users:", error);
         res.status(500).json({error:error.message});
        console.log(error);
    }

})

router.get('/all_users',async(req, res)=>{
    try{
        const allUsersCount = await User.countDocuments({ status: 'ACTIVE' });
        res.json({users:allUsersCount}); 
    }catch(error){
        console.error("Error fetching all users:", error);
        res.status(500).json({error:error.message});    
    }           
})
    

module.exports = router;

