import axiosInstance from '../utils/axiosInstance';

export const getDeliveryReports = async () => {
  try {
    const response = await axiosInstance.get('/parchment/processing');

    if (response?.data?.success) {
      return response.data.data; // returns { reports: [...], processed: [...] }
    }

    console.error('Unexpected response format:', response.data);
    return { reports: [], processed: [] };
  } catch (error) {
    console.error('Error fetching delivery reports:', error);
    return { reports: [], processed: [] };
  }
};


export const DeliveryProcessing = async (id) => {
  if (!id) {
    throw new Error("Missing delivery ID");
  }

  try {
    const response = await axiosInstance.post(`/parchment/process_delivery/${id}`);
    
    if (response.data?.success === false) {
      throw new Error(response.data.message || "Unknown server error");
    }

    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Unknown error";
    console.error("Error processing delivery:", message);
    throw new Error(message);
  }
};


export const submitDeliveryReport = async (id) => {
  if (!id) {
    throw new Error("Missing delivery ID");
  }

  try {
    const response = await axiosInstance.post(`/parchment/post_delivery/${id}`);
    if (response.data?.success === false) {
      throw new Error(response.data.message || "Unknown server error");
    }
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Unknown error submitting delivery";
    console.error("Error submitting delivery:", message);
    throw new Error(message);
  }
};