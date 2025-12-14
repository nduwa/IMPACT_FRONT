import React, { useEffect, useState } from "react";
import { allDryings, allTransactions } from "../../hooks/parchmentHook";

function NewParchmentPage() {
    const [dryings, setDryings] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [mergedData, setMergedData] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const [selectedGrade, setSelectedGrade] = useState("A");
    const [selectedCertification, setSelectedCertification] = useState("certified");

    const [showModal, setShowModal] = useState(false);
    const [deliveryDetails, setDeliveryDetails] = useState(null);

    // Fetch Dryings
    useEffect(() => {
        (async () => {
            const res = await allDryings();
            setDryings(res || []);
        })();
    }, []);

    // Fetch Transactions
    useEffect(() => {
        (async () => {
            const res = await allTransactions();
            setTransactions(res || []);
        })();
    }, []);

    // Merge Logic (IMPORTANT FIX)
    useEffect(() => {
        if (dryings.length === 0) return;

        const merged = dryings.map(dry => {
            const lotId = dry.day_lot_number;

            // Filter transactions for this lot
            const relatedTx = transactions.filter(
                tx => tx.cherry_lot_id === lotId
            );

            // Sum kgs
            const totalKGs = relatedTx.reduce(
                (sum, tx) =>
                    sum +
                    Number(tx.kilograms || 0) +
                    Number(tx.bad_kilograms || 0),
                0
            );

            return {
                ...dry,
                totalKGs,
                txCount: relatedTx.length,
                relatedTx
            };
        });

        setMergedData(merged);
    }, [dryings, transactions]);

    // Filter by search
    const filteredData = mergedData.filter(item =>
        item.day_lot_number?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // Open Modal
    const handleOpenDeliveryModal = (id) => {
        const details = mergedData.find(item => item.id === id);
        setDeliveryDetails(details);
        setShowModal(true);
    };

    const showCertified = selectedCertification === "certified";
    const showUncertified = selectedCertification === "uncertified";

    return (
        <div className="p-4 col-span-full bg-gray-200 dark:bg-gray-800 shadow-xs rounded-xl">

            {/* Search + Filters */}
            <div className="flex justify-between items-center mb-4">
                <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    placeholder="Search by cherry lot ID..."
                    className="px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#8B593E]"
                />

                <div className="flex gap-4">
                    {/* Certification */}
                    <div className="flex items-center gap-2">
                        <label className="font-semibold">Certification:</label>
                        <select
                            value={selectedCertification}
                            onChange={(e) => {
                                setSelectedCertification(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="p-2 border rounded"
                        >
                            <option value="certified">Certified</option>
                            <option value="uncertified">Uncertified</option>
                        </select>
                    </div>

                    {/* Grade */}
                    <div className="flex items-center gap-2">
                        <label className="font-semibold">Grade:</label>
                        <select
                            value={selectedGrade}
                            onChange={(e) => {
                                setSelectedGrade(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="p-2 border rounded"
                        >
                            <option value="A">Grade A</option>
                            <option value="B">Grade B</option>
                            <option value="C">Grade C</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto max-h-[500px] rounded-lg">
                <table className="min-w-full border border-gray-200 text-md">
                    <thead className="bg-gray-100 dark:bg-gray-700 uppercase">
                        <tr>
                            <th className="px-4 py-2 border">#</th>
                            <th className="px-4 py-2 border">Cherry Lot ID</th>
                            <th className="px-4 py-2 border">Total KGs</th>
                            <th className="px-4 py-2 border">Transactions</th>

                            {showCertified && (
                                <>
                                    <th className="px-4 py-2 border">Certified KGs</th>
                                    <th className="px-4 py-2 border">Certified PX</th>
                                </>
                            )}

                            {showUncertified && (
                                <>
                                    <th className="px-4 py-2 border">Uncertified KGs</th>
                                    <th className="px-4 py-2 border">Uncertified PX</th>
                                </>
                            )}

                            {selectedGrade === "A" && <th className="px-4 py-2 border">Grade A</th>}
                            {selectedGrade === "B" && <th className="px-4 py-2 border">Grade B</th>}
                            {selectedGrade === "C" && <th className="px-4 py-2 border">Grade C</th>}

                            <th className="px-4 py-2 border">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((item, index) => (
                                <tr
                                    key={item.id || index}
                                    className="text-center hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                    onClick={() => handleOpenDeliveryModal(item.id)}
                                >
                                    <td className="px-4 py-2 border">{startIndex + index + 1}</td>
                                    <td className="px-4 py-2 border">{item.cherry_lot_id}</td>
                                    <td className="px-4 py-2 border">{item.totalKGs}</td>
                                    <td className="px-4 py-2 border">{item.txCount}</td>

                                    {showCertified && (
                                        <>
                                            <td className="px-4 py-2 border">{item.total_cherry_kg}</td>
                                            <td className="px-4 py-2 border">{item.certified_px}</td>
                                        </>
                                    )}

                                    {showUncertified && (
                                        <>
                                            <td className="px-4 py-2 border">{item.uncertified_kgs}</td>
                                            <td className="px-4 py-2 border">{item.uncertified_px}</td>
                                        </>
                                    )}

                                    {selectedGrade === "A" && (
                                        <td className="px-4 py-2 border">{item.GradeA}</td>
                                    )}
                                    {selectedGrade === "B" && (
                                        <td className="px-4 py-2 border">{item.GradeB}</td>
                                    )}
                                    {selectedGrade === "C" && (
                                        <td className="px-4 py-2 border">{item.GradeC}</td>
                                    )}

                                    <td className="px-4 py-2 border">{item.status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="12" className="text-center py-4">
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
                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-[#8B593E] text-white rounded disabled:opacity-50"
                >
                    Prev
                </button>

                <span className="text-sm">
                    Page {currentPage} of {totalPages || 1}
                </span>

                <button
                    onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-[#8B593E] text-white rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default NewParchmentPage;
