const express = require('express');
const router = express.Router();
const Property = require('../models/Property'); // Pulling in the Room blueprint
const User = require('../models/User'); // Pulling in the User blueprint
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// POST ROUTE: Add a new PG or Flat (Requires logged in user)
router.post('/add', authenticateToken, async (req, res) => {
  try {
    // 1. Take the room details and build a new property
    const newProperty = new Property(req.body);

    // 2. Save it to the database (status defaults to 'Pending')
    await newProperty.save();
    
    res.status(201).json({ message: 'Property listed successfully!', property: newProperty });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error while adding property' });
  }
});

// PUBLIC: Get all approved properties only
router.get('/all', async (req, res) => {
  try {
    // Only Approved properties get through to the public!
    const properties = await Property.find({ status: 'Approved' }).populate('owner', 'name email phone');
    res.status(200).json(properties);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching properties' });
  }
});

// ADMIN: Get all pending properties for moderation (Requires Admin)
router.get('/admin/pending', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const pendingProps = await Property.find({ status: 'Pending' }).populate('owner', 'name email phone'); 
    res.json(pendingProps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching pending list" });
  }
});

// ADMIN: Approve a property (PATCH, Requires Admin)
router.patch('/approve/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const updated = await Property.findByIdAndUpdate(
      req.params.id, 
      { status: 'Approved' }, 
      { new: true }
    );
    res.json({ message: "Property Approved!", property: updated });
  } catch (err) {
    res.status(500).json({ message: "Approval failed" });
  }
});

// ADMIN: Reject a property (DELETE, Requires Admin)
router.delete('/reject/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "Property Rejected and Removed!" });
  } catch (err) {
    res.status(500).json({ message: "Rejection failed" });
  }
});

// USER: Toggle favorite status of a property (Requires authentication)
router.post('/favorite/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const propertyId = req.params.id;

    // Find the user document
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Check if the property is already in the favorites array
    const favIndex = user.favorites.indexOf(propertyId);

    let isFavorited = false;
    if (favIndex > -1) {
      // If it exists, pull/remove it
      user.favorites.splice(favIndex, 1);
    } else {
      // If not, push/add it
      user.favorites.push(propertyId);
      isFavorited = true;
    }

    await user.save();
    res.status(200).json({ 
      message: isFavorited ? "Added to favorites!" : "Removed from favorites!", 
      isFavorited,
      favorites: user.favorites 
    });

  } catch (error) {
    console.error("Toggle favorite failed:", error);
    res.status(500).json({ message: "Server error while toggling favorite" });
  }
});

// USER: Get logged-in user's populated favorites list (Requires authentication)
router.get('/favorites', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate({
      path: 'favorites',
      populate: { path: 'owner', select: 'name email phone' }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json(user.favorites);

  } catch (error) {
    console.error("Fetch favorites failed:", error);
    res.status(500).json({ message: "Server error while fetching favorites" });
  }
});

module.exports = router;