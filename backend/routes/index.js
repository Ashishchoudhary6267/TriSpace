const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const propertyRoutes = require('./property');

// Mount all routes
router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);

module.exports = router;
