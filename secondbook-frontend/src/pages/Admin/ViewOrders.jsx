import React, { useState } from 'react';
import {
    Search, Package, CheckCircle, Clock, XCircle, Truck,
    Eye, Filter, Download, DollarSign, Calendar, X, MapPin, Phone, CreditCard
} from 'lucide-react';

const ViewOrders = () => {
    // 1. 扩展模拟数据 (为了让弹窗有内容看，我加了 products 和 address)
    const [orders] = useState([
        {
            id: 'ORD-001',
            customerName: 'John Doe',
            email: 'john@example.com',
            phone: '+60 12-345 6789',
            address: '123 Jalan Ampang, 50450 Kuala Lumpur',
            date: '2025-12-15',
            items: 3,
            total: 45.99,
            status: 'delivered',
            paymentMethod: 'Credit Card',
            products: [
                { name: 'The Midnight Library', price: 14.50, qty: 1, img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=100' },
                { name: 'Vintage Metal Bookmark', price: 5.90, qty: 2, img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=100' }
            ]
        },
        {
            id: 'ORD-002',
            customerName: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+60 17-987 6543',
            address: '45 Green Lane, 11600 Penang',
            date: '2025-12-16',
            items: 1,
            total: 18.99,
            status: 'shipped',
            paymentMethod: 'PayPal',
            products: [
                { name: 'Sapiens: A Brief History', price: 18.99, qty: 1, img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=100' }
            ]
        },
        // ... 其他数据保持格式一致
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // 2. 新增状态：控制弹窗
    const [selectedOrder, setSelectedOrder] = useState(null); // 存当前点击的订单对象

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // 辅助函数：获取状态标签
    const getStatusBadge = (status) => {
        switch(status) {
            case 'delivered':
                return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit border border-green-200"><CheckCircle size={12} className="mr-1.5" /> Delivered</span>;
            case 'shipped':
                return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit border border-blue-200"><Truck size={12} className="mr-1.5" /> Shipped</span>;
            case 'processing':
                return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit border border-yellow-200"><Clock size={12} className="mr-1.5" /> Processing</span>;
            case 'cancelled':
                return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit border border-red-200"><XCircle size={12} className="mr-1.5" /> Cancelled</span>;
            default: return status;
        }
    };

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

    return (
        <div className="p-8 max-w-7xl mx-auto w-full relative">

            {/* Header & Controls (保持不变) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Order Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Track and manage customer orders and shipments.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-black text-cyan-400 border border-black rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg">
                    <Download size={16} /> <span>Export CSV</span>
                </button>
            </div>

            {/* Stats Cards (保持不变) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Orders</p><h3 className="text-2xl font-black text-gray-900 mt-1">{orders.length}</h3></div>
                    <div className="bg-purple-50 p-3 rounded-xl text-purple-600"><Package size={24} /></div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Delivered</p><h3 className="text-2xl font-black text-gray-900 mt-1">{deliveredOrders}</h3></div>
                    <div className="bg-green-50 p-3 rounded-xl text-green-600"><CheckCircle size={24} /></div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Pending</p><h3 className="text-2xl font-black text-gray-900 mt-1">{orders.filter(o => o.status === 'processing').length}</h3></div>
                    <div className="bg-yellow-50 p-3 rounded-xl text-yellow-600"><Clock size={24} /></div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Revenue</p><h3 className="text-2xl font-black text-cyan-600 mt-1">${totalRevenue.toFixed(2)}</h3></div>
                    <div className="bg-cyan-50 p-3 rounded-xl text-cyan-600"><DollarSign size={24} /></div>
                </div>
            </div>

            {/* Filters (保持不变) */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Search by Order ID, Customer, Email..." className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 outline-none text-sm transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="relative min-w-[200px]">
                    <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <select className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 outline-none text-sm appearance-none cursor-pointer" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
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
                                <th className="p-5 font-bold text-gray-500 uppercase text-xs tracking-wider">Customer Info</th>
                                <th className="p-5 font-bold text-gray-500 uppercase text-xs tracking-wider">Date</th>
                                <th className="p-5 font-bold text-gray-500 uppercase text-xs tracking-wider">Items</th>
                                <th className="p-5 font-bold text-gray-500 uppercase text-xs tracking-wider">Total</th>
                                <th className="p-5 font-bold text-gray-500 uppercase text-xs tracking-wider">Status</th>
                                <th className="p-5 font-bold text-gray-500 uppercase text-xs tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredOrders.length === 0 ? (
                                <tr><td colSpan="7" className="p-12 text-center text-gray-500">No orders found matching your search.</td></tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="p-5"><span className="font-mono text-xs font-bold text-black bg-gray-100 px-2 py-1 rounded">{order.id}</span></td>
                                        <td className="p-5">
                                            <div><p className="font-bold text-gray-900 leading-tight">{order.customerName}</p><p className="text-xs text-gray-500 mt-0.5">{order.email}</p></div>
                                        </td>
                                        <td className="p-5 text-sm text-gray-600"><div className="flex items-center gap-1.5"><Calendar size={14} className="text-gray-400"/>{order.date}</div></td>
                                        <td className="p-5 text-sm text-gray-600 font-medium">{order.items} items</td>
                                        <td className="p-5 font-bold text-gray-900">${order.total.toFixed(2)}</td>
                                        <td className="p-5">{getStatusBadge(order.status)}</td>
                                        <td className="p-5 text-right">
                                            {/* 3. 修改：点击眼睛触发 setSelectedOrder */}
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                                                title="View Order Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- 4. ORDER DETAILS MODAL (弹窗) --- */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">

                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-black text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                                    Order Details
                                </h2>
                                <span className="font-mono text-xs bg-black text-cyan-400 px-2 py-1 rounded font-bold">
                                    {selectedOrder.id}
                                </span>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body (Scrollable) */}
                        <div className="p-6 overflow-y-auto">

                            {/* Customer & Shipping Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer Details</h3>
                                    <div>
                                        <p className="font-bold text-gray-900">{selectedOrder.customerName}</p>
                                        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1"><Calendar size={14}/> {selectedOrder.email}</p>
                                        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1"><Phone size={14}/> {selectedOrder.phone || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Shipping Address</h3>
                                    <div className="flex items-start gap-2">
                                        <MapPin size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {selectedOrder.address || 'No address provided.'}
                                        </p>
                                    </div>
                                    <div className="pt-2 flex items-center gap-2">
                                        <CreditCard size={16} className="text-gray-400" />
                                        <p className="text-sm text-gray-600">Paid via <span className="font-bold">{selectedOrder.paymentMethod || 'Card'}</span></p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items Table */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Ordered Items</h3>
                                <div className="border border-gray-100 rounded-xl overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                                            <tr>
                                                <th className="px-4 py-3">Product</th>
                                                <th className="px-4 py-3 text-center">Qty</th>
                                                <th className="px-4 py-3 text-right">Price</th>
                                                <th className="px-4 py-3 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {selectedOrder.products && selectedOrder.products.length > 0 ? (
                                                selectedOrder.products.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                                                    <img src={item.img} alt="" className="w-full h-full object-cover"/>
                                                                </div>
                                                                <span className="font-bold text-gray-800">{item.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-gray-600">x{item.qty}</td>
                                                        <td className="px-4 py-3 text-right text-gray-600">${item.price.toFixed(2)}</td>
                                                        <td className="px-4 py-3 text-right font-bold text-gray-900">${(item.price * item.qty).toFixed(2)}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan="4" className="p-4 text-center text-gray-500">Item details not available.</td></tr>
                                            )}
                                        </tbody>
                                        {/* Total Calculation */}
                                        <tfoot className="bg-gray-50">
                                            <tr>
                                                <td colSpan="3" className="px-4 py-3 text-right text-gray-500 font-medium">Subtotal</td>
                                                <td className="px-4 py-3 text-right font-bold text-gray-900">${selectedOrder.total.toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="3" className="px-4 py-3 text-right text-gray-500 font-medium">Shipping</td>
                                                <td className="px-4 py-3 text-right font-bold text-gray-900">$0.00</td>
                                            </tr>
                                            <tr className="border-t border-gray-200">
                                                <td colSpan="3" className="px-4 py-3 text-right font-black text-lg">Total</td>
                                                <td className="px-4 py-3 text-right font-black text-lg text-cyan-600">${selectedOrder.total.toFixed(2)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase text-gray-400 mr-2">Status:</span>
                                {getStatusBadge(selectedOrder.status)}
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-6 py-2 bg-black text-white rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors"
                            >
                                Close Details
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default ViewOrders;