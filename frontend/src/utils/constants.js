// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Common Messages
export const MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Logged in successfully!',
    LOGOUT_SUCCESS: 'Logged out successfully!',
    REGISTER_SUCCESS: 'Account created successfully!',
    PLEASE_LOGIN: 'Please login to continue',
  },
  PROPERTY: {
    ADDED: 'Property listed successfully!',
    APPROVED: 'Property approved!',
    REJECTED: 'Property rejected!',
    FETCH_ERROR: 'Failed to fetch properties',
  },
  ERRORS: {
    GENERIC: 'Something went wrong. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
  },
};

// Property Types
export const PROPERTY_TYPES = ['Flat', 'Room', 'PG', 'House'];

// Cities
export const CITIES = ['Mohali', 'Chandigarh', 'Panchkula'];

// User Roles
export const USER_ROLES = {
  TENANT: 'Tenant',
  ADMIN: 'admin',
};

// Property Status
export const PROPERTY_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};
