const Property = require('../models/Property');
const User = require('../models/User');
const { MESSAGES, STATUS_CODES, PROPERTY_STATUS } = require('../config/constants');

/**
 * Add a new property
 * POST /api/properties/add
 * Requires: Authentication
 */
const addProperty = async (req, res) => {
  try {
    const newProperty = new Property({
      ...req.body,
      owner: req.user.id,
    });

    await newProperty.save();

    res.status(STATUS_CODES.CREATED).json({
      message: MESSAGES.PROPERTY.ADDED_SUCCESS,
      property: newProperty,
    });
  } catch (error) {
    console.error('Add property error:', error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      message: MESSAGES.ERRORS.SERVER_ERROR,
    });
  }
};

/**
 * Get all approved properties
 * GET /api/properties/all
 * Public endpoint
 */
const getAllApprovedProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      status: PROPERTY_STATUS.APPROVED,
    }).populate('owner', 'name email phone');

    res.status(STATUS_CODES.SUCCESS).json(properties);
  } catch (error) {
    console.error('Fetch properties error:', error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      message: MESSAGES.ERRORS.SERVER_ERROR,
    });
  }
};

/**
 * Get all pending properties (Admin only)
 * GET /api/properties/admin/pending
 * Requires: Authentication + Admin role
 */
const getPendingProperties = async (req, res) => {
  try {
    const pendingProps = await Property.find({
      status: PROPERTY_STATUS.PENDING,
    }).populate('owner', 'name email phone');

    res.status(STATUS_CODES.SUCCESS).json(pendingProps);
  } catch (error) {
    console.error('Fetch pending properties error:', error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      message: MESSAGES.ERRORS.SERVER_ERROR,
    });
  }
};

/**
 * Approve a property (Admin only)
 * PATCH /api/properties/approve/:id
 * Requires: Authentication + Admin role
 */
const approveProperty = async (req, res) => {
  try {
    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      { status: PROPERTY_STATUS.APPROVED },
      { new: true }
    );

    if (!updated) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: MESSAGES.PROPERTY.NOT_FOUND,
      });
    }

    res.status(STATUS_CODES.SUCCESS).json({
      message: MESSAGES.PROPERTY.APPROVED,
      property: updated,
    });
  } catch (error) {
    console.error('Approve property error:', error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      message: MESSAGES.ERRORS.SERVER_ERROR,
    });
  }
};

/**
 * Reject a property (Admin only)
 * DELETE /api/properties/reject/:id
 * Requires: Authentication + Admin role
 */
const rejectProperty = async (req, res) => {
  try {
    const deleted = await Property.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: MESSAGES.PROPERTY.NOT_FOUND,
      });
    }

    res.status(STATUS_CODES.SUCCESS).json({
      message: MESSAGES.PROPERTY.REJECTED,
    });
  } catch (error) {
    console.error('Reject property error:', error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      message: MESSAGES.ERRORS.SERVER_ERROR,
    });
  }
};

/**
 * Toggle favorite status of a property
 * POST /api/properties/favorite/:id
 * Requires: Authentication
 */
const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const propertyId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: MESSAGES.AUTH.USER_NOT_FOUND,
      });
    }

    const favIndex = user.favorites.indexOf(propertyId);
    let isFavorited = false;

    if (favIndex > -1) {
      user.favorites.splice(favIndex, 1);
    } else {
      user.favorites.push(propertyId);
      isFavorited = true;
    }

    await user.save();

    res.status(STATUS_CODES.SUCCESS).json({
      message: isFavorited
        ? MESSAGES.FAVORITES.ADDED
        : MESSAGES.FAVORITES.REMOVED,
      isFavorited,
      favorites: user.favorites,
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      message: MESSAGES.ERRORS.SERVER_ERROR,
    });
  }
};

/**
 * Get user's favorite properties
 * GET /api/properties/favorites
 * Requires: Authentication
 */
const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate({
      path: 'favorites',
      populate: { path: 'owner', select: 'name email phone' },
    });

    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: MESSAGES.AUTH.USER_NOT_FOUND,
      });
    }

    res.status(STATUS_CODES.SUCCESS).json(user.favorites);
  } catch (error) {
    console.error('Fetch favorites error:', error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      message: MESSAGES.ERRORS.SERVER_ERROR,
    });
  }
};

/**
 * Get all approved properties (Admin only)
 * GET /api/properties/admin/approved
 * Requires: Authentication + Admin role
 */
const getApprovedProperties = async (req, res) => {
  try {
    const approvedProps = await Property.find({
      status: PROPERTY_STATUS.APPROVED,
    }).populate('owner', 'name email phone');

    res.status(STATUS_CODES.SUCCESS).json(approvedProps);
  } catch (error) {
    console.error('Fetch approved properties error:', error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      message: MESSAGES.ERRORS.SERVER_ERROR,
    });
  }
};

/**
 * Delete an approved property (Admin only)
 * DELETE /api/properties/delete/:id
 * Requires: Authentication + Admin role
 */
const deleteApprovedProperty = async (req, res) => {
  try {
    const deleted = await Property.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: MESSAGES.PROPERTY.NOT_FOUND,
      });
    }

    res.status(STATUS_CODES.SUCCESS).json({
      message: 'Property deleted successfully!',
    });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      message: MESSAGES.ERRORS.SERVER_ERROR,
    });
  }
};

module.exports = {
  addProperty,
  getAllApprovedProperties,
  getPendingProperties,
  approveProperty,
  rejectProperty,
  toggleFavorite,
  getFavorites,
  getApprovedProperties,
  deleteApprovedProperty,
};
