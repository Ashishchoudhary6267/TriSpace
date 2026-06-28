import { apiFetch, getAuthHeader } from './client';

/**
 * Add a new property
 */
export const addProperty = async (propertyData) => {
  return apiFetch('/properties/add', {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(propertyData),
  });
};

/**
 * Get all approved properties
 */
export const getAllProperties = async () => {
  return apiFetch('/properties/all');
};

/**
 * Get all pending properties (Admin only)
 */
export const getPendingProperties = async () => {
  return apiFetch('/properties/admin/pending', {
    headers: getAuthHeader(),
  });
};

/**
 * Approve a property (Admin only)
 */
export const approveProperty = async (propertyId) => {
  return apiFetch(`/properties/approve/${propertyId}`, {
    method: 'PATCH',
    headers: getAuthHeader(),
  });
};

/**
 * Reject a property (Admin only)
 */
export const rejectProperty = async (propertyId) => {
  return apiFetch(`/properties/reject/${propertyId}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
};

/**
 * Toggle property favorite status
 */
export const togglePropertyFavorite = async (propertyId) => {
  return apiFetch(`/properties/favorite/${propertyId}`, {
    method: 'POST',
    headers: getAuthHeader(),
  });
};

/**
 * Get user's favorite properties
 */
export const getFavoriteProperties = async () => {
  return apiFetch('/properties/favorites', {
    headers: getAuthHeader(),
  });
};
