import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookPlus, Users, Package, BookOpen, ShoppingCart, TrendingUp, LogOut } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("userToken");
            localStorage.removeItem("userRole");
            localStorage.removeItem("registeredUser");
            navigate('/login');
        }
    };

    return (
        <div className="page-container">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-gray-900">Admin Control Panel</h1>
                <button 
                    onClick={handleLogout}
                    className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                    <LogOut size={18} className="mr-2" /> Logout
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Stat Cards */}
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-cyan-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-bold uppercase">Total Books</p>
                            <h3 className="text-2xl font-black">1,240</h3>
                        </div>
                        <Package className="text-cyan-500 w-10 h-10" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-bold uppercase">Total Orders</p>
                            <h3 className="text-2xl font-black">342</h3>
                        </div>
                        <ShoppingCart className="text-green-500 w-10 h-10" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-bold uppercase">Total Users</p>
                            <h3 className="text-2xl font-black">856</h3>
                        </div>
                        <Users className="text-purple-500 w-10 h-10" />
                    </div>
                </div>
            </div>

            {/* Management Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link 
                    to="/admin/manage-books"
                    className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition border-t-4 border-cyan-500 group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <BookOpen className="text-cyan-500 w-12 h-12" />
                        <div className="text-right">
                            <h3 className="text-2xl font-black text-gray-900 group-hover:text-cyan-600 transition">Manage Books</h3>
                            <p className="text-sm text-gray-500">Add, Edit, or Remove Books</p>
                        </div>
                    </div>
                    <p className="text-gray-600">View and manage your entire book inventory. Add new books, update existing listings, or remove sold items.</p>
                </Link>

                <Link 
                    to="/admin/manage-users"
                    className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition border-t-4 border-purple-500 group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <Users className="text-purple-500 w-12 h-12" />
                        <div className="text-right">
                            <h3 className="text-2xl font-black text-gray-900 group-hover:text-purple-600 transition">Manage Users</h3>
                            <p className="text-sm text-gray-500">View & Manage Customers</p>
                        </div>
                    </div>
                    <p className="text-gray-600">View customer accounts, manage permissions, and monitor user activity.</p>
                </Link>

                <Link 
                    to="/admin/view-orders"
                    className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition border-t-4 border-green-500 group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <ShoppingCart className="text-green-500 w-12 h-12" />
                        <div className="text-right">
                            <h3 className="text-2xl font-black text-gray-900 group-hover:text-green-600 transition">View Orders</h3>
                            <p className="text-sm text-gray-500">Track All Orders</p>
                        </div>
                    </div>
                    <p className="text-gray-600">Track all customer orders, manage shipments, and process refunds.</p>
                </Link>

                <Link 
                    to="/admin/analytics"
                    className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition border-t-4 border-orange-500 group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <TrendingUp className="text-orange-500 w-12 h-12" />
                        <div className="text-right">
                            <h3 className="text-2xl font-black text-gray-900 group-hover:text-orange-600 transition">Analytics</h3>
                            <p className="text-sm text-gray-500">Sales & Insights</p>
                        </div>
                    </div>
                    <p className="text-gray-600">View sales reports, revenue trends, and customer insights.</p>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;