import React, { useEffect, useState } from 'react';
import {
    BookOpen, ShoppingBag, TrendingUp, Activity,
    ArrowUpRight, ArrowDownRight, Calendar, Download
} from 'lucide-react';

const Analytics = () => {
    // 1. State Management
    const [statsData, setStatsData] = useState({
        totalBooks: 0,
        totalAccessories: 0,
        totalEarnings: 0 // Note: Ensure your Java backend sends 'totalEarnings' or 'totalRevenue' inside 'stats'
    });
    const [loading, setLoading] = useState(true);

    // 2. Fetch Real Backend Data
    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await fetch('http://localhost:8080/CAT201_project/dashboard-stats', {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log("Analytics Data:", data);

                    // >>> FIX: Merge data.stats with the outer totalAccessories <<<
                    setStatsData({
                        ...data.stats,                     // Spread existing stats (books, orders/earnings)
                        totalAccessories: data.totalAccessories // Manually grab totalAccessories from the outer layer
                    });
                }
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    // 3. Construct Stats Array for Display (Mixed Real + Mock Data)
    const statsCards = [
        {
            label: "Total Books",
            value: loading ? "..." : statsData.totalBooks, // [Real Data]
            change: "+12%", // [Mock Trend] - No historical data implemented yet
            trend: "up",
            icon: <BookOpen className="text-white" size={24} />,
            color: "bg-blue-500"
        },
        {
            label: "Total Accessories",
            value: loading ? "..." : statsData.totalAccessories, // [Real Data] - Now fetching correctly
            change: "+5.2%",
            trend: "up",
            icon: <ShoppingBag className="text-white" size={24} />,
            color: "bg-purple-500"
        },
        {
            label: "Total Revenue",
            // Note: Make sure the JSON key matches 'totalEarnings' or change this to statsData.totalRevenue
            value: loading ? "..." : `RM ${statsData.totalEarnings ? statsData.totalEarnings.toFixed(2) : "0.00"}`,
            change: "+8.4%",
            trend: "up",
            icon: <TrendingUp className="text-white" size={24} />,
            color: "bg-green-500"
        },
        {
            label: "Conversion Rate",
            value: "3.2%", // [Fully Mocked] - Hard to calculate without session tracking, used for demo
            change: "-0.1%",
            trend: "down",
            icon: <Activity className="text-white" size={24} />,
            color: "bg-orange-500"
        }
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10">

            {/* 1. Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Analytics Overview
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Monitor your store's performance and inventory metrics.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                        <Calendar size={16} />
                        <span>Last 30 Days</span>
                    </button>
                    <button
                        onClick={() => alert("Export feature is available in Pro version.")}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-cyan-400 border border-black rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg"
                    >
                        <Download size={16} />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            {/* 2. Key Metrics Grid (REAL DATA) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`${stat.color} p-3 rounded-xl shadow-lg shadow-gray-200`}>
                                {stat.icon}
                            </div>
                            <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
                                stat.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                            }`}>
                                {stat.trend === 'up' ? <ArrowUpRight size={14} className="mr-1"/> : <ArrowDownRight size={14} className="mr-1"/>}
                                {stat.change}
                            </span>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-2xl font-black text-gray-900 mt-1">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Charts Area (STATIC / MOCKED DATA for Visuals) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Revenue Chart Mockup */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="font-bold text-gray-800">Revenue Trends (Projected)</h3>
                            <p className="text-[10px] text-gray-400">Based on historical projection data</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
                            <span className="text-xs text-gray-500">Books</span>
                            <span className="w-3 h-3 rounded-full bg-purple-500 ml-2"></span>
                            <span className="text-xs text-gray-500">Accessories</span>
                        </div>
                    </div>
                    {/* CSS-only Bar Chart Visualization */}
                    <div className="flex items-end justify-between h-64 gap-2 pt-4 px-2">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((height, i) => (
                            <div key={i} className="w-full h-full bg-gray-50 rounded-t-lg relative group overflow-hidden">
                                <div className="absolute inset-0 bg-gray-100 rounded-t-lg"></div>
                                {/* Books Bar */}
                                <div
                                    className="absolute bottom-0 w-full bg-cyan-500 rounded-t-lg transition-all duration-500 hover:bg-cyan-400 z-10"
                                    style={{ height: `${height}%` }}
                                >
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-[10px] font-bold py-1 px-2 rounded transition-opacity whitespace-nowrap z-20">
                                        ${height}k
                                    </div>
                                </div>
                                {/* Accessories Bar */}
                                <div
                                    className="absolute bottom-0 w-full bg-purple-500 rounded-t-lg opacity-80 z-0"
                                    style={{ height: `${height * 0.4}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-400 font-bold uppercase">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                        <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                </div>

                {/* Sales by Category Mockup */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-800 mb-6">Sales Distribution</h3>

                    <div className="relative w-48 h-48 mx-auto mb-8">
                        <div className="w-full h-full rounded-full border-[16px] border-cyan-500 border-r-purple-500 border-b-gray-200 transform rotate-45"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-gray-900">72%</span>
                            <span className="text-xs text-gray-500">Books</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                                <span className="text-sm font-bold text-gray-700">Books</span>
                            </div>
                            <span className="text-sm font-bold text-gray-900">72%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                <span className="text-sm font-bold text-gray-700">Accessories</span>
                            </div>
                            <span className="text-sm font-bold text-gray-900">18%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                                <span className="text-sm font-bold text-gray-700">Others</span>
                            </div>
                            <span className="text-sm font-bold text-gray-900">10%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;