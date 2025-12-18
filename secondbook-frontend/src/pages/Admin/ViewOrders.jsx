import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Package, CheckCircle, Clock, XCircle, Truck } from 'lucide-react';

const ViewOrders = () => {
    // Mock orders data
    const [orders] = useState([
        {
            id: 'ORD-001',
            customerName: 'John Doe',
            email: 'john@example.com',
            date: '2025-12-15',
            items: 3,
            total: 45.99,
            status: 'delivered'
        },
        {
            id: 'ORD-002',
            customerName: 'Jane Smith',
            email: 'jane@example.com',
            date: '2025-12-16',
            items: 2,
            total: 32.50,
            status: 'shipped'
        },
        {
            id: 'ORD-003',
            customerName: 'Bob Johnson',
            email: 'bob@example.com',
            date: '2025-12-17',
            items: 5,
            total: 78.25,
            status: 'processing'
        },
        {
            id: 'ORD-004',
            customerName: 'Alice Williams',
            email: 'alice@example.com',
            date: '2025-12-18',
            items: 1,
            total: 15.99,
            status: 'cancelled'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        switch(status) {
            case 'delivered':
                return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit">
                    <CheckCircle size={12} className="mr-1" /> Delivered
                </span>;
            case 'shipped':
                return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit">
                    <Truck size={12} className="mr-1" /> Shipped
                </span>;
            case 'processing':
                return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit">
                    <Clock size={12} className="mr-1" /> Processing
                </span>;
            case 'cancelled':
                return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit">
                    <XCircle size={12} className="mr-1" /> Cancelled
                </span>;
            default:
                return status;
        }
    };

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

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
                    <h1 className="text-3xl font-black text-gray-900">View Orders</h1>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-purple-500">
                    <p className="text-sm text-gray-500 font-bold uppercase">Total Orders</p>
                    <h3 className="text-2xl font-black">{orders.length}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-green-500">
                    <p className="text-sm text-gray-500 font-bold uppercase">Delivered</p>
                    <h3 className="text-2xl font-black">{deliveredOrders}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-yellow-500">
                    <p className="text-sm text-gray-500 font-bold uppercase">Processing</p>
                    <h3 className="text-2xl font-black">{orders.filter(o => o.status === 'processing').length}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-cyan-500">
                    <p className="text-sm text-gray-500 font-bold uppercase">Total Revenue</p>
                    <h3 className="text-2xl font-black">${totalRevenue.toFixed(2)}</h3>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by order ID, customer name, or email..."
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-bold text-gray-600 uppercase text-xs">Order ID</th>
                            <th className="p-4 font-bold text-gray-600 uppercase text-xs">Customer</th>
                            <th className="p-4 font-bold text-gray-600 uppercase text-xs">Date</th>
                            <th className="p-4 font-bold text-gray-600 uppercase text-xs">Items</th>
                            <th className="p-4 font-bold text-gray-600 uppercase text-xs">Total</th>
                            <th className="p-4 font-bold text-gray-600 uppercase text-xs">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-500">
                                    No orders found
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4">
                                        <span className="font-mono text-sm font-bold text-cyan-600">{order.id}</span>
                                    </td>
                                    <td className="p-4">
                                        <div>
                                            <p className="font-bold text-gray-800">{order.customerName}</p>
                                            <p className="text-xs text-gray-500">{order.email}</p>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{order.date}</td>
                                    <td className="p-4 text-sm text-gray-600">{order.items} items</td>
                                    <td className="p-4 font-bold text-cyan-600">${order.total.toFixed(2)}</td>
                                    <td className="p-4">
                                        {getStatusBadge(order.status)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 text-sm text-gray-500">
                Showing {filteredOrders.length} of {orders.length} orders
            </div>
        </div>
    );
};

export default ViewOrders;
