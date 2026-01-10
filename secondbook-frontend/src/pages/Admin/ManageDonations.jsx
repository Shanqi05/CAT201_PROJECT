import React, { useState, useEffect } from 'react';
import { Heart, BookOpen, TrendingUp, Users, Calendar, Search, Download, Package, Check, X } from 'lucide-react';

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
            console.log("Donations Fetched:", data);
            setDonations(data);
        } catch (error) {
            console.error('Error fetching donations:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            // Ensure ID and Status names match Servlet expectations
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
                alert('Status updated!');
                fetchDonations();
            } else {
                alert('Update failed');
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    // [FIX] Statistics based on Array Length (1 row = 1 book)
    const totalDonations = donations.length;
    const pendingCount = donations.filter(d => d.approveCollectStatus === 'Pending').length;
    const approvedCount = donations.filter(d => d.approveCollectStatus === 'Approved').length;
    const collectedCount = donations.filter(d => d.approveCollectStatus === 'Collected').length;

    const filteredDonations = donations.filter(donation => {
        // [FIX] Safety checks for null values
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
        // [FIX] Headers match new schema
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
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-gray-800 mb-2">Manage Book Donations</h1>
                <p className="text-gray-600">Track and manage all book donations received</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500">
                    <p className="text-sm font-bold text-gray-600 uppercase">Total Items</p>
                    <h3 className="text-3xl font-black text-gray-800">{totalDonations}</h3>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-yellow-500">
                    <p className="text-sm font-bold text-gray-600 uppercase">Pending</p>
                    <h3 className="text-3xl font-black text-gray-800">{pendingCount}</h3>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
                    <p className="text-sm font-bold text-gray-600 uppercase">Approved</p>
                    <h3 className="text-3xl font-black text-gray-800">{approvedCount}</h3>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
                    <p className="text-sm font-bold text-gray-600 uppercase">Collected</p>
                    <h3 className="text-3xl font-black text-gray-800">{collectedCount}</h3>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-lg flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input type="text" placeholder="Search donor, email or book..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg outline-none focus:border-purple-500" />
                </div>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border-2 border-gray-200 rounded-lg outline-none font-semibold">
                    <option value="all">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Collected">Collected</option>
                </select>
                <button onClick={exportToCSV} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all">
                    <Download className="w-5 h-5" /> Export CSV
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">ID</th>
                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">Donor</th>
                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">Book Info</th>
                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">Address</th>
                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">Condition</th>
                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500">Loading...</td></tr>
                        ) : filteredDonations.length > 0 ? (
                            filteredDonations.map((donation) => (
                                <tr key={donation.donatedBookId} className="hover:bg-purple-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">#{donation.donatedBookId}</td>

                                    {/* Donor Info */}
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{donation.donorName || "Unknown"}</div>
                                        <div className="text-xs text-gray-500">{donation.donorEmail}</div>
                                        <div className="text-xs text-gray-500">{donation.donorPhone}</div>
                                    </td>

                                    {/* Book Info (Use 'title' not 'bookTitle') */}
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">{donation.title}</div>
                                        <div className="text-sm text-gray-500">{donation.author}</div>
                                        <div className="text-xs text-gray-400">{donation.category}</div>
                                    </td>

                                    {/* Address (Combined) */}
                                    <td className="px-6 py-4 text-xs text-gray-600 max-w-[200px]">
                                        {donation.pickupHouseNo}, {donation.pickupStreet},<br/>
                                        {donation.pickupPostcode} {donation.pickupCity},<br/>
                                        {donation.pickupState}
                                    </td>

                                    <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800">{donation.bookCondition}</span></td>

                                    <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                                donation.approveCollectStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                                                    donation.approveCollectStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        donation.approveCollectStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                            }`}>
                                                {donation.approveCollectStatus}
                                            </span>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-2">
                                            {donation.approveCollectStatus === 'Pending' && (
                                                <>
                                                    <button onClick={() => updateStatus(donation.donatedBookId, 'Approved')} className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200" title="Approve"><Check className="w-4 h-4" /></button>
                                                    <button onClick={() => updateStatus(donation.donatedBookId, 'Rejected')} className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200" title="Reject"><X className="w-4 h-4" /></button>
                                                </>
                                            )}
                                            {donation.approveCollectStatus === 'Approved' && (
                                                <button onClick={() => updateStatus(donation.donatedBookId, 'Collected')} className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-xs font-bold hover:bg-blue-200">Mark Collected</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500">No donations found</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageDonations;