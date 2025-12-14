import React from 'react';
import { useAuthStore } from '../../store/authStore';

// Import utilities

function WelocomeBanner() {
const { token, user, logout } = useAuthStore();

  return (
    <div className="flex flex  bg-gradient-to-r from-[#8B593E]/[0.22] to-[#8B593E]/[0.14]dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="p-5">
        <div className="items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">Hello, {user?.userName || 'User'}</div>
          <div className=" font-medium text-green-700 ">{user?.station_name || ''}, {user?.staffRole || 'User'}</div>
        </div>
      </div>
    </div>
  );
}

export default WelocomeBanner;
