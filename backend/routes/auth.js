const express = require('express');
const router = express.Router();
const User = require('../models/User'); 

// POST ROUTE: Register a new user
router.post('/register', async (req, res) => {
  try {
    // 1. Grab the data the user sent us
    const { name, email, password, role } = req.body;

    // 2. Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists!' });
    }

    // 3. Create a new user using your blueprint
    const newUser = new User({  
      name,
      email,
      password, 
      role
    });

    // 4. Save them to the database
    await newUser.save();
    
    res.status(201).json({ message: 'User registered successfully!', user: newUser });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error while registering user' });
  }
});

// POST ROUTE: Login a user
router.post('/login', async (req, res) => {
  try {
    // 1. Grab the email and password the user typed in
    const { email, password } = req.body;

    // 2. Check if a user with this email actually exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    // 3. Check if the password matches 
    // (We are comparing exact text for now. Later we will use encrypted passwords!)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password!' });
    }

    // 4. If everything matches, let them in!
    res.status(200).json({ 
      message: `Welcome back, ${user.name}!`, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error while logging in' });
  }
});

module.exports = router;