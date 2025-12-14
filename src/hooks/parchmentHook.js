import axiosInstance from "../utils/axiosInstance";
//// Parchment Assignment 
export const allTransactions = async () => {
    try {
        const res = await axiosInstance.get("/parchment/allTransactions");

        // FIX: ensure ALWAYS returns array
        const data = res.data?.data || [];

        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error fetching assigned parchments:", error);
        return [];
    }
};

export const AllAssigned = async () => {
    try {
        const res = await axiosInstance.get("/parchment/assigned");

        const data = res.data?.data || res.data || [];

        return data;
    } catch (error) {
        console.error("Error fetching assigned parchments:", error);
        return [];
    }
};

export const allDryings = async () => {
    try {
        const res = await axiosInstance.get("/parchment/alldryings");

        const data = res.data?.data || res.data || [];

        return data;
    } catch (error) {
        console.error("Error fetching drying parchments:", error);
        return [];
    }
};


/// Parhment Transport and deliveries
export const AllDeliveries = async () => {
    try {
        const response = await axiosInstance.get("/parchment/deliveries");
        return response.data; // contains { status, message, data }
    } catch (error) {
        console.error("Error fetching deliveries:", error);

        // Optional: return a formatted error for UI
        return {
            status: "fail",
            message:
                error.response?.data?.message ||
                "Failed to fetch deliveries. Please try again later.",
        };
    }
};
// Fetch delivery details including lots and loaded weights
export const GetDeliveryDetails = async (id) => {
    console.log('delivery ID', id);

    try {
        const response = await axiosInstance.get(`/parchment/deliveries/${id}`);
        if (response.data.status === "success") {
            const data = response.data.data;
            return {
                status: "success",
                data: {
                    ...data,
                    lots: Array.isArray(data.lots) ? data.lots : [],
                    loaded_weights: Array.isArray(data.loaded_weights) ? data.loaded_weights : [],
                },
            };
        } else {
            return { status: "fail", message: response.data.message || "Failed to fetch delivery details" };
        }
    } catch (error) {
        console.error("Error fetching delivery details:", error);
        return { status: "fail", message: error.response?.data?.message || error.message };
    }
};
// get lots to be loaded on delivery
export const AllLotsOfLoading = async () => {
    try {
        const response = await axiosInstance.get("/parchment/loading_lots");
        return response.data; // contains { status, message, data }
    } catch (error) {
        console.error("Error fetching deliveries:", error);

        // Optional: return a formatted error for UI
        return {
            status: "fail",
            message:
                error.response?.data?.message ||
                "Failed to fetch deliveries. Please try again later.",
        };
    }
};
// get lots to be loaded on delivery
export const AllLots = async () => {
    try {
        const response = await axiosInstance.get("/parchment/allLots");
        return response.data; // contains { status, message, data }
    } catch (error) {
        console.error("Error fetching deliveries:", error);

        // Optional: return a formatted error for UI
        return {
            status: "fail",
            message:
                error.response?.data?.message ||
                "Failed to fetch deliveries. Please try again later.",
        };
    }
};
// ✅ Post transport delivery data
export const Post_TransportDelivery = async (payload) => {
    try {
        console.log(payload);

        const response = await axiosInstance.post("/parchment/deliver_parchment", payload);
        return response.data; // contains status and message
    } catch (error) {
        console.error("Error saving delivery:", error);
        return {
            status: "fail",
            message:
                error.response?.data?.message ||
                "Failed to save delivery. Please try again later.",
        };
    }
};
