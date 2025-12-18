import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, DollarSign, ShoppingCart, Users, BookOpen, Package } from 'lucide-react';

const Analytics = () => {
    // Mock analytics data
    const stats = {
        totalRevenue: 15780.50,
        totalOrders: 342,
        totalCustomers: 856,
        totalBooks: 1240,
        avgOrderValue: 46.14,
        conversionRate: 3.2
    };

    const recentSales = [
        { month: 'Jan', revenue: 2500, orders: 58 },
        { month: 'Feb', revenue: 2800, orders: 64 },
        { month: 'Mar', revenue: 2300, orders: 52 },
        { month: 'Apr', revenue: 3100, orders: 71 },
        { month: 'May', revenue: 2900, orders: 66 },
        { month: 'Jun', revenue: 3200, orders: 73 }
    ];

    const topCategories = [
        { category: 'Fiction', sales: 145, percentage: 35 },
        { category: 'Non-Fiction', sales: 98, percentage: 24 },
        { category: 'Science', sales: 76, percentage: 18 },
        { category: 'History', sales: 54, percentage: 13 },
        { category: 'Biography', sales: 42, percentage: 10 }
    ];

    return (
        <div className="page-container">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <Link 
                        to="/admin-dashboard"
                        className="flex items-center text-gray-600 hover:text-cyan-600 transition"
                    >
                        <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-black text-gray-900">Analytics Dashboard</h1>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-2">
                        <DollarSign className="text-green-500 w-8 h-8" />
                    </div>
                    <p className="text-sm text-gray-500 font-bold uppercase">Total Revenue</p>
                    <h3 className="text-2xl font-black">${stats.totalRevenue.toLocaleString()}</h3>
                    <p className="text-xs text-green-600 mt-1">+12.5% from last month</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                    <div className="flex items-center justify-between mb-2">
                        <ShoppingCart className="text-purple-500 w-8 h-8" />
                    </div>
                    <p className="text-sm text-gray-500 font-bold uppercase">Total Orders</p>
                    <h3 className="text-2xl font-black">{stats.totalOrders}</h3>
                    <p className="text-xs text-purple-600 mt-1">+8.3% from last month</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-cyan-500">
                    <div className="flex items-center justify-between mb-2">
                        <Users className="text-cyan-500 w-8 h-8" />
                    </div>
                    <p className="text-sm text-gray-500 font-bold uppercase">Customers</p>
                    <h3 className="text-2xl font-black">{stats.totalCustomers}</h3>
                    <p className="text-xs text-cyan-600 mt-1">+15.7% from last month</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500">
                    <div className="flex items-center justify-between mb-2">
                        <Package className="text-orange-500 w-8 h-8" />
                    </div>
                    <p className="text-sm text-gray-500 font-bold uppercase">Total Books</p>
                    <h3 className="text-2xl font-black">{stats.totalBooks}</h3>
                    <p className="text-xs text-orange-600 mt-1">+3.2% from last month</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                    <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="text-blue-500 w-8 h-8" />
                    </div>
                    <p className="text-sm text-gray-500 font-bold uppercase">Avg Order Value</p>
                    <h3 className="text-2xl font-black">${stats.avgOrderValue}</h3>
                    <p className="text-xs text-blue-600 mt-1">+5.1% from last month</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-pink-500">
                    <div className="flex items-center justify-between mb-2">
                        <BookOpen className="text-pink-500 w-8 h-8" />
                    </div>
                    <p className="text-sm text-gray-500 font-bold uppercase">Conversion Rate</p>
                    <h3 className="text-2xl font-black">{stats.conversionRate}%</h3>
                    <p className="text-xs text-pink-600 mt-1">+0.4% from last month</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Revenue Trend (Last 6 Months)</h3>
                    <div className="space-y-4">
                        {recentSales.map((month, index) => (
                            <div key={index}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-semibold text-gray-700">{month.month}</span>
                                    <span className="font-bold text-cyan-600">${month.revenue.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div 
                                        className="bg-gradient-to-r from-cyan-400 to-cyan-600 h-3 rounded-full transition-all"
                                        style={{ width: `${(month.revenue / 3500) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{month.orders} orders</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Categories */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Top Selling Categories</h3>
                    <div className="space-y-6">
                        {topCategories.map((cat, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm mr-3">
                                            {index + 1}
                                        </div>
                                        <span className="font-semibold text-gray-700">{cat.category}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold text-purple-600">{cat.sales} sales</span>
                                        <p className="text-xs text-gray-500">{cat.percentage}%</p>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all"
                                        style={{ width: `${cat.percentage * 2.5}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 bg-cyan-50 p-6 rounded-xl border border-cyan-200">
                <p className="text-sm text-cyan-800">
                    <strong>Note:</strong> Analytics data is updated in real-time. Use these insights to make data-driven decisions about inventory, pricing, and marketing strategies.
                </p>
            </div>
        </div>
    );
};

export default Analytics;
