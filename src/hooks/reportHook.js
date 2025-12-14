import axiosInstance from "../utils/axiosInstance";

// Create new activity report
export const addActivityReport = async (newReport) => {
  try {
    const response = await axiosInstance.post("/report/create", newReport);
    return response.data;
  } catch (error) {
    console.error("Error creating activity report:", error);
    throw error?.response?.data || error;
  }
};

// Fetch all activity reports
export const fetchActivityReports = async () => {
  try {
    const response = await axiosInstance.get("/report/activityReport");
    return response.data;
  } catch (error) {
    console.error("Error fetching activity reports:", error);
    throw error?.response?.data || error;
  }
};

// Update existing activity report
export const updateActivityReport = async (id, updatedData) => {
  try {
    const response = await axiosInstance.put(`/report/updateActivityReport/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating activity report:", error);
    throw error?.response?.data || error;
  }
};

// Delete activity report
export const deleteActivityReport = async (id) => {
  try {
    const response = await axiosInstance.delete(`/report/deleteActivityReport/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting activity report:", error);
    throw error?.response?.data || error;
  }
};

export const exportActivityReports = async () => {
  try {
    const response = await axiosInstance.get("/report/export", {
      responseType: "blob", // important for file download
    });

    // Create a download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "activity_reports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error exporting reports:", error);
    throw error?.response?.data || error;
  }
};