import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { ImportExcelFarmers } from '../hooks/registerHook'; // adjust path
import toast from 'react-hot-toast';

const ImportExcelFarmersModal = ({ show, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const allowedExtensions = [".xls", ".xlsx", ".csv", ".ods"];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    e.target.value = null; // reset input
    if (selectedFile) {
      const ext = selectedFile.name.slice(selectedFile.name.lastIndexOf('.')).toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        toast.error(`Unsupported file format. Allowed: ${allowedExtensions.join(', ')}`);
        setFile(null);
        setFileName('');
        return;
      }
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleDone = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }
    setLoading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet);

      console.log("Parsed rows:", rows);

      const res = await ImportExcelFarmers(rows);

      toast.success(res.message || "Farmers imported successfully!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Import failed:", err);
      toast.error("Failed to import farmers. Please check your Excel format.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Import Farmers Excel With Farmer IDs</h2>

        <div className="mb-4 flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current.click()}
            className="px-4 py-2 bg-[#8B593E] text-white rounded hover:bg-[#744832]"
          >
            Choose File
          </button>
          <span className="text-sm text-gray-700">{fileName || "No file chosen"}</span>
          <input
            type="file"
            accept=".xls,.xlsx,.csv,.ods"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleDone}
            disabled={!file || loading}
            className={`px-4 py-2 rounded ${file && !loading
              ? "bg-[#8B593E] text-white hover:bg-[#744832]"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? "Uploading..." : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportExcelFarmersModal;
