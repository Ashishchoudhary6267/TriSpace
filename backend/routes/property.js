const express = require('express');
const router = express.Router();
const Property = require('../models/Property'); // Pulling in the Room blueprint

// POST ROUTE: Add a new PG or Flat
router.post('/add', async (req, res) => {
  try {
    // 1. Take the room details from Postman and build a new property
    const newProperty = new Property(req.body);

    // 2. Save it to the database
    await newProperty.save();
    
    res.status(201).json({ message: 'Property listed successfully!', property: newProperty });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error while adding property' });
  }
});

router.get('/all', async (req, res) => {
  try {
    // This is the secret sauce. Only Approved properties get through!
    const properties = await Property.find({ status: 'Approved' });
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching properties' });
  }
});


// Admin only: Get all pending properties
router.get('/admin/pending', async (req, res) => {
  try {
    const pending = await Property.find({ status: 'Pending' });
    res.json(pending);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Admin only: Approve a property
router.patch('/approve/:id', async (req, res) => {
  try {
    await Property.findByIdAndUpdate(req.params.id, { status: 'Approved' });
    res.json({ message: "Property Approved!" });
  } catch (err) {
    res.status(500).send(err);
  }
});

// 1. GET all properties that are still "Pending"
router.get('/admin/pending', async (req, res) => {
  try {
    const pendingProps = await Property.find({ status: 'Pending' });
    res.json(pendingProps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching pending list" });
  }
});

// 2. PATCH (Update) a property to "Approved"
router.patch('/approve/:id', async (req, res) => {
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
module.exports = router;