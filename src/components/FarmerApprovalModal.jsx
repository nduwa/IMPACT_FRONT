import React from 'react';

const FarmerApprovalModal = ({
  farmers,
  currentPage,
  totalPages,
  onApprove,
  onDelete,
  onCancel,
  onPrev,
  onNext,
  limit,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 overflow-auto"
     style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Pending Farmer Approvals</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-red-500 text-xl">&times;</button>
        </div>

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
                <th className="px-4 py-2 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {farmers.length === 0 ? (
                <tr>
                  <td colSpan="12" className="text-center py-4 text-gray-500">No pending farmers.</td>
                </tr>
              ) : (
                farmers.map((farmer, index) => (
                  <tr key={farmer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{(currentPage - 1) * limit + index + 1}</td>
                    <td className="px-4 py-2 border">{farmer.CW_Name}</td>
                    <td className="px-4 py-2 border">{farmer.Group_ID}</td>
                    <td className="px-4 py-2 border">{farmer.farmer_name}</td>
                    <td className="px-4 py-2 border">{farmer.Gender}</td>
                    <td className="px-4 py-2 border">{farmer.phone}</td>
                    <td className="px-4 py-2 border">{farmer.National_ID}</td>
                    <td className="px-4 py-2 border text-center">
                      <button
                        onClick={() => onApprove(farmer.id)}
                        className="text-green-600 hover:underline mr-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onDelete(farmer.id)}
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

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={onPrev}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400"
          >
            Prev
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={onNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerApprovalModal;
