import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AllLotsOfLoading, AllLots, Post_TransportDelivery } from "../../hooks/parchmentHook";

function TransportDeliveryForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tally_sheet_no: "",
    bags: "",
    weight: "",
    loading_date: "",
    loader: "",
    inspected: "",
    accountant: "",
    driver_name: "",
    driver_licence: "",
    plate_no: "",
  });

  const [lots, setLots] = useState([]);
  const [loaded_lots, setLoaded_lots] = useState([]);
  const [selectedParchment, setSelectedParchment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState("A");

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      loading_date: new Date().toISOString().split("T")[0],
    }));
  }, []);

  useEffect(() => {
    const fetchLots = async () => {
      setLoading(true);
      try {
        const response = await AllLotsOfLoading();
        const result = await AllLots();
        if (response?.status === "success") setLots(response.data || []);
        if (result?.status === "success") setLoaded_lots(result.data || []);
      } catch (err) {
        console.error("Error fetching lots:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLots();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormData = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e, parchment) => {
    const value = e.target.value;
    const id = parchment.parchment_id;
    setSelectedParchment(prev =>
      value === "Yes" ? [...new Set([...prev, id])] : prev.filter(p => p !== id)
    );
  };

  const stockbal = (parchmentId, totalWeight) => {
    const previouslyLoaded = loaded_lots
      .filter(lot => lot.parch_lot_ID === parchmentId)
      .reduce((sum, lot) => sum + parseFloat(lot.weight || 0), 0);
    return Math.max(totalWeight - previouslyLoaded, 0).toFixed(0);
  };

  const uniqueLots = Array.from(
    new Map(lots.map(lot => [`${lot.parchment_id}_${lot.cherry_lot_id}`, lot])).values()
  );

  const filteredLots = uniqueLots.filter(
    lot => lot.parchment_id?.slice(-1).toUpperCase() === selectedGrade
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tally_sheet_no || !formData.loader || selectedParchment.length === 0) {
      alert("Please fill all required fields and select at least one parchment lot.");
      return;
    }

    const parchmentDetails = selectedParchment.map(id => ({
      parchment_id: id,
      bags: formData[`bags_${id}`] || 0,
      weight: formData[`weight_${id}`] || 0,
      bags_left: formData[`bags_left_${id}`] || 0,
    }));

    // Remove dynamic lot-specific fields before sending
    const cleanedFormData = { ...formData };
    Object.keys(cleanedFormData).forEach(key => {
      if (key.startsWith("bags_") || key.startsWith("weight_") || key.startsWith("bags_left_")) {
        delete cleanedFormData[key];
      }
    });

    const payload = {
      ...cleanedFormData,
      parchments: parchmentDetails,
    };

    console.log("Payload sent:", payload);

    try {
      setSaving(true);
      const response = await Post_TransportDelivery(payload);
      if (response.status === "success") {
        alert("✅ Delivery saved successfully!");
        navigate("/parchment_transport");
      } else {
        alert(`⚠️ ${response.message}`);
      }
    } catch (error) {
      console.error("Error saving delivery:", error);
      alert("Something went wrong while saving delivery.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Loading available parchment lots...
      </div>
    );
  }

  return (
    <div className="p-4 col-span-full bg-gray-200 dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-[#8B593E]">Transport Delivery Form</h1>
          <button
            onClick={() => navigate("/parchment_transport")}
            className="px-4 py-2 bg-[#8B593E] text-white rounded-lg hover:bg-[#70452F]"
          >
            ← Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Delivery Info */}
          <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
            {[
              { label: "TALLY SHEET No.", name: "tally_sheet_no", type: "text", placeholder: "Enter tally sheet number" },
              { label: "NUMBER OF BAGS", name: "bags", type: "number", placeholder: "Enter total bags" },
              { label: "TOTAL WEIGHT (Kg)", name: "weight", type: "number", step: "0.01", placeholder: "Enter total weight" },
            ].map(({ label, name, type, placeholder, step }) => (
              <div key={name}>
                <label className="block text-gray-700 font-medium mb-1">{label}</label>
                <input
                  type={type}
                  step={step}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#8B593E]"
                />
              </div>
            ))}
          </div>

          {/* Lots Table */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-800">Select Lots for Loading</h2>
              <div className="flex items-center space-x-2">
                <label className="text-gray-700 font-medium">Filter by Grade:</label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="border rounded-lg px-3 py-1 focus:ring-2 focus:ring-[#8B593E]"
                >
                  <option value="A">Grade A</option>
                  <option value="B">Grade B</option>
                  <option value="C">Grade C</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">SELECT</th>
                    <th className="p-2 text-left">PARCH CODE</th>
                    <th className="p-2 text-left">STOCK INIT</th>
                    <th className="p-2 text-left">STOCK BAL</th>
                    <th className="p-2 text-left">CHERRY LOT ID</th>
                    <th className="p-2 text-left">NUMBER OF BAGS</th>
                    <th className="p-2 text-left">KILOGRAMS LOADED</th>
                    <th className="p-2 text-left">BAGS LEFT</th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {filteredLots.map((parchment, index) => (
                    <tr key={`${parchment.parchment_id}_${parchment.cherry_lot_id}_${index}`} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                      <td className="p-4">
                        <select
                          name={`select_${parchment.parchment_id}`}
                          className="rounded-lg"
                          value={selectedParchment.includes(parchment.parchment_id) ? "Yes" : "No"}
                          onChange={(e) => handleSelectChange(e, parchment)}
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </td>

                      <td className="p-4">{parchment.parchment_id}</td>
                      <td className="p-4">{parchment.parch_weight}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded ${stockbal(parchment.parchment_id, parchment.parch_weight) === "0" ? "bg-red-500 text-white" : "bg-[#8B593E] text-white"}`}>
                          {stockbal(parchment.parchment_id, parchment.parch_weight)}
                        </span>
                      </td>
                      <td className="p-4">{parchment.cherry_lot_id}</td>

                      {["bags", "weight", "bags_left"].map((field) => (
                        <td key={field} className="p-4">
                          {selectedParchment.includes(parchment.parchment_id) && (
                            <input
                              type="number"
                              step={field === "weight" ? "0.01" : "1"}
                              name={`${field}_${parchment.parchment_id}`}
                              className="rounded-lg w-40"
                              placeholder={`Enter ${field.replace("_", " ")}`}
                              value={formData[`${field}_${parchment.parchment_id}`] || ""}
                              onChange={handleFormData}
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Staff & Transport Info */}
          <div className="bg-white shadow-md rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Loaded by", name: "loader" },
              { label: "Inspected by", name: "inspected" },
              { label: "Accountant's Name", name: "accountant" },
              { label: "Driver's Name", name: "driver_name" },
              { label: "Driver's Licence / ID", name: "driver_licence" },
              { label: "Vehicle Plate No.", name: "plate_no" },
            ].map(({ label, name }) => (
              <div key={name}>
                <label className="block text-gray-700 font-medium mb-1">{label}</label>
                <input
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#8B593E]"
                />
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className={`px-6 py-2 text-white font-medium rounded-lg transition-all ${saving ? "bg-gray-500" : "bg-[#8B593E] hover:bg-[#70452F]"}`}
            >
              {saving ? "Saving..." : "Save Delivery"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransportDeliveryForm;
