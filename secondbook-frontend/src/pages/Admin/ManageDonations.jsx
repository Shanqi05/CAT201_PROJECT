import React, { useState, useEffect } from 'react';
import { Heart, BookOpen, Users, Calendar, Search, Download, Package, Check, X, Filter, MoreVertical } from 'lucide-react';

const ManageDonations = () => {
    const [donations, setDonations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const response = await fetch('http://localhost:8080/CAT201_project/getDonatedBooks', {
                credentials: 'include'
            });
            const data = await response.json();
            setDonations(data);
        } catch (error) {
            console.error('Error fetching donations:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const params = new URLSearchParams();
            params.append("id", id);
            params.append("status", status);

            const response = await fetch('http://localhost:8080/CAT201_project/updateDonationStatus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                credentials: 'include',
                body: params
            });

            const data = await response.json();
            if (data.success) {
                fetchDonations();
            } else {
                alert('Update failed');
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    // Statistics
    const totalDonations = donations.length;
    const pendingCount = donations.filter(d => d.approveCollectStatus === 'Pending').length;
    const approvedCount = donations.filter(d => d.approveCollectStatus === 'Approved').length;
    const collectedCount = donations.filter(d => d.approveCollectStatus === 'Collected').length;

    const filteredDonations = donations.filter(donation => {
        const matchesSearch =
            (donation.donorName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (donation.donorEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (donation.title || '').toLowerCase().includes(searchTerm.toLowerCase());

        let matchesStatus = true;
        if (filterStatus !== 'all') {
            matchesStatus = donation.approveCollectStatus === filterStatus;
        }
        return matchesSearch && matchesStatus;
    });

    const exportToCSV = () => {
        const headers = ['ID', 'Donor Name', 'Email', 'Phone', 'Book Title', 'Author', 'Condition', 'Status', 'Date'];
        const rows = donations.map(d => [
            d.donatedBookId,
            d.donorName || 'N/A',
            d.donorEmail,
            d.donorPhone || 'N/A',
            d.title,
            d.author || '',
            d.bookCondition,
            d.approveCollectStatus,
            new Date(d.createdAt).toLocaleDateString()
        ]);
        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'donations_export.csv';
        a.click();
    };

    return (
        <div className="p-8 max-w-7xl mx-auto w-full">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Manage Donations
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Track requests, approve pickups, and manage inventory intake.
                    </p>
                </div>
                <button
                    onClick={exportToCSV}
                    className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg flex items-center font-bold text-sm shadow-sm transition-all"
                >
                    <Download size={16} className="mr-2" /> Export CSV
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: "Total Requests", value: totalDonations, color: "bg-purple-500", icon: <Package/> },
                    { label: "Pending Review", value: pendingCount, color: "bg-yellow-500", icon: <Calendar/> },
                    { label: "Approved", value: approvedCount, color: "bg-green-500", icon: <Check/> },
                    { label: "Collected", value: collectedCount, color: "bg-blue-500", icon: <BookOpen/> }
                ].map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm mb-2`}>
                                {React.cloneElement(stat.icon, { size: 20 })}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search donor, email, or book..."
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-transparent outline-none text-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Collected">Collected</option>
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
                        <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                            {/* ADJUSTED COLUMN WIDTHS */}
                            <th className="p-5 text-left w-[35%]">Book Info</th>
                            <th className="p-5 text-left w-[20%]">Donor Details</th>
                            <th className="p-5 text-left w-[20%]">Pickup Address</th>
                            <th className="p-5 text-center w-[12%]">Status</th>
                            <th className="p-5 text-center w-[13%]">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="5" className="p-12 text-center text-gray-500">Loading...</td></tr>
                        ) : filteredDonations.length === 0 ? (
                            <tr><td colSpan="5" className="p-12 text-center text-gray-500">No donations found.</td></tr>
                        ) : (
                            filteredDonations.map((donation) => (
                                <tr key={donation.donatedBookId} className="hover:bg-gray-50/80 transition-colors group">

                                    {/* Book Column - Wider */}
                                    <td className="p-5 align-top">
                                        <div className="flex gap-4">
                                            {/* Image */}
                                            <div className="w-12 h-16 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center text-gray-300 border border-gray-200 overflow-hidden">
                                                {donation.imagePath ?
                                                    <img src={`http://localhost:8080/CAT201_project/uploads/${donation.imagePath}`} className="w-full h-full object-cover" alt="Book cover"/>
                                                    : <BookOpen size={20} />
                                                }
                                            </div>
                                            {/* Text Content - Allows wrapping */}
                                            <div className="min-w-0 flex-1">
                                                <p className="font-bold text-gray-900 text-sm leading-snug mb-0.5 break-words whitespace-normal">
                                                    {donation.title}
                                                </p>
                                                <p className="text-xs text-gray-500 mb-2 truncate">{donation.author || "Unknown Author"}</p>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                                        {donation.bookCondition}
                                                    </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Donor Column */}
                                    <td className="p-5 align-top">
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-bold text-gray-900 truncate">{donation.donorName || "Unknown"}</p>
                                            <p className="text-xs text-gray-500 truncate">{donation.donorEmail}</p>
                                            <p className="text-xs text-gray-400 font-mono">{donation.donorPhone}</p>
                                        </div>
                                    </td>

                                    {/* Address Column */}
                                    <td className="p-5 align-top">
                                        <div className="text-xs text-gray-600 leading-relaxed whitespace-normal break-words">
                                                <span className="font-bold text-gray-800 block mb-0.5">
                                                    {donation.pickupHouseNo}, {donation.pickupStreet}
                                                </span>
                                            {donation.pickupPostcode} {donation.pickupCity}<br/>
                                            {donation.pickupState}
                                        </div>
                                    </td>

                                    {/* Status Badge - Centered */}
                                    <td className="p-5 align-top text-center">
                                            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide min-w-[80px] ${
                                                donation.approveCollectStatus === 'Approved' ? 'bg-green-50 text-green-700 border-green-100' :
                                                    donation.approveCollectStatus === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                                        donation.approveCollectStatus === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                                                            'bg-blue-50 text-blue-700 border-blue-100' // Collected
                                            }`}>
                                                {donation.approveCollectStatus === 'Pending' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5 animate-pulse"></span>}
                                                {donation.approveCollectStatus}
                                            </span>
                                    </td>

                                    {/* Actions - Centered */}
                                    <td className="p-5 align-top text-center">
                                        <div className="flex justify-center items-center gap-2 h-full">
                                            {donation.approveCollectStatus === 'Pending' && (
                                                <>
                                                    <button
                                                        onClick={() => updateStatus(donation.donatedBookId, 'Approved')}
                                                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100"
                                                        title="Approve"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(donation.donatedBookId, 'Rejected')}
                                                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                        title="Reject"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </>
                                            )}
                                            {donation.approveCollectStatus === 'Approved' && (
                                                <button
                                                    onClick={() => updateStatus(donation.donatedBookId, 'Collected')}
                                                    className="px-3 py-1.5 bg-black text-white rounded-lg text-[10px] uppercase font-bold hover:bg-gray-800 transition-shadow shadow-sm whitespace-nowrap"
                                                >
                                                    Mark Collected
                                                </button>
                                            )}
                                            {(donation.approveCollectStatus === 'Collected' || donation.approveCollectStatus === 'Rejected') && (
                                                <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">No Action</span>
                                            )}
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