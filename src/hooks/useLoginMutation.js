import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance'; // use axiosInstance instead of raw axios
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async ({ username, password }) => {
      const response = await axiosInstance.post('/users/login', { username, password });
      return response.data;
    },
    onSuccess: (data) => {
      // Set token and user using zustand
      setAuth({ token: data.token, user: data.user });

      toast.success(`Welcome, ${data.user.userName || data.user.name || 'User'}!`);
      navigate('/dashboard');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    },
  });
};
