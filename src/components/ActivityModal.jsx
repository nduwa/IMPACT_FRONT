import React from "react";
import { useAuthStore } from "../store/authStore";

function ActivityModal({ isOpen, onClose, newReport, setNewReport, onSave, isViewMode }) {
  const { user } = useAuthStore();
  if (!isOpen) return null;

  const isReadOnly = isViewMode || !!user?._kf_Station;

  const shadeVarieties = [
    "Grevelia",
    "Leucaena",
    "Markhamia",
    "Umuhumuro",
    "Croton",
    "Acacia",
    "Polyscias",
    "caliandra",
  ];

  const inputClasses = `w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-200 ${
    isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
  }`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          {isReadOnly ? "View Activity Report" : "Add Activity Report"}
        </h2>

        <div className="space-y-4">
          {/* Activity Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Activity Type
            </label>
            <select
              value={newReport.type || ""}
              onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}
              className={inputClasses}
              disabled={isReadOnly}
            >
              <option value="">Select Type</option>
              <option value="Training">Training</option>
              <option value="Fertilizer">Fertilizer</option>
              <option value="Coffee seedling">Coffee seedling</option>
              <option value="Shade seedlings">Shade seedlings</option>
              <option value="Inspection">Inspection</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Farmers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Total Farmers
            </label>
            <input
              type="number"
              value={newReport.farmers || ""}
              onChange={(e) => setNewReport({ ...newReport, farmers: e.target.value })}
              className={inputClasses}
              disabled={isReadOnly}
            />
          </div>

          {/* Training-specific */}
          {newReport.type === "Training" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Attended Women
                </label>
                <input
                  type="number"
                  value={newReport.women || ""}
                  onChange={(e) => setNewReport({ ...newReport, women: e.target.value })}
                  className={inputClasses}
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Attended Men
                </label>
                <input
                  type="number"
                  value={newReport.men || ""}
                  onChange={(e) => setNewReport({ ...newReport, men: e.target.value })}
                  className={inputClasses}
                  disabled={isReadOnly}
                />
              </div>
            </>
          )}

          {/* Fertilizer */}
          {newReport.type === "Fertilizer" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Total Fertilizer Distributed (kgs)
              </label>
              <input
                type="number"
                value={newReport.distributedKgs || ""}
                onChange={(e) => setNewReport({ ...newReport, distributedKgs: e.target.value })}
                className={inputClasses}
                disabled={isReadOnly}
              />
            </div>
          )}

          {/* Coffee Seedlings */}
          {newReport.type === "Coffee seedling" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Number of Coffee Seedlings
              </label>
              <input
                type="number"
                value={newReport.coffee || ""}
                onChange={(e) => setNewReport({ ...newReport, coffee: e.target.value })}
                className={inputClasses}
                disabled={isReadOnly}
              />
            </div>
          )}

          {/* Shade Seedlings */}
          {newReport.type === "Shade seedlings" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Number of Shade Seedlings
              </label>
              <input
                type="number"
                value={newReport.shade || ""}
                onChange={(e) => setNewReport({ ...newReport, shade: e.target.value })}
                className={inputClasses}
                disabled={isReadOnly}
              />

              {/* Varieties */}
              <div className="mt-4 flex flex-wrap gap-3">
                {shadeVarieties.map((variety) => (
                  <div key={variety} className="flex flex-col items-center">
                    <span className="text-sm">{variety}</span>
                    <input
                      type="number"
                      value={newReport[variety.toLowerCase()] || ""}
                      onChange={(e) =>
                        setNewReport({ ...newReport, [variety.toLowerCase()]: e.target.value })
                      }
                      className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200 w-20"
                      placeholder="0"
                      disabled={isReadOnly}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={newReport.description || ""}
              onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
              className={inputClasses}
              rows="3"
              placeholder="Enter details about the activity..."
              disabled={isReadOnly}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Close
          </button>
          {!isReadOnly && (
            <button
              onClick={onSave}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActivityModal;
