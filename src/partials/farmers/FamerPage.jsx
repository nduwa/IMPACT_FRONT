import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  getAllFarmers,
  addFarmer,
  getPendingFarmers,
  getApprovedFarmers,
  approveFarmer,
  deleteFarmer,
  ProccedFarmerData
} from '../../hooks/registerHook';

import FarmerApprovalModal from '../../components/FarmerApprovalModal';
import ApprovedFarmersModal from '../../components/ApprovedFarmersModal';
import AllFarmersModal from '../../components/AllFarmersModal';
import AddFarmerModal from '../../components/AddFarmerModal';

function FarmerPage() {
  const limit = 20;

  const [farmerData, setFarmerData] = useState([]);
  const [approvedFarmers, setApprovedFarmers] = useState([]);
  const [allFarmers, setAllFarmers] = useState([]);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showPendingModal, setShowPendingModal] = useState(false);
  const [showApprovedModal, setShowApprovedModal] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchFarmers = async (page) => {
    setLoading(true);
    try {
      const [pendingRes, approvedRes, allRes] = await Promise.all([
        getPendingFarmers(page, limit),
        getApprovedFarmers(page, limit),
        getAllFarmers(page, limit),
      ]);

      setFarmerData(pendingRes.data || []);
      setApprovedFarmers(approvedRes.data || []);
      setAllFarmers(allRes.data || []);
      setPagination(allRes.pagination || { totalPages: 1 }); // using all farmers pagination
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load farmer data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers(currentPage);
  }, [currentPage]);

  const handleAddFarmer = async (newFarmer) => {
    try {
      const res = await addFarmer(newFarmer);
      toast.success(res.message || 'Farmer added successfully!');
      setShowAddModal(false);
      fetchFarmers(currentPage); // refresh list - assuming fetchFarmers is your fetch method
    } catch (err) {
      toast.error(err.message || 'Error adding farmer');
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await approveFarmer(id);
      toast.success(res.message || 'Farmer approved successfully!');
      fetchFarmers(currentPage);
    } catch (err) {
      toast.error(err.message || 'Approval failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this farmer?')) return;
    try {
      const res = await deleteFarmer(id);
      toast.success(res.message || 'Farmer deleted successfully!');
      fetchFarmers(currentPage);
    } catch (err) {
      toast.error(err.message || 'Delete failed.');
    }
  };

  const handleProceed = async () => {
    try {
      const result = await ProccedFarmerData();

      toast.success(result?.message || "Farmers successfully sent to Farmer model!");
      setShowModal(false);
    } catch (error) {
      console.error("Error sending farmers:", error);
      toast.error(error?.message || "An error occurred while sending farmers");
    }
  };

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, pagination.totalPages));

  return (
    <div className="p-4 col-span-full bg-gray-100 dark:bg-gray-800 shadow rounded-xl">
      <h1 className="text-lg font-semibold mb-4">Farmer Approval Dashboard</h1>

      <div className="flex gap-4 mb-6 flex-wrap">
        {/* adding Farmers Button */}
        <div className="relative inline-block">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add Farmer
          </button>

        </div>

        {/* Pending Farmers Button */}
        <div className="relative inline-block">
          <button
            onClick={() => setShowPendingModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Review Pending Farmers
          </button>
          {farmerData.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {farmerData.length}
            </span>
          )}
        </div>

        {/* Approved Farmers Button */}
        <div className="relative inline-block">
          <button
            onClick={() => setShowApprovedModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            View Approved Farmers
          </button>
          {approvedFarmers.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {approvedFarmers.length}
            </span>
          )}
        </div>

        {/* All Farmers Button */}
        <div className="relative inline-block">
          <button
            onClick={() => setShowAllModal(true)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            View All Farmers
          </button>
          {allFarmers.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {allFarmers.length}
            </span>
          )}
        </div>
      </div>

      {loading && <div className="text-gray-500">Loading farmer data...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {/* Modals */}
      {showAddModal && (
        <AddFarmerModal
          onCancel={() => setShowAddModal(false)}
          onSubmit={handleAddFarmer}
        />
      )}
      {showPendingModal && (
        <FarmerApprovalModal
          farmers={farmerData}
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          limit={limit}
          onApprove={handleApprove}
          onDelete={handleDelete}
          onPrev={handlePrev}
          onNext={handleNext}
          onCancel={() => setShowPendingModal(false)}
        />
      )}

      {showApprovedModal && (
        <ApprovedFarmersModal
          farmers={approvedFarmers}
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          limit={limit}
          onPrev={handlePrev}
          onNext={handleNext}
          onProceed={handleProceed}
          onCancel={() => setShowApprovedModal(false)}
        />
      )}

      {showAllModal && (
        <AllFarmersModal
          farmers={allFarmers}
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          limit={limit}
          onPrev={handlePrev}
          onNext={handleNext}
          onCancel={() => setShowAllModal(false)}
        />
      )}
    </div>
  );
}

export default FarmerPage;
