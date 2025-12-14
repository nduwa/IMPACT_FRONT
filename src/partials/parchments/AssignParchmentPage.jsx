import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AllAssigned } from "../../hooks/parchmentHook";

function AssignParchmentPage() {
  const [assigned, setAssigned] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [showModal, setShowModal] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const navigate = useNavigate(); 

  // ==========================
  // LOAD DATA  ✔ FIXED
  // ==========================
  useEffect(() => {
    const loadAssigned = async () => {
      try {
        const res = await AllAssigned();
        const list = res?.data || res || [];
        setAssigned(list);
      } catch (err) {
        console.log("Failed to load assigned parchments");
      }
    };
    loadAssigned();
  }, []);

  // FILTER
  const filteredData = assigned.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.parchment_id?.toLowerCase().includes(term) ||
      item.cherry_lot_id?.toLowerCase().includes(term) ||
      item.parch_grade?.toLowerCase().includes(term)
    );
  });

  // PAGINATION
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const handlePrev = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  const handleOpenDeliveryModal = (id) => {
    const details = assigned.find((x) => x.id === id);
    setDeliveryDetails(details || null);
    setShowModal(true);
  };
  // ✅ Navigate to new page
    const handleNewParchment = () => navigate("/assign_parchment/new_parchment"); 

  return (
    <div className="p-4 col-span-full bg-gray-200 dark:bg-gray-800 shadow-xs rounded-xl">

      {/* Search */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by parch-lot-id, grade, or certificate..."
          className="px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#8B593E]"
        />

        <button
          onClick={handleNewParchment}
          className="px-5 py-2 bg-[#8B593E] text-white rounded-lg shadow hover:bg-[#70452F] transition-colors font-medium"
        >
          + New Parchment Lot
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[500px] rounded-lg">
        <table className="min-w-full border border-gray-200 text-md">
          <thead className="bg-gray-100 dark:bg-gray-700 uppercase">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Cherry-lot-id</th>
              <th className="px-4 py-2 border">Parch-lot-id</th>
              <th className="px-4 py-2 border">Grade</th>
              <th className="px-4 py-2 border">Weight</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr
                  key={item.id || index}
                  className="text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => handleOpenDeliveryModal(item.id)}
                >
                  <td className="px-4 py-2 border">
                    {startIndex + index + 1}
                  </td>

                  <td className="px-4 py-2 border">
                    {item.created_at
                      ? new Date(item.created_at)
                        .toISOString()
                        .split("T")[0]
                      : "-"}
                  </td>

                  <td className="px-4 py-2 border">
                    {item.cherry_lot_id || "-"}
                  </td>

                  <td className="px-4 py-2 border">
                    {item.parchment_id || "-"}
                  </td>

                  <td className="px-4 py-2 border">
                    {item.parch_grade || "-"}
                  </td>

                  <td className="px-4 py-2 border">
                    {item.parch_weight || "-"} kg
                  </td>

                  <td className="px-4 py-2 border">
                    {item.status || "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No parchment lots found.
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg min-w-[350px]">
            <h2 className="text-xl font-bold mb-4 uppercase text-[#8B593E]">
              Parchment Lot Details
            </h2>

            {deliveryDetails ? (
              <>
                <p><strong>Parchment ID:</strong> {deliveryDetails.parchment_id}</p>
                <p><strong>Cherry Lot:</strong> {deliveryDetails.cherry_lot_id}</p>
                <p><strong>Grade:</strong> {deliveryDetails.parch_grade}</p>
                <p><strong>Weight:</strong> {deliveryDetails.parch_weight} kg</p>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-[#8B593E] text-white rounded hover:bg-[#70452F]"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <p>Loading details...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AssignParchmentPage;
