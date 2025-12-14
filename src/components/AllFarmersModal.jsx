import React from 'react';
import Papa from 'papaparse'; // Make sure to install this: npm install papaparse

const AllFarmersModal = ({
  farmers,
  currentPage,
  totalPages,
  limit,
  onPrev,
  onNext,
  onCancel,
}) => {

  const handleExport = () => {
    const csv = Papa.unparse(
      farmers.map((farmer, index) => ({
        '#': (currentPage - 1) * limit + index + 1,
        'Full Name': farmer.fullName,
        Phone: farmer.phone,
        Status: farmer.status,
      }))
    );

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.setAttribute('href', url);
    link.setAttribute('download', `all_farmers_page_${currentPage}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-800">
            All Farmers
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-xl"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="p-4 overflow-x-auto max-h-[70vh] overflow-y-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">#</th>
                <th className="border px-3 py-2">Full Name</th>
                <th className="border px-3 py-2">Phone</th>
                <th className="border px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {farmers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No farmers found.
                  </td>
                </tr>
              ) : (
                farmers.map((farmer, index) => (
                  <tr key={farmer.id} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">
                      {(currentPage - 1) * limit + index + 1}
                    </td>
                    <td className="border px-3 py-2">{farmer.fullName}</td>
                    <td className="border px-3 py-2">{farmer.phone}</td>
                    <td className="border px-3 py-2">{farmer.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t flex justify-between items-center">
          <button
            onClick={onPrev}
            disabled={currentPage === 1}
            className="px-4 py-1 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={onNext}
            disabled={currentPage === totalPages}
            className="px-4 py-1 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <hr className="mb-4 border-t border-gray-300" />

        <div className="flex justify-end gap-3 px-4 pb-4">
          <button
            type="button"
            onClick={handleExport}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllFarmersModal;
