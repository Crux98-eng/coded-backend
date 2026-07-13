const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Lessons = require('../models/Lesson');
const { authenticate } = require('../middleware/auth');
const {sendAdminApprovalEmail} = require('../services/mailing');
const {sendUserApprovedEmail} = require('../services/mailing');
const {sendUserEmailBlocking} = require('../services/mailing')
const verifyFirebaseToken = require('../middleware/adminAuthVerification');
const {getUserRole} = require('../utils/get_user_role');
const { sendUserInvoice } = require('../services/mailing');
// Register: After Firebase Auth creates user, backend sets status PENDING
router.post('/register', authenticate, async (req, res) => {
  const { uid, email } = req.user;
  const { username, phone, plan,course_name} = req.body;
  
  const newUser ={
    email:email? email : '',
    name:username ? username: '',
    phone:phone? phone : '',
    plan:plan?plan : "Premium",
    course_name:course_name?course_name :"Java"
  }
try{

  if (!username || !course_name || !phone) {
    return res.status(400).json({ error: 'Name is required.' });
  }

    // Check if user already exists
    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(400).json({ error: 'User already registered' });
    }

    // Create user with PENDING status
    const user = new User({ uid, email, name:username, phone, status: 'PENDING', subscription: plan, course_name:course_name });
    //console.log('Saving user:', user);
    await user.save();
    // console.log('User saved successfully');
     
    res.status(201).json({ message: 'User registered, pending approval', user });
    // send the email to the admin
    sendAdminApprovalEmail(newUser);
    // send the email to the user with the invoice
    sendUserInvoice(email);
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ error: error.message });
  }

  // Send approval email after response
 
  
  
});



// Login: Firebase verifies, backend checks rules
router.post('/login', authenticate, async (req, res) => {
  try {
    const { uid } = req.user;
    const authorization = req.headers.authorization;
    const token = authorization && authorization.split(' ')[1];
    const user = await User.findOne({ uid });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ACTIVE: allow access
   
    // console.log("Token received in login route:", token);
    // const userRole = await getUserRole({ token });
    
    // if(!userRole.success){
    //   return res.status(401).json({ error: 'Invalid token' });
    // }

    res.json({ message: 'Login successful', user, userRole: 'user' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin approve: change status to ACTIVE + subscription
router.post('/approve/:uid', verifyFirebaseToken, async (req, res) => {
  // In production, add admin authentication here
  try {
    const { uid } = req.params;
    const { subscription } = req.body; 

    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.status = 'ACTIVE';
    user.subscription = subscription;
    user.approvedAt = new Date();
    await user.save();

    res.json({ message: 'User approved', user });
    sendUserApprovedEmail(user.email);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//block user
router.post('/block/:uid',verifyFirebaseToken ,async(req, res)=>{
  try {
    const {uid}=req.params;
    const user = await User.findOne({uid});
    if(!user){
      res.status(400).json({error:'user not found'})
      return;
    }
    user.status='BLOCKED';
   await user.save();
    res.json({message:'user blocked successfully', user});
   sendUserEmailBlocking(user.email);
    

  } catch (error) {
    console.log('there was a problem whilst blocking the user  ',error)
    
  }
})
//get all users (for admin dashboard)
router.get('/all-users', verifyFirebaseToken, async (req, res) => {
  try {
    const users = await User.find().lean();
    res.json({ users });
  }catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//get count of active users, total users, and courses (for admin dashboard)
router.get('/count-users_courses',verifyFirebaseToken, async (req, res) => {
  try {
    const activeUsers = await User.countDocuments({ status: 'ACTIVE' });

    const totalUserCount = await User.countDocuments();
    const courseCount = await Course.countDocuments();
    const lessonsCount = await Lessons.countDocuments();
     const count ={ activeUsers, totalUserCount, courseCount ,lessonsCount}
    res.json(count); 

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;  