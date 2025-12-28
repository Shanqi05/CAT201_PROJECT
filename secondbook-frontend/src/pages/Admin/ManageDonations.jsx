import React, { useState, useEffect } from 'react';
import { Heart, BookOpen, TrendingUp, Users, Calendar, Search, Download, Package, Check, X } from 'lucide-react';

const ManageDonations = () => {
    const [donations, setDonations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);

    // Fetch donations from backend
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
            const params = new URLSearchParams({ id, status });
            const response = await fetch('http://localhost:8080/CAT201_project/updateDonationStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                credentials: 'include',
                body: params
            });
            const data = await response.json();
            if (data.success) {
                fetchDonations(); // Refresh the list
                alert('Status updated successfully!');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    // Calculate statistics
    const totalDonations = donations.length;
    const totalBooks = donations.reduce((sum, d) => sum + d.quantity, 0);
    const pendingCount = donations.filter(d => d.status === 'Pending').length;
    const approvedCount = donations.filter(d => d.status === 'Approved').length;

    // Filter donations
    const filteredDonations = donations.filter(donation => {
        const matchesSearch = donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            donation.donorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            donation.bookTitle.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesStatus = true;
        if (filterStatus !== 'all') {
            matchesStatus = donation.status === filterStatus;
        }
        
        return matchesSearch && matchesStatus;
    });

    const exportToCSV = () => {
        const headers = ['ID', 'Donor Name', 'Email', 'Phone', 'Book Title', 'Author', 'Condition', 'Quantity', 'Status', 'Date'];
        const rows = donations.map(d => [
            d.id, 
            d.donorName, 
            d.donorEmail, 
            d.donorPhone,
            d.bookTitle, 
            d.author || '',
            d.bookCondition,
            d.quantity,
            d.status,
            new Date(d.createdAt).toLocaleDateString()
        ]);
        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'book_donations.csv';
        a.click();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-gray-800 mb-2">Manage Book Donations</h1>
                <p className="text-gray-600">Track and manage all book donations received</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-gray-600 uppercase">Total Donations</p>
                        <Package className="text-purple-500 w-5 h-5" />
                    </div>
                    <h3 className="text-3xl font-black text-gray-800">{totalDonations}</h3>
                    <p className="text-xs text-green-600 font-semibold mt-1">Book collections</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-gray-600 uppercase">Total Books</p>
                        <BookOpen className="text-blue-500 w-5 h-5" />
                    </div>
                    <h3 className="text-3xl font-black text-gray-800">{totalBooks}</h3>
                    <p className="text-xs text-green-600 font-semibold mt-1">Individual books</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-gray-600 uppercase">Pending</p>
                        <Calendar className="text-yellow-500 w-5 h-5" />
                    </div>
                    <h3 className="text-3xl font-black text-gray-800">{pendingCount}</h3>
                    <p className="text-xs text-yellow-600 font-semibold mt-1">Awaiting review</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-gray-600 uppercase">Approved</p>
                        <Check className="text-green-500 w-5 h-5" />
                    </div>
                    <h3 className="text-3xl font-black text-gray-800">{approvedCount}</h3>
                    <p className="text-xs text-green-600 font-semibold mt-1">Ready for pickup</p>
                </div>
            </div>

            {/* Filters and Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Search */}
                    <div className="relative flex-1 w-full md:w-auto">
                        <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, email or book title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none font-semibold"
                    >
                        <option value="all">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Collected">Collected</option>
                    </select>

                    {/* Export Button */}
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all"
                    >
                        <Download className="w-5 h-5" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Donations Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">ID</th>
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">Donor</th>
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">Book Info</th>
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">Condition</th>
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">Qty</th>
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                                        Loading donations...
                                    </td>
                                </tr>
                            ) : filteredDonations.length > 0 ? (
                                filteredDonations.map((donation) => (
                                    <tr key={donation.id} className="hover:bg-purple-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                            #{donation.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                                    <BookOpen className="w-4 h-4 text-purple-600" />
                                                </div>
                                                <span className="font-semibold text-gray-900">{donation.donorName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div>{donation.donorEmail}</div>
                                            <div className="text-xs text-gray-500">{donation.donorPhone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{donation.bookTitle}</div>
                                            <div className="text-sm text-gray-500">{donation.author || 'Unknown author'}</div>
                                            <div className="text-xs text-gray-400">{donation.category}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800">
                                                {donation.bookCondition}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="font-black text-lg text-purple-600">
                                                {donation.quantity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                                donation.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                donation.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                donation.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {donation.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {new Date(donation.createdAt).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                {donation.status === 'Pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus(donation.id, 'Approved')}
                                                            className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                                                            title="Approve"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(donation.id, 'Rejected')}
                                                            className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                                            title="Reject"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {donation.status === 'Approved' && (
                                                    <button
                                                        onClick={() => updateStatus(donation.id, 'Collected')}
                                                        className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-xs font-bold hover:bg-blue-200"
                                                    >
                                                        Mark Collected
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                                        <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                        <p className="font-semibold">No donations found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageDonations;
