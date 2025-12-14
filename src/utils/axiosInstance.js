import axios from 'axios';
import { useAuthStore } from '../store/authStore'; // ✅ adjust path as needed
import toast from 'react-hot-toast';

// Create Axios instance
const axiosInstance = axios.create({
  //baseURL: 'https://backimpact.farmerimpact.rw/', // ✅ replace with your backend URL
   baseURL: 'http://localhost:5001', // ✅ replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request interceptor: Attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor: Auto logout on invalid token
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message?.toLowerCase() || "";

    if ((status === 401 || status === 400) && message.includes("token")) {
      const logout = useAuthStore.getState().logout;
      logout();
      toast.error("Session expired. Please log in again.");
      window.location.href = "/"; // Or "/login"
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
