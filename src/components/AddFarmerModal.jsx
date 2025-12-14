import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { importFarmerData, getStationGroups } from '../hooks/registerHook';
import ImportExcelModal from './ImportExcelModal';
import rwandaLocations from "../utils/transformRwandaLocations.js";

const AddFarmerModal = ({ onCancel, onSubmit }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        farmer_name: '',
        Gender: '',
        phone: '',
        dob: '',
        National_ID: '',
        Group_ID: '',
        province: '',
        district: '',
        sector: '',
        cell: '',
        village: '',
        total_trees: '',
        productive_trees: '',
        plot_number: '',
        literacy: '',
        numeracy: '',
        education_level: '',
        marital_status: '',
        latitude: '',
        longitude: '',
    });

    const [groups, setGroups] = useState([]);
    const [showImportModal, setShowImportModal] = useState(false);
    

    useEffect(() => {
        const fetchGroups = async () => {
            const res = await getStationGroups();
            if (res.success) setGroups(res.data);
            else toast.error("Failed to load station groups");
        };
        fetchGroups();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => {
            // Reset dependent fields if parent changes
            if (name === "province") return { ...prev, province: value, district: "", sector: "", cell: "", village: "" };
            if (name === "district") return { ...prev, district: value, sector: "", cell: "", village: "" };
            if (name === "sector") return { ...prev, sector: value, cell: "", village: "" };
            if (name === "cell") return { ...prev, cell: value, village: "" };
            return { ...prev, [name]: value };
        });
    };

    const handleSubmit = () => {
        if (Object.values(form).some(val => !val || String(val).trim() === "")) {
            toast.error("Please fill in all fields.");
            return;
        }
        onSubmit(form);
    };

    const handleParsedData = async (data) => {
        const start = performance.now();
        try {
            const res = await importFarmerData(data);
            const end = performance.now();
            const timeTaken = ((end - start) / 1000).toFixed(2);
            toast.success(`${res.message || 'Farmers imported successfully!'} (in ${timeTaken}s)`, { duration: 90000 });
            //window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error('Failed to import farmers.');
        }
    };

    const inputClass = "bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-[#8B593E] focus:border-[#8B593E] block w-full p-2.5";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Ongeramo Umuhinzi</h2>
                    <button onClick={onCancel} className="text-gray-500 hover:text-red-500 text-xl">&times;</button>
                </div>
                <hr className="mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Farmer Name */}
                    <div>
                        <label className="text-sm font-medium">Amazina y'umuhinzi *</label>
                        <input name="farmer_name" value={form.farmer_name} onChange={handleChange} placeholder="Name..." className={inputClass} />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="text-sm font-medium">Igitsina *</label>
                        <select name="Gender" value={form.Gender} onChange={handleChange} className={inputClass}>
                            <option value="">Hitamo igitsina</option>
                            <option value="M">Gabo</option>
                            <option value="F">Gore</option>
                        </select>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="text-sm font-medium">Nomero ya telephone *</label>
                        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number..." className={inputClass} />
                    </div>

                    {/* DOB */}
                    <div>
                        <label className="text-sm font-medium">Umwaka w'amavuko *</label>
                        <input name="dob" value={form.dob} onChange={handleChange} placeholder="Year of birth..." className={inputClass} />
                    </div>

                    {/* National ID */}
                    <div>
                        <label className="text-sm font-medium">Nomero y'indangamuntu *</label>
                        <input name="National_ID" value={form.National_ID} onChange={handleChange} placeholder="National ID or Passport..." className={inputClass} />
                    </div>

                    {/* Group */}
                    <div>
                        <label className="text-sm font-medium">Itsinda arimo *</label>
                        <select name="Group_ID" value={form.Group_ID} onChange={handleChange} className={inputClass}>
                            <option value="">Hitamo itsinda</option>
                            {groups.map(g => <option key={g.id} value={g.ID_GROUP}>{g.ID_GROUP}</option>)}
                        </select>
                    </div>

                    {/* Province → District → Sector → Cell → Village */}
                    <div>
                        <label className="text-sm font-medium">Intara *</label>
                        <select name="province" value={form.province} onChange={handleChange} className={inputClass}>
                            <option value="">Hitamo Intara</option>
                            {Object.keys(rwandaLocations).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Akarere *</label>
                        <select name="district" value={form.district} onChange={handleChange} className={inputClass} disabled={!form.province}>
                            <option value="">Hitamo Akarere</option>
                            {form.province && Object.keys(rwandaLocations[form.province]).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Umurenge *</label>
                        <select name="sector" value={form.sector} onChange={handleChange} className={inputClass} disabled={!form.district}>
                            <option value="">Hitamo Umurenge</option>
                            {form.district && Object.keys(rwandaLocations[form.province][form.district]).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Akagari *</label>
                        <select name="cell" value={form.cell} onChange={handleChange} className={inputClass} disabled={!form.sector}>
                            <option value="">Hitamo Akagari</option>
                            {form.sector && Object.keys(rwandaLocations[form.province][form.district][form.sector]).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Umudugudu *</label>
                        <select name="village" value={form.village} onChange={handleChange} className={inputClass} disabled={!form.cell}>
                            <option value="">Hitamo Umudugudu</option>
                            {form.cell && rwandaLocations[form.province][form.district][form.sector][form.cell].map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                    </div>

                    {/* Other fields */}
                    <div>
                        <label className="text-sm font-medium">Umubare w'ibiti byose *</label>
                        <input name="total_trees" value={form.total_trees} onChange={handleChange} placeholder="Trees..." className={inputClass} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Ibiti byera *</label>
                        <input name="productive_trees" value={form.productive_trees} onChange={handleChange} placeholder="Productive trees..." className={inputClass} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Umubare w'ibipimo *</label>
                        <input name="plot_number" value={form.plot_number} onChange={handleChange} placeholder="Plot Number..." className={inputClass} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Ubumenyi bwo gusoma *</label>
                        <select name="literacy" value={form.literacy} onChange={handleChange} className={inputClass}>
                            <option value="">Hitamo</option>
                            <option value="Yego">Yego</option>
                            <option value="Oya">Oya</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Afite ubumenyi bw'imibare *</label>
                        <select name="numeracy" value={form.numeracy} onChange={handleChange} className={inputClass}>
                            <option value="">Hitamo</option>
                            <option value="Yego">Yego</option>
                            <option value="Oya">Oya</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Urwego rw'uburezi *</label>
                        <input name="education_level" value={form.education_level} onChange={handleChange} placeholder="Education Level..." className={inputClass} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Irangamimerere *</label>
                        <input name="marital_status" value={form.marital_status} onChange={handleChange} placeholder="Marital Status..." className={inputClass} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Latitude *</label>
                        <input name="latitude" value={form.latitude} onChange={handleChange} placeholder="Latitude..." className={inputClass} />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Longitude *</label>
                        <input name="longitude" value={form.longitude} onChange={handleChange} placeholder="Longitude..." className={inputClass} />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-6 col-span-2">
                        <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                        <button onClick={handleSubmit} className="px-4 py-2 bg-[#8B593E] text-white rounded hover:bg-[#744832]">Submit</button>
                        <button onClick={() => setShowImportModal(true)} className="px-4 py-2 bg-[#8B593E] text-white rounded hover:bg-[#744832]">Import</button>
                        

                        {/* Modals */}
                        <ImportExcelModal
                            show={showImportModal}
                            onClose={() => setShowImportModal(false)}
                            onDataParsed={handleParsedData}
                        />
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddFarmerModal;
