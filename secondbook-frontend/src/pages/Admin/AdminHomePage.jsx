import React, { useState, useEffect } from 'react';
import PROMO_BANNER_PATH from '../../assets/images/promo_banner.png'; // 确保路径正确
import { BookOpen, Users, TrendingUp, AlertTriangle, MoreVertical } from 'lucide-react';

// Banners Data (目前保持静态，因为数据库还没做这个表)
const heroContent = [
    { title: "BookShelter", subtitle: "PRELOVED", status: "Active", img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000" },
    { title: "Essentials", subtitle: "ACCESSORIES", status: "Scheduled", img: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&q=80&w=2000" },
    { title: "Our Story", subtitle: "ABOUT US", status: "Inactive", img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=2000" }
];

const AdminHomePage = () => {
    // 1. 定义状态 (State)
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalEarnings: 0,
        activeUsers: 0,
        lowStockCount: 0
    });
    const [recentBooks, setRecentBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. 从后端 Fetch 数据
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('http://localhost:8080/CAT201_project/dashboard-stats', {
                    method: 'GET',
                    credentials: 'include' // 必须加这个，以防 session 问题
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Real Data:", data);
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

    // 3. 配置 Stats Cards 数据 (使用 real stats)
    // 注意：这里的 increase 暂时写死，因为数据库还没做"昨天"的数据对比
    const statsCards = [
        {
            label: "Total Books",
            value: stats.totalBooks,
            icon: <BookOpen />,
            color: "bg-cyan-500",
            increase: "+12%"
        },
        {
            label: "Total Earnings",
            value: `RM ${stats.totalEarnings.toFixed(2)}`, // 格式化金额
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
            label: "Low Stock Alert", // 替换了 Pending Reviews
            value: stats.lowStockCount,
            icon: <AlertTriangle />, // 换成了警告图标
            color: stats.lowStockCount > 0 ? "bg-orange-500" : "bg-gray-400",
            increase: "Action Needed"
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

            {/* A. STATS CARDS (Dynamic) */}
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

            {/* B. MAIN TABLES/WIDGETS AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Column 1: Recent Listings (Dynamic from DB) */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                                    <th className="px-6 py-4 text-right">Stock</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan="4" className="p-6 text-center text-gray-500">Loading...</td></tr>
                                ) : recentBooks.length === 0 ? (
                                    <tr><td colSpan="4" className="p-6 text-center text-gray-500">No books found in database.</td></tr>
                                ) : (
                                    recentBooks.map((book) => (
                                        <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-3">
                                                <div className="w-8 h-10 flex-shrink-0 border border-gray-200 rounded overflow-hidden bg-gray-100">
                                                     {/* 处理图片路径 */}
                                                     <img
                                                        src={book.imagePath ? `http://localhost:8080/CAT201_project/uploads/${book.imagePath}` : "https://via.placeholder.com/150"}
                                                        alt={book.title}
                                                        onError={(e) => e.target.src = "https://via.placeholder.com/150"}
                                                        className="w-full h-full object-cover"
                                                     />
                                                </div>
                                                <span className="line-clamp-1 max-w-[150px]">{book.title}</span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{book.category || "General"}</td>
                                            <td className="px-6 py-4 font-mono text-gray-900 font-bold">RM {book.price.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`text-[10px] px-2 py-1 rounded uppercase font-bold tracking-wider ${
                                                    book.stock < 5 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                                }`}>
                                                    {book.stock} Left
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Column 2: Banners (Static for now - kept from your original code) */}
                <div className="space-y-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800">Homepage Banners</h3>
                        </div>
                        <div className="space-y-3">
                            {heroContent.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-2 rounded-lg border border-gray-100 hover:border-cyan-400 transition-all bg-gray-50 group">
                                    <img src={item.img} alt="Banner" className="w-12 h-8 object-cover rounded shadow-sm" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-gray-900 truncate">{item.title}</h4>
                                        <p className="text-[10px] text-gray-500">{item.subtitle}</p>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${item.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <div className="relative h-20 rounded-lg overflow-hidden group cursor-pointer border border-gray-200">
                                <img src={PROMO_BANNER_PATH} alt="Promo" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="bg-black/70 text-white text-[10px] uppercase font-bold px-2 py-1 rounded backdrop-blur-sm">Edit Promo</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHomePage;