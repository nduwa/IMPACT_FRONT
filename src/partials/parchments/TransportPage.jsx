import React, { useEffect, useState, useMemo } from "react";
import { Toaster, toast } from "react-hot-toast";
import { AllDeliveries, GetDeliveryDetails } from "../../hooks/parchmentHook";
import { useNavigate } from "react-router-dom";

function TransportPage() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [deliveryDetails, setDeliveryDetails] = useState(null);
    const navigate = useNavigate(); 

    // ✅ Fetch deliveries
    useEffect(() => {
        const fetchDeliveries = async () => {
            const response = await AllDeliveries();
            if (response.status === "success") {
                setData(response.data);
            } else {
                toast.error(response.message || "Failed to fetch deliveries");
            }
        };
        fetchDeliveries();
    }, []);

    // ✅ Search filter
    const filteredData = useMemo(() => {
        const search = searchTerm.toLowerCase();
        return data.filter((item) =>
            item.deliveryid?.toLowerCase().includes(search) ||
            item.grade?.toLowerCase().includes(search) ||
            item.truck_plate?.toLowerCase().includes(search)
        );
    }, [data, searchTerm]);

    // ✅ Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
    const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
    // ✅ Navigate to new page
    const handleNewReport = () => navigate("/parchment_transport/new_delivery"); 

    // ✅ Open modal and fetch delivery details
    const handleOpenDeliveryModal = async (id) => {
        setSelectedDelivery(id);
        setShowModal(true);
        setDeliveryDetails(null);

        const response = await GetDeliveryDetails(id);
        if (response.status === "success") {
            setDeliveryDetails(response.data);
        } else {
            toast.error(response.message || "Failed to fetch delivery details");
        }
    };

    return (
        <div className="p-4 col-span-full bg-gray-200 dark:bg-gray-800 shadow-xs rounded-xl">
            

            {/* Search & Actions */}
            <div className="flex justify-between items-center mb-4">
                <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    placeholder="Search by Delivery ID, Grade or Truck Plate..."
                    className="px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#8B593E]"
                />
                <button
                    onClick={handleNewReport} 
                    className="px-5 py-2 bg-[#8B593E] text-white rounded-lg shadow hover:bg-[#70452F] transition-colors font-medium"
                >
                    + New Delivery
                </button>
            </div>

            {/* ✅ Table */}
            <div className="overflow-x-auto max-h-[500px] rounded-lg">
                <table className="min-w-full border border-gray-200 text-md">
                    <thead className="bg-gray-100 dark:bg-gray-700 uppercase">
                        <tr>
                            <th className="px-4 py-2 border">#</th>
                            <th className="px-4 py-2 border">Date</th>
                            <th className="px-4 py-2 border">Delivery ID</th>
                            <th className="px-4 py-2 border">Tally sheet</th>
                            <th className="px-4 py-2 border">Grade</th>
                            <th className="px-4 py-2 border">Bags</th>
                            <th className="px-4 py-2 border">Weight</th>
                            <th className="px-4 py-2 border">Truck Plate</th>
                            <th className="px-4 py-2 border">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((item, index) => (
                                <tr
                                    key={item.id || index}
                                    className="text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <td className="px-4 py-2 border">{startIndex + index + 1}</td>
                                    <td className="px-4 py-2 border">
                                        {item.loading_date
                                            ? new Date(item.loading_date).toISOString().split("T")[0]
                                            : "-"}
                                    </td>
                                    <td
                                        className="px-4 py-2 border text-blue-600 cursor-pointer"
                                        onClick={() => handleOpenDeliveryModal(item.id)} // ✅ Use item.id
                                    >
                                        {item.deliveryid}
                                    </td>
                                    <td className="px-4 py-2 border">{item.tally_sheet_no || "-"}</td>
                                    <td className="px-4 py-2 border">{item.grade || "-"}</td>
                                    <td className="px-4 py-2 border">{item.bags || "-"}</td>
                                    <td className="px-4 py-2 border">{item.weight || "-"}</td>
                                    <td className="px-4 py-2 border">{item.truck_plate || "-"}</td>
                                    <td className="px-4 py-2 border">{item.status || "-"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center py-4">
                                    No delivery reports found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-[#8B593E] text-white rounded disabled:opacity-50 hover:bg-[#70452F]"
                >
                    Prev
                </button>
                <span className="text-sm">
                    Page {currentPage} of {totalPages || 1}
                </span>
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1 bg-[#8B593E] text-white rounded disabled:opacity-50 hover:bg-[#70452F]"
                >
                    Next
                </button>
            </div>

            {/* ✅ Delivery Details Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg  shadow-lg">
                        <h2 className="text-xl font-bold mb-4 uppercase text-[#8B593E]">Delivery Details</h2>
                        {deliveryDetails ? (
                            <>
                                <p><strong>Delivery ID:</strong> {deliveryDetails.deliveryid}</p>
                                <p><strong>Date:</strong> {deliveryDetails.loading_date ? new Date(deliveryDetails.loading_date).toISOString().split("T")[0] : "-"}</p>
                                <p><strong>Tally Sheet:</strong> {deliveryDetails.tally_sheet_no || "-"}</p>
                                <p><strong>Grade:</strong> {deliveryDetails.grade || "-"}</p>
                                <p><strong>Bags:</strong> {deliveryDetails.bags || "-"}</p>
                                <p><strong>Weight:</strong> {deliveryDetails.weight || "-"}</p>
                                <p><strong>Truck Plate:</strong> {deliveryDetails.truck_plate || "-"}</p>
                                <p><strong>Status:</strong> {deliveryDetails.status || "-"}</p>

                                <hr className="mt-4" />
                                <div className="mt-4">

                                    <h3 className="font-bold mb-2 uppercase text-[#8B593E] justify-center">Lots</h3>
                                    {deliveryDetails.lots?.length > 0 ? (
                                        <ul className="list-disc list-inside">
                                            {deliveryDetails.lots.map((lot, idx) => (
                                                <li key={idx}>
                                                    Lot: {lot.parch_lot_ID}, Bags: {lot.bags_loaded}, Weight: {lot.weight}
                                                </li>
                                            ))}
                                            <p className="mt-2 font-semibold">
                                                <strong>Total Weight:</strong>{" "}
                                                {deliveryDetails.lots
                                                    .reduce((sum, lot) => sum + (lot.weight || 0), 0)
                                                    .toLocaleString()}{" "}
                                                kg
                                            </p>
                                        </ul>

                                    ) : (
                                        <p>No lots found.</p>
                                    )}
                                </div>

                                <hr className="mt-4" />
                                <div className="mt-4">
                                    <h3 className="font-bold mb-2 uppercase text-[#8B593E]">Loaded Weights</h3>
                                    {deliveryDetails.loaded_weights?.length > 0 ? (
                                        <div>
                                            <p>
                                                <strong>Delivery Report ID:</strong>{" "}
                                                {deliveryDetails.loaded_weights[0]?.rtc_delivery_reports_id || "-"}
                                            </p>
                                            <p className="mt-2 font-semibold">
                                                <strong>Total Weight:</strong>{" "}
                                                {deliveryDetails.loaded_weights
                                                    .reduce((sum, lw) => sum + (lw.weight_loaded || 0), 0)
                                                    .toLocaleString()}{" "}
                                                kg
                                            </p>
                                        </div>
                                    ) : (
                                        <p>No loaded weights found.</p>
                                    )}
                                </div>

                            </>
                        ) : (
                            <p>Loading details...</p>
                        )}
                        <hr className="mt-4" />
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-[#8B593E] text-white rounded hover:bg-[#70452F]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TransportPage;
