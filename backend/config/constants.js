// API Response Messages
const MESSAGES = {
  // Auth Messages
  AUTH: {
    USER_REGISTERED: 'User registered successfully!',
    USER_EXISTS: 'User already exists!',
    LOGIN_SUCCESS: 'Login successful!',
    USER_NOT_FOUND: 'User not found!',
    INVALID_PASSWORD: 'Invalid password!',
    UNAUTHORIZED: 'Unauthorized access!',
    FORBIDDEN: 'Admin access required!',
  },
  
  // Property Messages
  PROPERTY: {
    ADDED_SUCCESS: 'Property listed successfully!',
    APPROVED: 'Property Approved!',
    REJECTED: 'Property Rejected and Removed!',
    NOT_FOUND: 'Property not found!',
    FETCH_SUCCESS: 'Properties fetched successfully!',
  },
  
  // Favorites Messages
  FAVORITES: {
    ADDED: 'Added to favorites!',
    REMOVED: 'Removed from favorites!',
    FETCH_SUCCESS: 'Favorites fetched successfully!',
  },
  
  // Error Messages
  ERRORS: {
    SERVER_ERROR: 'Server error!',
    VALIDATION_ERROR: 'Validation error!',
    DATABASE_ERROR: 'Database error!',
  },
};

// HTTP Status Codes
const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// Property Status
const PROPERTY_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

// User Roles
const USER_ROLES = {
  TENANT: 'Tenant',
  ADMIN: 'admin',
};

module.exports = {
  MESSAGES,
  STATUS_CODES,
  PROPERTY_STATUS,
  USER_ROLES,
};
