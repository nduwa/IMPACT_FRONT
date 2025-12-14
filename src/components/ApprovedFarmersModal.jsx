import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import ImportExcelFarmersModal from './ImportExcelFarmersModal';
import { ImportExcelFarmers } from '../hooks/registerHook';

const ApprovedFarmersModal = ({
    farmers,
    currentPage,
    totalPages,
    limit,
    onCancel,
    onPrev,
    onNext,
    onProceed, // Async function to fetch/process farmers
}) => {
    const [loading, setLoading] = useState(false);
    const [showImportExcelFarmerModal, setShowImportExcelFarmerModal] = useState(false);

    const handleProceedClick = async () => {
        setLoading(true);
        try {
            const result = await onProceed();
            toast.success(result?.message || 'Farmers successfully processed!');
            onCancel(); // close modal after success
        } catch (error) {
            console.error('Error proceeding farmers:', error);
            toast.error(error?.message || 'An error occurred while processing farmers');
        } finally {
            setLoading(false);
        }
    };

    const handleFarmerExcellData = async (data) => {
        try {
            const res = await ImportExcelFarmers(data);  
            toast.success(res.message || "Farmers imported successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to import Excel farmers");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Approved Farmers</h2>
                    <button onClick={onCancel} className="text-gray-500 hover:text-red-500 text-xl">&times;</button>
                </div>
                <hr className="mb-4 border-t border-gray-300" />
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
                            </tr>
                        </thead>
                        <tbody>
                            {farmers.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-gray-500">
                                        No approved farmers.
                                    </td>
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
                <hr className="mb-4 border-t border-gray-300" />

                <div className="flex justify-end gap-3 px-4 pb-4">
                    <button
                        type="button"
                        onClick={handleProceedClick}
                        disabled={farmers.length === 0 || loading}
                        className={`px-4 py-2 rounded text-white ${farmers.length === 0 || loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                    >
                        {loading ? 'Processing...' : 'Proceed'}
                    </button>

                    <button onClick={() => setShowImportExcelFarmerModal(true)} className="px-4 py-2 bg-[#8B593E] text-white rounded hover:bg-[#744832]">Import Excel Farmer</button>

                    <ImportExcelFarmersModal
                        show={showImportExcelFarmerModal}
                        onClose={() => setShowImportExcelFarmerModal(false)}
                        onDataParsed={handleFarmerExcellData}
                    />
                </div>
            </div>
        </div>
    );
};

export default ApprovedFarmersModal;
