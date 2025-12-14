import React, { useState, useMemo, useEffect } from "react";
import ActivityModal from "../../components/ActivityModal";
import { useAuthStore } from "../../store/authStore";
import { FiDownload } from "react-icons/fi";
import {
  addActivityReport,
  fetchActivityReports,
  deleteActivityReport,
  updateActivityReport,
  exportActivityReports,
} from "../../hooks/reportHook";
import toast, { Toaster } from "react-hot-toast";

function ActivityPage() {
  const defaultReport = {
    date: "",
    type: "",
    description: "",
    farmers: "",
    women: "",
    men: "",
    distributedKgs: "",
    coffee: "",
    shade: "",
    grevelia: "",
    leucaena: "",
    markhamia: "",
    umuhumuro: "",
    croton: "",
    acacia: "",
    polyscias: "",
    caliandra: "",
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReport, setNewReport] = useState(defaultReport);
  const [isViewMode, setIsViewMode] = useState(false);
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { user } = useAuthStore();

  // Fetch reports
  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchActivityReports();
        if (user?._kf_Station) {
          const filtered = data.filter(
            (r) => r._kf_Station === user._kf_Station
          );
          setReports(filtered);
        } else {
          setReports(data);
        }
      } catch (error) {
        console.error("Error loading reports:", error);
        toast.error("Failed to load activity reports.");
      }
    };
    if (user) loadReports();
  }, [user]);

  // Filter + Pagination
  const filteredData = useMemo(() => {
    return reports.filter(
      (r) =>
        r.date?.toLowerCase?.().includes(searchTerm.toLowerCase()) ||
        r.type?.toLowerCase?.().includes(searchTerm.toLowerCase()) ||
        r.description?.toLowerCase?.().includes(searchTerm.toLowerCase())
    );
  }, [reports, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  // New Report
  const handleNewReport = () => {
    setNewReport({
      ...defaultReport,
      date: new Date().toISOString().split("T")[0],
    });
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  // Normalize shade varieties when viewing report
  const handleViewReport = (report) => {
    const shadeVarieties = [
      "grevelia",
      "leucaena",
      "markhamia",
      "umuhumuro",
      "croton",
      "acacia",
      "polyscias",
      "caliandra",
    ];

    const normalizedReport = { ...report };
    shadeVarieties.forEach((variety) => {
      if (report[variety] === undefined) normalizedReport[variety] = "";
    });

    setNewReport(normalizedReport);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  // Save Report
  const handleSave = async () => {
    try {
      let saved;
      if (newReport._id) {
        saved = await updateActivityReport(newReport._id, newReport);
        setReports((prev) =>
          prev.map((r) => (r._id === saved._id ? saved : r))
        );
        toast.success("Activity report updated successfully!");
      } else {
        saved = await addActivityReport(newReport);
        setReports((prev) => [...prev, saved]);
        toast.success("New activity report added!");
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving report:", error);
      toast.error("Failed to save report.");
    }
  };

  // Delete Report
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      await deleteActivityReport(id);
      setReports((prev) => prev.filter((r) => r._id !== id));
      toast.success("Report deleted successfully.");
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error("Failed to delete report.");
    }
  };

  return (
    <div className="p-4 col-span-full bg-gray-200 dark:bg-gray-800 shadow-xs rounded-xl">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Search + Actions */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by Date, Type or Description..."
          className="px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#8B593E]"
        />

        <div className="flex gap-3">
          {!user?.__kp_Station && (
            <button
              onClick={exportActivityReports}
              className="flex items-center gap-2 px-5 py-2 bg-[#8B593E] text-white rounded-lg shadow hover:bg-[#70452F] transition-colors font-medium"
            >
              <FiDownload size={18} />
              <span>Export</span>
            </button>
          )}

          <button
            onClick={handleNewReport}
            className="px-5 py-2 bg-[#8B593E] text-white rounded-lg shadow hover:bg-[#70452F] transition-colors font-medium"
          >
            + New Report
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[500px] rounded-lg">
        <table className="min-w-full border border-gray-200 text-md">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Station</th>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">Farmers</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr
                  key={item._id || index}
                  className="text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-4 py-2 border">{startIndex + index + 1}</td>
                  <td className="px-4 py-2 border">
                    {item.date ? new Date(item.date).toISOString().split("T")[0] : "-"}
                  </td>
                  <td className="px-4 py-2 border">{item.CW_Name || "-"}</td>
                  <td className="px-4 py-2 border">{item.type}</td>
                  <td className="px-4 py-2 border">{item.farmers || "-"}</td>
                  <td className="px-4 py-2 border">{item.description}</td>
                  <td className="px-4 py-2 border flex justify-center gap-3">
                    <button
                      onClick={() => handleViewReport(item)}
                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      View
                    </button>
                    {user?.__kp_Station && (
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No results found.
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
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-[#8B593E] text-white rounded disabled:opacity-50 hover:bg-[#70452F]"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newReport={newReport}
        setNewReport={setNewReport}
        onSave={handleSave}
        isViewMode={isViewMode}
      />
    </div>
  );
}

export default ActivityPage;
