import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getAllFarmers, approveFarmer, deleteFarmer } from '../../hooks/registerHook';

function ApprovedFamerPage() {
  const limit = 20;
  const [farmerData, setFarmerData] = useState([]);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFarmers = async (page) => {
  setLoading(true);
  try {
    const { data, pagination } = await getAllFarmers(page, limit);

    // Filter farmers with status "new" OR "pending"
    const pendingFarmers = data.filter(farmer =>
      farmer.status === "new" || farmer.status === "pending"
    );

    setFarmerData(pendingFarmers);
    setPagination(pagination || { totalPages: 1 });
    setError('');
  } catch (err) {
    console.error('Fetch farmers error:', err);
    setError('Failed to load farmers.');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchFarmers(currentPage);
  }, [currentPage]);

  const handleApprove = async (id) => {
    try {
      await approveFarmer(id);
      toast.success("Farmer approved successfully!");
      // Refetch current page farmers to update list without resetting page
      fetchFarmers(currentPage);
    } catch (err) {
      console.error('Approve farmer error:', err);
      toast.error(err.message || "Failed to approve farmer.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this farmer?")) return;

    try {
      await deleteFarmer(id);
      toast.success("Farmer deleted successfully!");
      // Refetch farmers after deletion to update the list
      fetchFarmers(currentPage); // Make sure fetchFarmers is accessible here or lift it outside useEffect
    } catch (error) {
      toast.error(error.message || "Failed to delete farmer.");
      console.error("Delete farmer error:", error);
    }
  };

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, pagination.totalPages));

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 col-span-full bg-gray-200 dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">CW Name</th>
              <th className="px-4 py-2 border">Group ID</th>
              <th className="px-4 py-2 border">Farmer Name</th>
              <th className="px-4 py-2 border">Gender</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">National ID</th>
              <th className="px-4 py-2 border">Village</th>
              <th className="px-4 py-2 border">Cell</th>
              <th className="px-4 py-2 border">Sector</th>
              <th className="px-4 py-2 border">Trees</th>
              <th className="px-4 py-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {farmerData.length === 0 ? (
              <tr>
                <td colSpan="12" className="text-center py-4 text-gray-500">No farmers found.</td>
              </tr>
            ) : (
              farmerData.map((farmer, index) => (
                <tr key={farmer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{(currentPage - 1) * limit + index + 1}</td>
                  <td className="px-4 py-2 border">{farmer.CW_Name}</td>
                  <td className="px-4 py-2 border">{farmer.Group_ID}</td>
                  <td className="px-4 py-2 border">{farmer.farmer_name}</td>
                  <td className="px-4 py-2 border">{farmer.Gender}</td>
                  <td className="px-4 py-2 border">{farmer.phone}</td>
                  <td className="px-4 py-2 border">{farmer.National_ID}</td>
                  <td className="px-4 py-2 border">{farmer.village}</td>
                  <td className="px-4 py-2 border">{farmer.cell}</td>
                  <td className="px-4 py-2 border">{farmer.sector}</td>
                  <td className="px-4 py-2 border">{farmer.Trees}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => handleApprove(farmer.id)}
                      className="text-green-600 hover:underline mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDelete(farmer.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400"
        >
          Prev
        </button>
        <span className="text-sm">
          Page {currentPage} of {pagination.totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === pagination.totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ApprovedFamerPage;
