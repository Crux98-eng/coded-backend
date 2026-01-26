const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
const {sendAdminApprovalEmail} = require('../services/mailing');
const {sendUserApprovedEmail} = require('../services/mailing');

// Register: After Firebase Auth creates user, backend sets status PENDING
router.post('/register', authenticate, async (req, res) => {
  const { uid, email } = req.user;
  const { username, phone, plan} = req.body;
  
  const newUser ={
    email:email? email : '',
    name:username ? username: '',
    phone:phone? phone : '',
    plan:plan?plan : "Premium"
  }
try{

  if (!username) {
    return res.status(400).json({ error: 'Name is required.' });
  }

    // Check if user already exists
    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(400).json({ error: 'User already registered' });
    }

    // Create user with PENDING status
    const user = new User({ uid, email, name:username, phone, status: 'PENDING', subscription: plan });
    //console.log('Saving user:', user);
    await user.save();
    console.log('User saved successfully');
     
    res.status(201).json({ message: 'User registered, pending approval', user });
    sendAdminApprovalEmail(newUser);
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

    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ACTIVE: allow access
    res.json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin approve: change status to ACTIVE + subscription
router.post('/approve/:uid', async (req, res) => {
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

module.exports = router;