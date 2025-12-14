import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Key, Phone, Computer } from 'lucide-react';
import { useAllUsers, toggleUserStatus, updateUserPassword } from '../../hooks/userHookData';
import { assignPhoneAccess, assignWebAccess } from '../../hooks/moduleHook';
import UserPasswordModel from '../../components/UserPasswordModel';
import AssignPhoneAccessModal from '../../components/AssignPhoneAccessModal';
import AssignWebAccessModal from '../../components/AssignWebAccessModal';

function UserLayout() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Modal states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isWebModalOpen, setIsWebModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // ✅ State to track which user toggle is in progress
  const [togglingUserId, setTogglingUserId] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const shouldSearch = debouncedSearch.length === 0 || debouncedSearch.length >= 3;
  const { data, isLoading, isError, error, isFetching, refetch } = useAllUsers(
    page,
    shouldSearch ? debouncedSearch : ''
  );

  const handleToggle = async (userId, currentStatus) => {
    setTogglingUserId(userId);
    const newStatus = currentStatus === 1 ? 0 : 1; // Toggle logic
    try {
      await toggleUserStatus(userId, newStatus);
      toast.success("User status updated!");
      refetch();
    } catch (err) {
      toast.error("Failed to toggle user status");
      console.error('Failed to toggle status:', err);
    } finally {
      setTogglingUserId(null);
    }
  };

  // Open password modal
  const handleSetPassword = (user) => {
    setSelectedUser(user);
    setIsPasswordModalOpen(true);
  };

  const handleSavePassword = async ({ userId, password }) => {
    try {
      await updateUserPassword(userId, password);
      toast.success("Password updated successfully!");
      refetch();
      setIsPasswordModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      toast.error("Failed to update password");
      console.error('Failed to update password:', err);
    }
  };

  const handleAssignPhoneAccess = (user) => {
    setSelectedUser(user);
    setIsPhoneModalOpen(true);
  };

  const handleSavePhoneAccess = async (payload) => {
    try {
      await assignPhoneAccess(payload);
      toast.success("Phone access assigned!");
      refetch();
      setIsPhoneModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error("Failed to assign phone access");
      console.error('Assign phone access error:', error);
    }
  };

  const handleAssignWebAccess = (user) => {
    setSelectedUser(user);
    setIsWebModalOpen(true);
  };

  const handleSaveWebAccess = async (payload) => {
    try {
      const result = await assignWebAccess(payload); // payload must have { userid, moduleid }
      toast.success(result.message || "Web access assigned!");
      refetch();
      setIsWebModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error(result.error || "Assign web access failed");
      console.error('Assign web access error:', error);
    }
  };

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  const userList = Array.isArray(data?.users) ? data.users : [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Users {isFetching && <span className="text-sm">(refreshing...)</span>}
        </h2>
        <input
          type="text"
          placeholder="Search user (min 3 chars)..."
          className="border px-3 py-1 rounded dark:bg-gray-700 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>

      <div className="p-3 overflow-x-auto">
        <table className="table-auto w-full border dark:text-gray-300">
          <thead className="text-xs text-left uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="border px-4 py-2">No</th>
              <th className="border px-4 py-2">Full Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Username</th>
              <th className="border px-4 py-2">Mobile</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="text-md text-left font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
            {userList.map((user, index) => (
              <tr key={user.__kp_User || user.id || index}>
                <td className="border px-4 py-2">{(page - 1) * 20 + index + 1}</td>
                <td className="border px-4 py-2">{user.staff?.Name || user.Name_Full || ''}</td>
                <td className="border px-4 py-2">{user.Email || ''}</td>
                <td className="border px-4 py-2">{user.Name_User || ''}</td>
                <td className="border px-4 py-2">{user.staff?.Phone || ''}</td>
                <td className="border px-4 py-2">{user.staff?.Role || ''}</td>
                <td className="border px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggle(user.__kp_User, user.status)}
                      disabled={togglingUserId === user.__kp_User}
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${user.status === 1 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-800'
                        }`}
                    >
                      {togglingUserId === user.__kp_User ? 'Updating...' : user.status === 1 ? 'On' : 'Off'}
                    </button>

                    {user.status === 1 && (
                      <>
                        <button
                          onClick={() => handleSetPassword(user)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded text-sm"
                          title="Set Password"
                        >
                          <Key size={16} />
                        </button>

                        <button
                          onClick={() => handleAssignPhoneAccess(user)}
                          className="flex items-center gap-1 px-3 py-1 bg-indigo-500 text-white rounded text-sm"
                          title="Assign Phone Access"
                        >
                          <Phone size={16} />
                        </button>

                        <button
                          onClick={() => handleAssignWebAccess(user)}
                          className="flex items-center gap-1 px-3 py-1 bg-indigo-500 text-white rounded text-sm"
                          title="Assign Web Access"
                        >
                          <Computer size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4 gap-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-[#ffb68f] dark:bg-[#ffb68f] dark:text-[#ffffff] rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-800 dark:text-gray-200">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-[#ffb68f] dark:bg-[#ffb68f] dark:text-[#ffffff] rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      <UserPasswordModel
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSave={handleSavePassword}
        user={selectedUser}
      />
      <AssignPhoneAccessModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        onSave={handleSavePhoneAccess}
        user={selectedUser}
      />
      <AssignWebAccessModal
        isOpen={isWebModalOpen}
        onClose={() => setIsWebModalOpen(false)}
        onSave={handleSaveWebAccess}
        user={selectedUser}
      />
    </div>
  );
}

export default UserLayout;
