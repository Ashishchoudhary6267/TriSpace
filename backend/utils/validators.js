/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Min 6 characters
 */
const isValidPassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Validate required fields
 */
const validateRegister = (name, email, password) => {
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('Name is required');
  }

  if (!email || !isValidEmail(email)) {
    errors.push('Valid email is required');
  }

  if (!isValidPassword(password)) {
    errors.push('Password must be at least 6 characters');
  }

  return errors;
};

/**
 * Validate property data
 */
const validateProperty = (propertyData) => {
  const errors = [];

  if (!propertyData.title || propertyData.title.trim() === '') {
    errors.push('Property title is required');
  }

  if (!propertyData.type) {
    errors.push('Property type is required');
  }

  if (!propertyData.monthlyRent || propertyData.monthlyRent <= 0) {
    errors.push('Valid monthly rent is required');
  }

  if (!propertyData.address) {
    errors.push('Address is required');
  }

  return errors;
};

module.exports = {
  isValidEmail,
  isValidPassword,
  validateRegister,
  validateProperty,
};
