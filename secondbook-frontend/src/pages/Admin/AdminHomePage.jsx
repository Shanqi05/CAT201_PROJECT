import React, { useState, useEffect } from 'react';
import { BookOpen, Users, TrendingUp, CheckCircle, MoreVertical } from 'lucide-react';

const AdminHomePage = () => {
    // 1. Define State
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalEarnings: 0,
        activeUsers: 0,
        soldBooksCount: 0
    });
    const [recentBooks, setRecentBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. Fetch Data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('http://localhost:8080/CAT201_project/dashboard-stats', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setStats(data.stats);
                    setRecentBooks(data.recentBooks);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // 3. Stats Cards Config
    const statsCards = [
        {
            label: "Active Listings",
            value: stats.totalBooks,
            icon: <BookOpen />,
            color: "bg-cyan-500",
            increase: "Available Now"
        },
        {
            label: "Total Earnings",
            value: `RM ${stats.totalEarnings?.toFixed(2) || '0.00'}`,
            icon: <TrendingUp />,
            color: "bg-green-500",
            increase: "+8.4%"
        },
        {
            label: "Active Users",
            value: stats.activeUsers,
            icon: <Users />,
            color: "bg-purple-500",
            increase: "+3%"
        },
        {
            label: "Items Sold",
            value: stats.soldBooksCount,
            icon: <CheckCircle />,
            color: "bg-orange-500",
            increase: "Lifetime Sales"
        },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10">
            {/* Title Section */}
            <div>
                <h1 className="text-2xl font-black text-gray-800" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Dashboard Overview
                </h1>
                <p className="text-gray-500 text-sm">Here's what's happening today.</p>
            </div>

            {/* A. STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-lg mb-2`}>
                                {stat.icon}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">
                                {loading ? "..." : stat.value}
                            </h3>
                            <p className="text-[10px] text-green-600 font-bold mt-1 bg-green-50 inline-block px-2 py-0.5 rounded-full">
                                {stat.increase}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* B. MAIN TABLE AREA (Full Width now) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Recent Listings</h3>
                        <p className="text-xs text-gray-500">Latest books added to database</p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full"><MoreVertical size={18} /></button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold text-xs">
                        <tr>
                            <th className="px-6 py-4">Book Title</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Price</th>
                            {/* [CHANGE] Stock -> Status */}
                            <th className="px-6 py-4 text-right">Status</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="4" className="p-6 text-center text-gray-500">Loading...</td></tr>
                        ) : recentBooks.length === 0 ? (
                            <tr><td colSpan="4" className="p-6 text-center text-gray-500">No books found in database.</td></tr>
                        ) : (
                            recentBooks.map((book) => (
                                <tr key={book.bookId} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-3">
                                        <div className="w-8 h-10 flex-shrink-0 border border-gray-200 rounded overflow-hidden bg-gray-100">
                                            <img
                                                src={book.imagePath ? `http://localhost:8080/CAT201_project/uploads/${book.imagePath}` : "https://via.placeholder.com/150"}
                                                alt={book.title}
                                                onError={(e) => e.target.src = "https://via.placeholder.com/150"}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <span className="line-clamp-1 max-w-[200px]">{book.title}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{book.category || "General"}</td>
                                    <td className="px-6 py-4 font-mono text-gray-900 font-bold">RM {book.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right">
                                            <span className={`text-[10px] px-2 py-1 rounded uppercase font-bold tracking-wider ${
                                                book.status === 'Sold'
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-green-100 text-green-700"
                                            }`}>
                                                {book.status || 'Active'}
                                            </span>
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

export default AdminHomePage;