import React from 'react';
import { LayoutDashboard, BookPlus, Users, Package } from 'lucide-react';

const AdminDashboard = () => {
    return (
        <div className="page-container">
            <h1 className="text-3xl font-black text-gray-900 mb-8">Admin Control Panel</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stat Card */}
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-cyan-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-bold uppercase">Total Books</p>
                            <h3 className="text-2xl font-black">1,240</h3>
                        </div>
                        <Package className="text-cyan-500 w-10 h-10" />
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md">
                    <h3 className="font-bold mb-4">Quick Actions</h3>
                    <div className="flex gap-4">
                        <button className="flex items-center bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700">
                            <BookPlus size={18} className="mr-2" /> Add New Book
                        </button>
                        <button className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                            <Users size={18} className="mr-2" /> View Customers
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;