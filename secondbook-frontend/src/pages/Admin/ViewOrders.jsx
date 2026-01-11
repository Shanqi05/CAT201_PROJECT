import React, { useState, useEffect } from 'react';
import {
    Search, CheckCircle, Clock, XCircle, Truck,
    Eye, Filter, Package, Calendar, MapPin, Phone, Mail, Save
} from 'lucide-react';

const ViewOrders = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updateOrder, setUpdateOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:8080/CAT201_project/getOrders', {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                const rawData = await response.json();
                const formattedData = rawData.map(item => ({
                    id: `ORD-${item.id}`,
                    rawId: item.id,
                    customerName: item.customerName || 'Unknown',
                    email: item.email || 'N/A',
                    phone: item.phone || 'N/A',
                    address: item.address || 'No Address',
                    date: item.date ? new Date(item.date).toLocaleDateString() : 'N/A',
                    total: item.total || 0,
                    status: item.status || 'Processing',
                    products: item.products || []
                }));
                setOrders(formattedData);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const handleStatusUpdate = async () => {
        if (!updateOrder || !newStatus) return;

        try {
            const params = new URLSearchParams();
            params.append('orderId', updateOrder.rawId);
            params.append('status', newStatus);

            const response = await fetch('http://localhost:8080/CAT201_project/updateOrderStatus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                credentials: 'include',
                body: params
            });

            if (response.ok) {
                alert("Order updated!");
                fetchOrders();
                setUpdateOrder(null);
            } else {
                alert("Failed to update status.");
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    // Quick Cancel Handler
    const handleCancelOrder = async (order) => {
        if (!window.confirm("Are you sure you want to CANCEL this order? This will restore stock.")) return;

        try {
            const params = new URLSearchParams();
            params.append('orderId', order.rawId);
            params.append('status', 'Cancelled');

            const response = await fetch('http://localhost:8080/CAT201_project/updateOrderStatus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                credentials: 'include',
                body: params
            });

            if (response.ok) {
                alert("Order Cancelled and Stock Restored.");
                fetchOrders();
            } else {
                alert("Failed to cancel order.");
            }
        } catch (error) {
            console.error("Error cancelling order:", error);
        }
    };

    const openStatusModal = (order) => {
        setUpdateOrder(order);
        setNewStatus(order.status);
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            (order.id && order.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (order.email && order.email.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === 'all' ||
            (order.status && order.status.toLowerCase() === statusFilter.toLowerCase());
        return matchesSearch && matchesStatus;
    });

    // Statistics Calculation
    const totalOrders = orders.length;
    const processingCount = orders.filter(o => o.status.toLowerCase() === 'processing' || o.status.toLowerCase() === 'pending').length;
    const shippedCount = orders.filter(o => o.status.toLowerCase() === 'shipped').length;
    const deliveredCount = orders.filter(o => o.status.toLowerCase() === 'delivered').length;

    const getStatusBadge = (status) => {
        const s = (status || '').toLowerCase();
        switch(s) {
            case 'delivered': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit border border-green-200"><CheckCircle size={12} className="mr-1.5" /> Delivered</span>;
            case 'shipped': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit border border-blue-200"><Truck size={12} className="mr-1.5" /> Shipped</span>;
            case 'pending':
            case 'processing': return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit border border-yellow-200"><Clock size={12} className="mr-1.5" /> Processing</span>;
            case 'cancelled': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit border border-red-200"><XCircle size={12} className="mr-1.5" /> Cancelled</span>;
            default: return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit">{status}</span>;
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto w-full relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Order Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Track and manage customer orders.</p>
                </div>
            </div>

            {/* Statistics Cards [NEW] */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: "Total Orders", value: totalOrders, color: "bg-purple-500", icon: <Package/> },
                    { label: "Processing", value: processingCount, color: "bg-yellow-500", icon: <Clock/> },
                    { label: "Shipped", value: shippedCount, color: "bg-blue-500", icon: <Truck/> },
                    { label: "Delivered", value: deliveredCount, color: "bg-green-500", icon: <CheckCircle/> }
                ].map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm mb-2`}>
                                {React.cloneElement(stat.icon, { size: 20 })}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Search orders..." className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 outline-none text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="relative min-w-[200px]">
                    <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <select className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 outline-none text-sm appearance-none" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">All Status</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-5 font-bold text-gray-500 uppercase text-xs tracking-wider">Order ID</th>
                            <th className="p-5 font-bold text-gray-500 uppercase text-xs tracking-wider">Customer</th>
                            <th className="p-5 font-bold text-gray-500 uppercase text-xs tracking-wider">Date</th>
                            <th className="p-5 font-bold text-gray-500 uppercase text-xs tracking-wider">Items</th>
                            <th className="p-5 font-bold text-gray-500 uppercase text-xs tracking-wider">Total</th>
                            <th className="p-5 font-bold text-gray-500 uppercase text-xs tracking-wider">Status</th>
                            <th className="p-5 font-bold text-gray-500 uppercase text-xs tracking-wider text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {filteredOrders.length === 0 ? (
                            <tr><td colSpan="7" className="p-12 text-center text-gray-500">No orders found.</td></tr>
                        ) : (
                            filteredOrders.map((order) => {
                                const isCancelled = order.status.toLowerCase() === 'cancelled';
                                const isDelivered = order.status.toLowerCase() === 'delivered';
                                const isFinalized = isCancelled || isDelivered;
                                return (
                                    <tr key={order.rawId} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="p-5"><span className="font-mono text-xs font-bold text-black bg-gray-100 px-2 py-1 rounded">{order.id}</span></td>
                                        <td className="p-5">
                                            <div><p className="font-bold text-gray-900">{order.customerName}</p><p className="text-xs text-gray-500">{order.email}</p></div>
                                        </td>
                                        <td className="p-5 text-sm text-gray-600">{order.date}</td>
                                        <td className="p-5 text-sm text-gray-600">{order.products.length} items</td>
                                        <td className="p-5 font-bold text-gray-900">RM {order.total.toFixed(2)}</td>
                                        <td className="p-5">{getStatusBadge(order.status)}</td>
                                        <td className="p-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                {/* Edit Status Button (Disabled if Finalized) */}
                                                {!isFinalized && (
                                                    <button
                                                        onClick={() => openStatusModal(order)}
                                                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                                                        title="Update Status"
                                                    >
                                                        <Truck size={18} />
                                                    </button>
                                                )}

                                                {/* Cancel Button (Disabled if Finalized) */}
                                                {!isFinalized && (
                                                    <button
                                                        onClick={() => handleCancelOrder(order)}
                                                        className="p-2 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                        title="Cancel Order"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                )}

                                                {/* View Button */}
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors border border-transparent hover:border-cyan-100"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-black text-gray-900" style={{fontFamily: 'Playfair Display, serif'}}>Order Details</h2>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={24} /></button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</h3>
                                    <div className="space-y-1">
                                        <p className="font-bold text-gray-900">{selectedOrder.customerName}</p>
                                        <div className="flex items-center gap-2 text-sm text-gray-500"><Mail size={14}/> {selectedOrder.email}</div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500"><Phone size={14}/> {selectedOrder.phone}</div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Shipping</h3>
                                    <div className="flex items-start gap-2">
                                        <MapPin size={16} className="text-gray-400 mt-1 flex-shrink-0"/>
                                        <p className="text-sm text-gray-600 leading-snug">{selectedOrder.address}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Items Purchased</h3>
                                <div className="border border-gray-100 rounded-xl overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                                        <tr><th className="px-4 py-3">Product</th><th className="px-4 py-3 text-right">Price</th></tr>
                                        </thead>
                                        <tbody>
                                        {selectedOrder.products.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="px-4 py-3 flex items-center gap-3">
                                                    <img src={item.image} className="w-10 h-10 rounded bg-gray-100 object-cover" alt="" onError={(e)=>e.target.src="https://via.placeholder.com/150"}/>
                                                    <div>
                                                        <span className="font-bold block text-gray-800">{item.title}</span>
                                                        <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right font-bold text-gray-900">RM {(item.price || 0).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Update Modal */}
            {updateOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100 p-6">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-600">
                                <Truck size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Update Order Status</h3>
                            <p className="text-sm text-gray-500 font-mono mt-1">{updateOrder.id}</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select New Status</label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-gray-200 text-sm font-semibold outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-50"
                                >
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    {/* Removed Cancelled from here as it's a separate action */}
                                </select>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setUpdateOrder(null)}
                                    className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleStatusUpdate}
                                    className="flex-1 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-shadow shadow-lg"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewOrders;