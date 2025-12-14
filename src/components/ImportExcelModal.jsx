import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

const ImportExcelModal = ({ show, onClose, onDataParsed }) => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    const handleDone = () => {
        if (!file) {
            alert("Please select a file first.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

            onDataParsed(jsonData); // Send parsed data to parent
            onClose(); // Close modal
        };
        reader.readAsArrayBuffer(file);
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Import Farmers from Excel</h2>

                <div className="mb-4">
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="px-4 py-2 bg-[#8B593E] text-white rounded hover:bg-[#744832] mr-2"
                    >
                        Choose File
                    </button>
                    <span className="text-sm text-gray-700">
                        {fileName || "No file chosen"}
                    </span>
                    <input
                        type="file"
                        accept=".xlsx,.xls"
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
                        disabled={!file}
                        className={`px-4 py-2 rounded ${file
                                ? "bg-[#8B593E] text-white hover:bg-[#744832]"
                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportExcelModal;
