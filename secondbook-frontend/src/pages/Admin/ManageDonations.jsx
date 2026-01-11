import React, { useState, useEffect } from 'react';
import { Heart, BookOpen, Users, Calendar, Search, Download, Package, Check, X, Filter, Truck, Tag } from 'lucide-react';

const ManageDonations = () => {
    // ... [Keep state and useEffect fetchDonations same as before] ...
    const [donations, setDonations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchDonations(); }, []);

    const fetchDonations = async () => {
        try {
            const response = await fetch('http://localhost:8080/CAT201_project/getDonatedBooks', { credentials: 'include' });
            const data = await response.json();
            setDonations(data);
        } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
    };

    const updateStatus = async (id, status) => {
        try {
            const params = new URLSearchParams();
            params.append("id", id);
            params.append("status", status);
            const response = await fetch('http://localhost:8080/CAT201_project/updateDonationStatus', {
                method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, credentials: 'include', body: params
            });
            const data = await response.json();
            if (data.success) { if (status === 'Collected') alert("Book collected and added to inventory!"); fetchDonations(); }
            else { alert('Update failed'); }
        } catch (error) { console.error('Error:', error); }
    };

    const handleReject = (id) => { if (window.confirm("Are you sure you want to REJECT this donation?")) { updateStatus(id, 'Rejected'); } };

    // ... [Keep stats calculations and filtering logic] ...
    const totalDonations = donations.length;
    const pendingCount = donations.filter(d => d.approveCollectStatus === 'Pending').length;
    const approvedCount = donations.filter(d => d.approveCollectStatus === 'Approved').length;
    const collectedCount = donations.filter(d => d.approveCollectStatus === 'Collected').length;

    const filteredDonations = donations.filter(donation => {
        const matchesSearch = (donation.donorName || '').toLowerCase().includes(searchTerm.toLowerCase()) || (donation.donorEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) || (donation.title || '').toLowerCase().includes(searchTerm.toLowerCase());
        let matchesStatus = true;
        if (filterStatus !== 'all') { matchesStatus = donation.approveCollectStatus === filterStatus; }
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        const s = (status || '').toLowerCase();
        switch(s) {
            case 'approved': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center justify-center w-fit border border-green-200"><Check size={12} className="mr-1.5" /> Approved</span>;
            case 'collected': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center justify-center w-fit border border-blue-200"><Truck size={12} className="mr-1.5" /> Collected</span>;
            case 'pending': return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center justify-center w-fit border border-yellow-200"><Calendar size={12} className="mr-1.5" /> Pending</span>;
            case 'rejected': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center justify-center w-fit border border-red-200"><X size={12} className="mr-1.5" /> Rejected</span>;
            default: return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold flex items-center justify-center w-fit">{status}</span>;
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto w-full">
            {/* ... [Keep Header and Stats UI same as before] ... */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"><div><h1 className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Manage Donations</h1><p className="text-gray-500 text-sm mt-1">Track requests, approve pickups, and manage inventory intake.</p></div></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">{[{ label: "Total Requests", value: totalDonations, color: "bg-purple-500", icon: <Package/> }, { label: "Pending Review", value: pendingCount, color: "bg-yellow-500", icon: <Calendar/> }, { label: "Approved", value: approvedCount, color: "bg-green-500", icon: <Check/> }, { label: "Collected", value: collectedCount, color: "bg-blue-500", icon: <BookOpen/> }].map((stat, index) => (<div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow"><div><div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm mb-2`}>{React.cloneElement(stat.icon, { size: 20 })}</div></div><div className="text-right"><p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{stat.label}</p><h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3></div></div>))}</div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row items-center justify-between gap-4"><div className="relative w-full md:w-96"><Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} /><input type="text" placeholder="Search donor, email, or book..." className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-transparent outline-none text-sm transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div><div className="relative"><select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer"><option value="all">All Status</option><option value="Pending">Pending</option><option value="Approved">Approved</option><option value="Rejected">Rejected</option><option value="Collected">Collected</option></select><Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} /></div></div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
                        <thead><tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold"><th className="p-5 text-left w-[35%]">Book Info</th><th className="p-5 text-left w-[20%]">Donor Details</th><th className="p-5 text-left w-[20%]">Pickup Address</th><th className="p-5 text-center w-[12%]">Status</th><th className="p-5 text-center w-[13%]">Actions</th></tr></thead>
                        <tbody className="divide-y divide-gray-50">
                        {loading ? ( <tr><td colSpan="5" className="p-12 text-center text-gray-500">Loading...</td></tr> ) : filteredDonations.length === 0 ? ( <tr><td colSpan="5" className="p-12 text-center text-gray-500">No donations found.</td></tr> ) : (
                            filteredDonations.map((donation) => (
                                <tr key={donation.donatedBookId} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="p-5 align-top">
                                        <div className="flex gap-4">
                                            {/* [FIX] Handle Image Path Correctly */}
                                            <div className="w-12 h-16 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center text-gray-300 border border-gray-200 overflow-hidden">
                                                {donation.imagePath ? (
                                                    <img
                                                        src={donation.imagePath.startsWith('http')
                                                            ? donation.imagePath
                                                            : `http://localhost:8080/CAT201_project/uploads/${donation.imagePath}`}
                                                        className="w-full h-full object-cover"
                                                        alt="Book cover"
                                                        onError={(e) => e.target.style.display = 'none'}
                                                    />
                                                ) : <BookOpen size={20} />}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-bold text-gray-900 text-sm leading-snug mb-0.5 break-words whitespace-normal">{donation.title}</p>
                                                <p className="text-xs text-gray-500 mb-1 truncate">{donation.author || "Unknown Author"}</p>
                                                <div className="flex flex-wrap gap-1">
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-gray-100 text-gray-600 border border-gray-200 uppercase">{donation.bookCondition}</span>
                                                    {donation.genres && (Array.isArray(donation.genres) ? donation.genres : (typeof donation.genres === 'string' ? donation.genres.replace(/[{"}]/g, '').split(',') : [])).filter(g => g && g.trim()).slice(0, 2).map((g, i) => (
                                                        <span key={i} className="text-[9px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded border border-purple-100 flex items-center"><Tag size={8} className="mr-0.5"/> {g.trim()}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    {/* ... [Rest of columns same as before] ... */}
                                    <td className="p-5 align-top"><div className="space-y-0.5"><p className="text-sm font-bold text-gray-900 truncate">{donation.donorName || "Unknown"}</p><p className="text-xs text-gray-500 truncate">{donation.donorEmail}</p><p className="text-xs text-gray-400 font-mono">{donation.donorPhone}</p></div></td>
                                    <td className="p-5 align-top"><div className="text-xs text-gray-600 leading-relaxed whitespace-normal break-words"><span className="font-bold text-gray-800 block mb-0.5">{donation.pickupHouseNo}, {donation.pickupStreet}</span>{donation.pickupPostcode} {donation.pickupCity}<br/>{donation.pickupState}</div></td>
                                    <td className="p-5 align-top text-center">{getStatusBadge(donation.approveCollectStatus)}</td>
                                    <td className="p-5 align-top text-center">
                                        <div className="flex justify-center items-center gap-2 h-full">
                                            {donation.approveCollectStatus === 'Pending' && (<><button onClick={() => updateStatus(donation.donatedBookId, 'Approved')} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100" title="Approve"><Check size={18} /></button><button onClick={() => handleReject(donation.donatedBookId)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" title="Reject"><X size={18} /></button></>)}
                                            {donation.approveCollectStatus === 'Approved' && (<button onClick={() => updateStatus(donation.donatedBookId, 'Collected')} className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100" title="Mark Collected"><Truck size={18} /></button>)}
                                            {(donation.approveCollectStatus === 'Collected' || donation.approveCollectStatus === 'Rejected') && (<span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">No Action</span>)}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageDonations;