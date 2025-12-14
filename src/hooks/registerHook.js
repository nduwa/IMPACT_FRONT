import axiosInstance from '../utils/axiosInstance';

export const getAllFarmers = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get('/farmers/allFarmers', {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching farmers:', error);
    return { data: [], pagination: null };
  }
};

export const getStationGroups = async () => {
  try {
    const response = await axiosInstance.get("/farmers/station_groups");

    // Make sure to safely return the structure
    return {
      success: response.data.success,
      data: response.data.data || [],
    };
  } catch (error) {
    console.error("Error fetching station groups:", error);

    return {
      success: false,
      data: [],
    };
  }
};
// Post a new farmer
export const addFarmer = async (farmerData) => {
  try {
    const response = await axiosInstance.post("/farmers/create", farmerData);
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const importFarmerData = async (data) => {
  try {
    const response = await axiosInstance.post("/farmers/import", data);
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const getPendingFarmers = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get('/farmers/allPending', {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching pending farmers:', error);
    return { data: [], pagination: null };
  }
};

export const getApprovedFarmers = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get('/farmers/allApproved', {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching approved farmers:', error);
    return { data: [], pagination: null };
  }
};

export const approveFarmer = async (id) => {
  if (!id) throw new Error("Missing farmer ID");

  try {
    const response = await axiosInstance.patch(`/farmers/approveFarmer/${id}`);
    return response.data;
  } catch (error) {
    console.error("Approve error:", error);
    throw error;
  }
};

export const deleteFarmer = async (id) => {
  try {
    const response = await axiosInstance.delete(`/farmers/deleteFarmer/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
};

export const ProccedFarmerData = async () => {
  try {
    const response = await axiosInstance.get("/farmers/farmer_procced");

    return response.data;
  } catch (error) {
    console.error("ProccedFarmerData error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Unexpected error occurred" };
  }
};

export const ImportExcelFarmers = async (rows) => {
  try {
    console.log("Sending farmers data:", rows); // 👀 check payload

    const res = await axiosInstance.post(
      "/farmers/import_farmer",
      { farmers: rows },   // wrap into an object
      { headers: { "Content-Type": "application/json" } }
    );

    return res.data;
  } catch (error) {
    console.error("Import failed:", error.response?.data || error.message);
    throw error;
  }
};


