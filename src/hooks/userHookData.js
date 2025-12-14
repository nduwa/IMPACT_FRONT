import axiosInstance from '../utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

const fetchAllUsers = async ({ page = 1, search = '' }) => {
  const limit = 20;
  const response = await axiosInstance.get(
    `/users/allUsers?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
  );
  return response.data;
};

export const useAllUsers = (page, search) => {
  return useQuery({
    queryKey: ['all-users', page, search],
    queryFn: () => fetchAllUsers({ page, search }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
};

export const toggleUserStatus = async (userId, status) => {
  try {
    const response = await axiosInstance.patch(`/users/toggle/${userId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Toggle status error:', error);
    throw error;
  }
};

export const updateUserPassword = async (userId, password) => {
  try {
    const response = await axiosInstance.patch(`/users/updatePassword/${userId}`, { password });
    return response.data;
  } catch (error) {
    console.error('Password update error:', error);
    throw error;
  }
};

