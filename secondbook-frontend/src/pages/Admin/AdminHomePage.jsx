import React, { useState, useEffect } from 'react';
import { BookOpen, Users, TrendingUp, CheckCircle, MoreVertical, ShoppingBag } from 'lucide-react';

const AdminHomePage = () => {
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalEarnings: 0,
        activeUsers: 0,
        soldBooksCount: 0 // Previously lowStockCount
    });
    const [recentBooks, setRecentBooks] = useState([]);
    const [recentAccessories, setRecentAccessories] = useState([]); // [NEW]
    const [loading, setLoading] = useState(true);

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
                    setRecentBooks(data.recentBooks || []);
                    setRecentAccessories(data.recentAccessories || []); // [NEW]
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statsCards = [
        { label: "Active Listings", value: stats.totalBooks, icon: <BookOpen />, color: "bg-cyan-500", increase: "Available Now" },
        { label: "Total Earnings", value: `RM ${stats.totalEarnings?.toFixed(2) || '0.00'}`, icon: <TrendingUp />, color: "bg-green-500", increase: "+8.4%" },
        { label: "Active Users", value: stats.activeUsers, icon: <Users />, color: "bg-purple-500", increase: "+3%" },
        { label: "Items Sold", value: stats.lowStockCount || stats.soldBooksCount || 0, icon: <CheckCircle />, color: "bg-orange-500", increase: "Lifetime Sales" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-gray-800" style={{ fontFamily: 'Playfair Display, serif' }}>Dashboard Overview</h1>
                <p className="text-gray-500 text-sm">Here's what's happening today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-lg mb-2`}>{stat.icon}</div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">{loading ? "..." : stat.value}</h3>
                            <p className="text-[10px] text-green-600 font-bold mt-1 bg-green-50 inline-block px-2 py-0.5 rounded-full">{stat.increase}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* MAIN CONTENT GRID: 2 Columns for Books, 1 for Accessories */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. RECENT BOOKS (Wider Column) */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Recent Books</h3>
                            <p className="text-xs text-gray-500">Latest additions to the library</p>
                        </div>
                        <BookOpen size={18} className="text-gray-400"/>
                    </div>

                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold text-xs">
                            <tr>
                                <th className="px-6 py-4">Book Title</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4 text-right">Status</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="3" className="p-6 text-center text-gray-500">Loading...</td></tr>
                            ) : recentBooks.length === 0 ? (
                                <tr><td colSpan="3" className="p-6 text-center text-gray-500">No books found.</td></tr>
                            ) : (
                                recentBooks.map((book) => (
                                    <tr key={book.bookId || book.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-10 flex-shrink-0 border border-gray-200 rounded overflow-hidden bg-gray-100 mt-1">
                                                    <img
                                                        src={book.imagePath ? `http://localhost:8080/CAT201_project/uploads/${book.imagePath}` : "https://via.placeholder.com/150"}
                                                        alt={book.title}
                                                        onError={(e) => e.target.src = "https://via.placeholder.com/150"}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                {/* [FIX] Text Wrapping Logic */}
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-bold text-gray-900 text-sm leading-snug break-words whitespace-normal">
                                                        {book.title}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500 mt-0.5">{book.category || "General"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-gray-900 font-bold whitespace-nowrap">
                                            RM {book.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                                <span className={`text-[10px] px-2 py-1 rounded uppercase font-bold tracking-wider ${
                                                    book.status === 'Sold' ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
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

                {/* 2. RECENT ACCESSORIES (Narrower Column) */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Accessories</h3>
                            <p className="text-xs text-gray-500">New merchandise</p>
                        </div>
                        <ShoppingBag size={18} className="text-gray-400"/>
                    </div>

                    <div className="overflow-y-auto flex-1 p-0 max-h-[400px]">
                        {loading ? (
                            <p className="p-6 text-center text-gray-500 text-sm">Loading...</p>
                        ) : recentAccessories.length === 0 ? (
                            <p className="p-6 text-center text-gray-500 text-sm">No accessories found.</p>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {recentAccessories.map((item) => (
                                    <div key={item.accessoryId} className="p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                                            {item.imagePath ? (
                                                <img
                                                    src={item.imagePath.startsWith('http') ? item.imagePath : `http://localhost:8080/CAT201_project/${item.imagePath}`}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => e.target.src = "https://via.placeholder.com/150"}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <ShoppingBag size={16} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            {/* [FIX] Text Wrapping for Accessories too */}
                                            <h4 className="text-sm font-bold text-gray-900 leading-tight whitespace-normal break-words">
                                                {item.title}
                                            </h4>
                                            <p className="text-[10px] text-gray-500 mt-0.5">{item.category}</p>
                                        </div>
                                        <div className="text-right whitespace-nowrap">
                                            <span className="block text-xs font-bold text-cyan-600">RM {item.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Footer Link */}
                    <div className="p-4 border-t border-gray-100 text-center bg-gray-50">
                        <a href="/admin/accessories" className="text-xs font-bold text-gray-500 hover:text-black uppercase tracking-wider transition-colors">
                            View All Items
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminHomePage;