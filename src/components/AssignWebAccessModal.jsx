import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { AccessModules, getAssignedAccess } from '../hooks/moduleHook';
import toast from 'react-hot-toast';

const AssignWebAccessModal = ({ isOpen, onClose, onSave, user }) => {
    const [modules, setModules] = useState([]);
    const [selectedModules, setSelectedModules] = useState([]);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const allModules = await AccessModules();
                const dashboardModules = allModules.filter(m => m.platform === 'dashboard');
                setModules(dashboardModules);

                if (user) {
                    const assigned = await getAssignedAccess(user.id); // fetch assigned module IDs for this user
                    const assignedIds = assigned.map(a => a.moduleid);
                    setSelectedModules(assignedIds);
                }
            } catch (err) {
                toast.error("Failed to load modules");
            }
        };

        if (isOpen) {
            fetchModules();
        }
    }, [isOpen, user]);

    const handleToggleModule = (moduleId) => {
        setSelectedModules((prev) =>
            prev.includes(moduleId)
                ? prev.filter((id) => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const handleSubmit = (e) => {
    e.preventDefault();

    // Only include selected module IDs that exist in dashboard modules
    const dashboardSelected = selectedModules.filter((id) =>
        modules.some((mod) => mod.id === id && mod.platform === "dashboard")
    );

    const payload = {
        userid: user?.id,          // must be userid
        moduleid: dashboardSelected, // array of dashboard-only module IDs
    };

    console.log("Submitting payload (dashboard only):", payload); // DEBUG

    onSave(payload);
};

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
            <div className="bg-white w-full max-w-6xl p-8 rounded-xl shadow-lg relative">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        Assign Web Access to {user?.Name_Full || user?.Name}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <hr className="mb-4 border-t border-gray-300" />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <label className="block text-md font-medium text-gray-700 mb-2">
                        Select Modules
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {modules.map((mod) => (
                            <label key={mod.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={selectedModules.includes(mod.id)}
                                    onChange={() => handleToggleModule(mod.id)}
                                    className="form-checkbox"
                                />
                                <span>{mod.module_name}</span>
                            </label>
                        ))}
                    </div>

                    <hr className="mb-4 border-t border-gray-300" />
                    <div className="flex justify-end space-x-2">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
                        >
                            Assign Access
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignWebAccessModal;
