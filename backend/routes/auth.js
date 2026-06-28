const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// POST ROUTE: Register a new user
router.post('/register', register);

// POST ROUTE: Login a user
router.post('/login', login);

module.exports = router;