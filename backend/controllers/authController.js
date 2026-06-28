const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { MESSAGES, STATUS_CODES } = require('../config/constants');

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: MESSAGES.AUTH.USER_EXISTS,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(STATUS_CODES.CREATED).json({
      message: MESSAGES.AUTH.USER_REGISTERED,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      message: MESSAGES.ERRORS.SERVER_ERROR,
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: MESSAGES.AUTH.USER_NOT_FOUND,
      });
    }

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        message: MESSAGES.AUTH.INVALID_PASSWORD,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(STATUS_CODES.SUCCESS).json({
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      message: MESSAGES.ERRORS.SERVER_ERROR,
    });
  }
};

module.exports = {
  register,
  login,
};
