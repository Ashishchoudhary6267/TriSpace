const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  addProperty,
  getAllApprovedProperties,
  getPendingProperties,
  approveProperty,
  rejectProperty,
  toggleFavorite,
  getFavorites,
  getApprovedProperties,
  deleteApprovedProperty,
} = require('../controllers/propertyController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Setup file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/properties';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const types = /jpeg|jpg|png|gif/;
    const extname = types.test(path.extname(file.originalname).toLowerCase());
    const mimetype = types.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only images allowed'));
  }
});

// POST ROUTE: Add a new property (Requires authentication)
router.post('/add', authenticateToken, addProperty);

// PUBLIC: Get all approved properties
router.get('/all', getAllApprovedProperties);

// ADMIN: Get all pending properties (Requires Admin)
router.get('/admin/pending', authenticateToken, requireAdmin, getPendingProperties);

// ADMIN: Get all approved properties (Requires Admin)
router.get('/admin/approved', authenticateToken, requireAdmin, getApprovedProperties);

// ADMIN: Approve a property (Requires Admin)
router.patch('/approve/:id', authenticateToken, requireAdmin, approveProperty);

// ADMIN: Reject a property (Requires Admin)
router.delete('/reject/:id', authenticateToken, requireAdmin, rejectProperty);

// ADMIN: Delete an approved property (Requires Admin)
router.delete('/delete/:id', authenticateToken, requireAdmin, deleteApprovedProperty);

// USER: Toggle favorite status (Requires authentication)
router.post('/favorite/:id', authenticateToken, toggleFavorite);

// USER: Get user's favorite properties (Requires authentication)
router.get('/favorites', authenticateToken, getFavorites);

// UPLOAD: Upload multiple property images
router.post('/upload', authenticateToken, upload.any(), (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files uploaded' });
  const imageUrls = req.files.map(file => `/uploads/properties/${file.filename}`);
  res.json({ imageUrls });
});

module.exports = router;