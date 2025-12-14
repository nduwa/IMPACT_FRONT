import axiosInstance from '../utils/axiosInstance';

export const AccessModules = async () => {
  try {
    const response = await axiosInstance.get('/modules/access-modules');
    return response.data;
  } catch (error) {
    console.error('Error fetching access modules:', error);
    return [];
  }
};

export const assignPhoneAccess = async ({ userId, modules }) => {
  try {
    const response = await axiosInstance.patch(`/modules/assign-phone-access/${userId}`, { modules });
    return response.data;
  } catch (error) {
    console.error('Failed to assign phone access:', error);
    throw error;
  }
};

export const assignWebAccess = async (payload) => {
  try {
    const response = await axiosInstance.post("/modules/assign", payload);
    return response.data;
  } catch (error) {
    console.error("Error assigning web access:", error.response?.data || error.message);
    throw error;
  }
};

export const getAssignedAccess = async (userId) => {
  if (!userId) return []; // safety check

  try {
    const response = await axiosInstance.get(`/modules/assigned-access/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching access modules:', error);
    return [];
  }
};

export const getUserAssignedAccess = async () => {
  try {
    const response = await axiosInstance.get(`/modules/userAssignedmodules`);
    return response.data;
  } catch (error) {
    console.error('Error fetching access modules:', error);
    return [];
  }
};