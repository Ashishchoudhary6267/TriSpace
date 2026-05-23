const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

    // 3. Hash the password (10 rounds of salting)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create a new user using your blueprint
    const newUser = new User({  
      name,
      email,
      password: hashedPassword, 
      role
    });

    // 5. Save them to the database
    await newUser.save();
    
    // 6. Sign JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({ 
      message: 'User registered successfully!', 
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

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

    // 3. Compare the plain text password with the hashed password in database
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid password!' });
    }

    // 4. If everything matches, sign a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ 
      message: `Welcome back, ${user.name}!`, 
      token,
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