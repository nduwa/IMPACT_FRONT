import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  getDeliveryReports,
  DeliveryProcessing,
  submitDeliveryReport,
} from "../../hooks/delivery_processingHook";

function DeliveryProcessingPage() {
  const [allReports, setAllReports] = useState([]);
  const [deliveryReports, setDeliveryReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingIds, setLoadingIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0 });

  const limit = 15;

  // Fetch & merge reports
  const loadReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDeliveryReports(); // { reports, processed }
      const allReports = res?.reports || [];
      const processed = res?.processed || [];

      const mergedReports = allReports.map((report) => {
        const processedData = processed.find(
          (p) => String(p.deliveryid) === String(report.id)
        );
        return {
          ...report,
          delivery_weight: processedData?.delivery_weight || "-",
          delivery_bags: processedData?.delivery_bags || "-",
          loaded_weight: processedData?.loaded_Weight || "-", // fixed naming
          trans_weight: processedData?.trans_weight || "-",
          status: processedData?.status || 0,
        };
      });

      setAllReports(mergedReports);
    } catch (err) {
      console.error("Failed to load delivery reports:", err);
      setError("Failed to fetch delivery reports.");
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  // Apply filtering + pagination
  useEffect(() => {
    const filteredReports = allReports.filter((report) =>
      String(report.deliveryid || report.id)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    const totalItems = filteredReports.length;
    setPagination({
      totalPages: Math.ceil(totalItems / limit) || 1,
      totalItems,
    });

    const paginatedData = filteredReports.slice(
      (currentPage - 1) * limit,
      currentPage * limit
    );

    setDeliveryReports(paginatedData);
  }, [allReports, searchTerm, currentPage]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < pagination.totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleProcess = async (id) => {
    try {
      const res = await DeliveryProcessing(id);
      toast.success(res.message || `Processed delivery report with ID ${id}`);
      await loadReports();
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to process delivery.";
      console.error("Processing error:", errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleSubmit = async (id) => {
    try {
      setLoadingIds((prev) => [...prev, id]);
      const res = await submitDeliveryReport(id);
      toast.success(res.message || `Submitted delivery report with ID ${id}`);
      await loadReports();
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to submit delivery.";
      console.error("Submission error:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoadingIds((prev) => prev.filter((lid) => lid !== id));
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 col-span-full bg-gray-200 dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="overflow-x-auto">
        <div className="mb-3">
          <input
            type="search"
            name="search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by Delivery ID..."
            className="px-3 py-2 border rounded w-64"
          />
        </div>
        <table className="min-w-full border border-gray-200 text-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Delivery ID</th>
              <th className="px-4 py-2 border">Grade</th>
              <th className="px-4 py-2 border"> expected Wt</th>
              <th className="px-4 py-2 border">Lot Weight</th>
              <th className="px-4 py-2 border">Bags</th>
              <th className="px-4 py-2 border">Loaded Wt</th>
              {/* <th className="px-4 py-2 border">Transaction Wt</th> */}
              <th className="px-4 py-2 border">Percentage</th>
              <th className="px-4 py-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveryReports.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center py-4 text-gray-500">
                  No delivery record found.
                </td>
              </tr>
            ) : (
              deliveryReports.map((report, index) => {
                const weight = parseFloat(report.delivery_weight) || 0;
                const loadedWeight = parseFloat(report.loaded_weight) || 0;
                const percentage =
                  weight && loadedWeight
                    ? `${((loadedWeight / weight) * 100).toFixed(2)}%`
                    : "-";

                return (
                  <tr key={report.id} className="hover:bg-gray-50 text-center">
                    <td className="px-4 py-2 border">
                      {(currentPage - 1) * limit + index + 1}
                    </td>
                    <td className="px-4 py-2 border">
                      {report.created_at
                        ? new Date(report.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-2 border">
                      {report.deliveryid || report.id}
                    </td>
                    <td className="px-4 py-2 border">{report.grade}</td>
                    <td className="px-4 py-2 border">{report.weight || "-"}</td>
                    <td className="px-4 py-2 border">
                      {report.delivery_weight || "-"}
                    </td>
                    <td className="px-4 py-2 border">
                      {report.delivery_bags || "-"}
                    </td>
                    <td className="px-4 py-2 border">
                      {report.loaded_weight && !isNaN(report.loaded_weight)
                        ? parseFloat(report.loaded_weight).toFixed(2)
                        : "-"}
                    </td>
                    {/* <td className="px-4 py-2 border">
                      {report.trans_weight && !isNaN(report.trans_weight)
                        ? parseFloat(report.trans_weight).toFixed(2)
                        : "-"}
                    </td> */}
                    <td className="px-4 py-2 border">{percentage}</td>
                    <td className="px-4 py-2 border flex justify-center gap-2">
                      {Number(report.status) === 1 ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-600 text-white text-sm font-medium">
                          ✔
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-600 text-white text-sm font-medium">
                          ✖
                        </span>
                      )}
                      <button
                        className="bg-gray-800 text-white px-3 py-1 rounded-lg hover:bg-gray-900"
                        onClick={() => handleProcess(report.id)}
                      >
                        Process
                      </button>
                      <button
                        className={`bg-green-600 text-white font-medium px-3 py-1 rounded-lg hover:bg-green-700 
                          ${loadingIds.includes(report.id) ? "opacity-70 cursor-not-allowed" : ""}`}
                        onClick={() => handleSubmit(report.id)}
                        disabled={loadingIds.includes(report.id)}
                      >
                        {loadingIds.includes(report.id) ? "Sending..." : "Send to FM"}
                      </button>
                    </td>
                  </tr>
                );
              })
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

export default DeliveryProcessingPage;
