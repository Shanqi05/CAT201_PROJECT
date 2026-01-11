import React, { useState, useEffect } from 'react';
import { BookOpen, Users, TrendingUp, CheckCircle, ShoppingBag, Package, Heart } from 'lucide-react';

const AdminHomePage = () => {
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalEarnings: 0,
        activeUsers: 0,
        soldBooksCount: 0
    });
    const [recentBooks, setRecentBooks] = useState([]);
    const [recentAccessories, setRecentAccessories] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [recentDonations, setRecentDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Fetch Stats & Items
                const statsResponse = await fetch('http://localhost:8080/CAT201_project/dashboard-stats', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (statsResponse.ok) {
                    const data = await statsResponse.json();
                    setStats(data.stats);
                }

                // 2. Fetch Recent Books
                const booksResponse = await fetch('http://localhost:8080/CAT201_project/getBooks');
                if (booksResponse.ok) {
                    const booksData = await booksResponse.json();
                    setRecentBooks(booksData.slice(0, 5));
                }

                // 3. Fetch Recent Accessories
                const accResponse = await fetch('http://localhost:8080/CAT201_project/getAccessories');
                if (accResponse.ok) {
                    const accData = await accResponse.json();
                    setRecentAccessories(accData.slice(0, 5));
                }

                // 4. Fetch Recent Orders
                const ordersResponse = await fetch('http://localhost:8080/CAT201_project/getOrders', {
                    method: 'GET',
                    credentials: 'include'
                });
                if (ordersResponse.ok) {
                    const ordersData = await ordersResponse.json();
                    setRecentOrders(ordersData.slice(0, 5));
                }

                // 5. Fetch Recent Donations
                const donationsResponse = await fetch('http://localhost:8080/CAT201_project/getDonatedBooks', {
                    method: 'GET',
                    credentials: 'include'
                });
                if (donationsResponse.ok) {
                    const donationsData = await donationsResponse.json();
                    setRecentDonations(donationsData.slice(0, 5));
                }

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
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
        { label: "Items Sold", value: stats.soldBooksCount || 0, icon: <CheckCircle />, color: "bg-orange-500", increase: "Lifetime Sales" },
    ];

    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'delivered':
            case 'approved': return 'bg-green-100 text-green-700';

            case 'collected':
            case 'shipped': return 'bg-blue-100 text-blue-700';

            case 'processing':
            case 'pending': return 'bg-yellow-100 text-yellow-700';

            case 'cancelled':
            case 'rejected': return 'bg-red-100 text-red-700';

            default: return 'bg-gray-100 text-gray-700';
        }
    };

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

            {/* ROW 1: RECENT BOOKS & ACCESSORIES */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. Recent Books */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Recent Books</h3>
                            <p className="text-xs text-gray-500">Latest additions</p>
                        </div>
                        <BookOpen size={18} className="text-gray-400"/>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold text-xs">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Condition</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4 text-right">Status</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {recentBooks.length === 0 ? <tr><td colSpan="4" className="p-6 text-center text-gray-500">No books found.</td></tr> : (
                                recentBooks.map((book, index) => (
                                    <tr key={book.bookId || index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {/* [FIX] Check for external URLs (Supabase) vs Local uploads */}
                                                <img
                                                    src={book.imagePath ? (
                                                        book.imagePath.startsWith('http')
                                                            ? book.imagePath
                                                            : `http://localhost:8080/CAT201_project/uploads/${book.imagePath}`
                                                    ) : ""}
                                                    className="w-8 h-10 rounded object-cover bg-gray-100"
                                                    onError={(e) => e.target.style.display = 'none'}
                                                    alt=""
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-bold text-gray-900 text-sm whitespace-normal break-words leading-tight">
                                                        {book.title}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-xs text-gray-600 font-medium">
                                            {book.condition || 'N/A'}
                                        </td>

                                        <td className="px-6 py-4 font-mono font-bold text-cyan-600">RM {book.price.toFixed(2)}</td>

                                        <td className="px-6 py-4 text-right">
                                            <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold ${
                                                book.status === 'Sold'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-green-100 text-green-700'
                                            }`}>
                                                {book.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-3 border-t border-gray-100 text-center bg-gray-50 mt-auto">
                        <a href="/admin/books" className="text-xs font-bold text-gray-500 hover:text-black uppercase tracking-wider transition-colors">
                            View All Books
                        </a>
                    </div>
                </div>

                {/* 2. Recent Accessories */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Accessories</h3>
                            <p className="text-xs text-gray-500">New items</p>
                        </div>
                        <ShoppingBag size={18} className="text-gray-400"/>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold text-xs">
                            <tr>
                                <th className="px-6 py-4">Item</th>
                                <th className="px-6 py-4 text-right">Price</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {recentAccessories.length === 0 ? (
                                <tr>
                                    <td colSpan="2" className="p-6 text-center text-gray-500">No accessories found.</td>
                                </tr>
                            ) : (
                                recentAccessories.map((item, index) => (
                                    <tr key={item.accessoryId || index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                                                    {/* [FIX] Check for external URLs here too for consistency */}
                                                    <img
                                                        src={item.imagePath ? (
                                                            item.imagePath.startsWith('http')
                                                                ? item.imagePath
                                                                : `http://localhost:8080/CAT201_project/uploads/${item.imagePath}`
                                                        ) : ""}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {e.target.style.display='none'}}
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-sm font-bold text-gray-900 whitespace-normal break-words leading-tight">{item.title}</h4>
                                                    <p className="text-[10px] text-gray-500">{item.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-cyan-600 whitespace-nowrap">
                                            RM {item.price.toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-gray-100 text-center bg-gray-50 mt-auto">
                        <a href="/admin/accessories" className="text-xs font-bold text-gray-500 hover:text-black uppercase tracking-wider transition-colors">
                            View All Items
                        </a>
                    </div>
                </div>
            </div>

            {/* ROW 2: ORDERS & DONATIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 3. Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
                            <p className="text-xs text-gray-500">Latest customer purchases</p>
                        </div>
                        <Package size={18} className="text-gray-400"/>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold text-xs">
                            <tr>
                                <th className="px-6 py-3">Order ID</th>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3">Total</th>
                                <th className="px-6 py-3 text-right">Status</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {recentOrders.length === 0 ? <tr><td colSpan="4" className="p-6 text-center text-gray-500">No orders yet.</td></tr> : (
                                recentOrders.map((order, index) => (
                                    <tr key={order.id || index} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 font-mono text-xs font-bold">ORD-{order.id}</td>
                                        <td className="px-6 py-3">
                                            <p className="font-bold text-gray-900 text-xs">{order.customerName}</p>
                                            <p className="text-[10px] text-gray-400">{order.email}</p>
                                        </td>
                                        <td className="px-6 py-3 font-bold text-cyan-600">RM {order.total.toFixed(2)}</td>
                                        <td className="px-6 py-3 text-right">
                                                <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wider ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-3 border-t border-gray-100 text-center bg-gray-50 mt-auto">
                        <a href="/admin/manage-orders" className="text-xs font-bold text-gray-500 hover:text-black uppercase tracking-wider transition-colors">View All Orders</a>
                    </div>
                </div>

                {/* 4. Recent Donations */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Recent Donations</h3>
                            <p className="text-xs text-gray-500">Latest book contributions</p>
                        </div>
                        <Heart size={18} className="text-gray-400"/>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold text-xs">
                            <tr>
                                <th className="px-6 py-3">Donor</th>
                                <th className="px-6 py-3">Book Info</th>
                                <th className="px-6 py-3 text-right">Status</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {recentDonations.length === 0 ? <tr><td colSpan="3" className="p-6 text-center text-gray-500">No donations yet.</td></tr> : (
                                recentDonations.map((donation, index) => {
                                    const displayStatus = donation.approveCollectStatus || 'Pending';
                                    return (
                                        <tr key={donation.donatedBookId || index} className="hover:bg-gray-50">
                                            <td className="px-6 py-3">
                                                <p className="font-bold text-gray-900 text-xs">{donation.donorName || "Unknown"}</p>
                                                <p className="text-[10px] text-gray-400">{donation.donorEmail}</p>
                                            </td>
                                            <td className="px-6 py-3">
                                                <p className="font-bold text-gray-900 text-xs">{donation.title}</p>
                                                <p className="text-[10px] text-gray-400">{donation.author}</p>
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                    <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wider ${getStatusColor(displayStatus)}`}>
                                                        {displayStatus}
                                                    </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-3 border-t border-gray-100 text-center bg-gray-50 mt-auto">
                        <a href="/admin/donations" className="text-xs font-bold text-gray-500 hover:text-black uppercase tracking-wider transition-colors">View All Donations</a>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminHomePage;