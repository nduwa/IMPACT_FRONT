import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { AccessModules, getAssignedAccess } from '../hooks/moduleHook';

function AssignPhoneAccessModal({ isOpen, onClose, onSave, user }) {
  const [selectedModules, setSelectedModules] = useState([]);
  const [error, setError] = useState('');
  const [modules, setModules] = useState([]);

  // Fetch all available modules + assigned ones
  useEffect(() => {
    if (!user) return;

    const fetchModules = async () => {
      try {
        const data = await AccessModules();
        const mobileModules = data.filter((mod) => mod.platform === 'mobile');
        setModules(mobileModules);

        const assigned = await getAssignedAccess(user.id); // fetch assigned module IDs
        const assignedIds = assigned.map((a) => a.moduleid);
        setSelectedModules(assignedIds);
      } catch (err) {
        console.error('Error fetching modules:', err);
        setError('Failed to load modules');
      }
    };

    fetchModules();
  }, [user]);

  // Toggle handler (fixed name)
  const handleModuleToggle = (moduleId) => {
    setSelectedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return;

    onSave({
      userId: user.id,
      modules: selectedModules,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-8 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-4">
          Assign Phone Access to {user?.Name_Full || user?.staff?.Name || ''}
        </h2>

        <hr className="mb-4 border-t border-gray-300" />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Modules Checklist */}
          <div>
            <label className="block text-md font-medium text-gray-700 mb-2">
              Select Modules
            </label>
            <div className="grid grid-cols-2 gap-2">
              {modules.map((mod) => (
                <label key={mod.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedModules.includes(mod.id)}
                    onChange={() => handleModuleToggle(mod.id)} // ✅ fixed
                    className="form-checkbox"
                  />
                  <span>{mod.module_name}</span>
                </label>
              ))}
            </div>
          </div>

          <hr className="mb-4 border-t border-gray-300" />

          {/* Error Message */}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AssignPhoneAccessModal;
