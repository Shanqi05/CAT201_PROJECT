import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../../components/Dashboard/DashboardSidebar';
import { User, BookOpen, Settings, LogOut, MapPin, Trash2, Camera, Plus, Lock, Edit3, CreditCard, Calendar, Package, CheckCircle, Truck, AlertCircle } from 'lucide-react';

const UserDashboardPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');

    // --- DATA STATES (Now fetched from DB) ---
    const [userData, setUserData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- FORM STATES ---
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({ houseNo: '', street: '', city: '', postcode: '', state: '' });
    const states = ['Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Perak', 'Perlis', 'Pulau Pinang', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu', 'Kuala Lumpur', 'Labuan', 'Putrajaya'];

    // --- 1. LOAD DATA FROM BACKEND ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Profile
                const profileRes = await fetch('http://localhost:8080/CAT201_project/getUserProfile', { credentials: 'include' });
                if (profileRes.ok) setUserData(await profileRes.json());
                else if (profileRes.status === 401) navigate('/login'); // Redirect if not logged in

                // Fetch Addresses
                const addrRes = await fetch('http://localhost:8080/CAT201_project/getAddresses', { credentials: 'include' });
                if (addrRes.ok) setSavedAddresses(await addrRes.json());

                // Fetch Orders
                const orderRes = await fetch('http://localhost:8080/CAT201_project/getUserOrders', { credentials: 'include' });
                if (orderRes.ok) {
                    const data = await orderRes.json();
                    // [OPTIONAL] Ensure data consistency if needed, but DAO sends "products" now
                    setOrders(data);
                }

            } catch (error) {
                console.error("Error loading dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    // --- ADDRESS HANDLER (DB) ---
    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const params = new URLSearchParams(newAddress);
            const response = await fetch('http://localhost:8080/CAT201_project/addAddress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params,
                credentials: 'include'
            });

            if (response.ok) {
                alert("Address added!");
                setIsAddingAddress(false);
                setNewAddress({ houseNo: '', street: '', city: '', postcode: '', state: '' });
                // Refresh address list
                const addrRes = await fetch('http://localhost:8080/CAT201_project/getAddresses', { credentials: 'include' });
                if (addrRes.ok) setSavedAddresses(await addrRes.json());
            } else {
                alert("Failed to save address.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = async () => {
        if (window.confirm("Are you sure you want to log out?")) {
            try {
                await fetch('http://localhost:8080/CAT201_project/logout', { method: 'GET', credentials: 'include' });
            } catch (error) { console.error(error); }

            // Clear Client Data
            localStorage.removeItem("userToken");
            localStorage.removeItem("userRole");
            localStorage.removeItem("user");

            // CLEAR CART ON LOGOUT
            localStorage.removeItem("shoppingCart");

            window.dispatchEvent(new Event("storage"));
            window.dispatchEvent(new Event("cartUpdated")); // Update cart badge
            navigate('/home');
        }
    };

    const handleSidebarClick = (key) => key === 'logout' ? handleLogout() : setActiveTab(key);

    const dashboardItems = [
        { key: 'profile', icon: User, label: 'My Profile' },
        { key: 'orders', icon: BookOpen, label: 'My Orders' },
        { key: 'logout', icon: LogOut, label: 'Logout' }
    ];

    if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;

    // --- RENDER CONTENT ---
    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="space-y-8 animate-fadeIn">
                        {/* Header */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
                            <div className="w-24 h-24 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center text-4xl font-bold border-4 border-white shadow-lg">
                                {userData?.name?.charAt(0) || "U"}
                            </div>
                            <div className="text-center md:text-left flex-1">
                                <h2 className="text-3xl font-bold text-gray-900">{userData ? userData.name : "Guest"}</h2>
                                <p className="text-gray-500 font-medium">@{userData?.username}</p>
                                <p className="text-gray-400 text-sm mt-1">{userData?.email}</p>
                            </div>
                        </div>

                        {/* Addresses */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                    <MapPin className="mr-2 text-cyan-500 fill-current"/> My Addresses
                                </h3>
                                <button onClick={() => setIsAddingAddress(!isAddingAddress)} className="text-sm bg-cyan-50 text-cyan-700 px-4 py-2 rounded-lg hover:bg-cyan-100 transition font-semibold flex items-center">
                                    <Plus size={16} className="mr-1"/> {isAddingAddress ? "Cancel" : "Add New Address"}
                                </button>
                            </div>

                            {isAddingAddress && (
                                <form onSubmit={handleAddAddress} className="mb-6 p-6 bg-gray-50 rounded-xl border border-cyan-100">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <input required placeholder="House No / Taman" className="p-3 border rounded-lg focus:ring-2 focus:ring-cyan-200 outline-none" value={newAddress.houseNo} onChange={e => setNewAddress({...newAddress, houseNo: e.target.value})} />
                                        <input required placeholder="Street / Jalan" className="p-3 border rounded-lg focus:ring-2 focus:ring-cyan-200 outline-none" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        <input required placeholder="Postcode" maxLength="5" className="p-3 border rounded-lg focus:ring-2 focus:ring-cyan-200 outline-none" value={newAddress.postcode} onChange={e => setNewAddress({...newAddress, postcode: e.target.value})} />
                                        <input required placeholder="City" className="p-3 border rounded-lg focus:ring-2 focus:ring-cyan-200 outline-none" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                                        <select required className="p-3 border rounded-lg focus:ring-2 focus:ring-cyan-200 outline-none text-gray-700" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})}>
                                            <option value="">Select State</option>
                                            {states.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <button type="submit" className="bg-cyan-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-cyan-700 shadow-md">Save Address</button>
                                </form>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {savedAddresses.map((addr) => (
                                    <div key={addr.addressId} className="border border-gray-100 p-5 rounded-xl relative bg-white hover:shadow-md transition">
                                        <div className="flex items-start">
                                            <div className="bg-cyan-100 p-2 rounded-full mr-3 text-cyan-600"><MapPin size={20}/></div>
                                            <div>
                                                <p className="font-bold text-gray-800">{addr.houseNo}, {addr.street}</p>
                                                <p className="text-sm text-gray-500">{addr.postcode} {addr.city}</p>
                                                <p className="text-sm text-gray-500">{addr.state}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {savedAddresses.length === 0 && !isAddingAddress && (
                                    <div className="col-span-2 text-center py-8 text-gray-400 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                                        <MapPin className="mx-auto w-8 h-8 mb-2 opacity-50"/>
                                        <p>No addresses saved yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 'orders':
                return (
                    <div className="space-y-8 animate-fadeIn">
                        <div className="flex items-end gap-4">
                            <h2 className="text-3xl font-bold text-gray-900">Order History</h2>
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-bold">
                                {orders.length} orders
                            </span>
                        </div>

                        {orders.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                                <Package className="mx-auto w-16 h-16 text-gray-200 mb-4" />
                                <h3 className="text-xl font-bold text-gray-800">No Orders Yet</h3>
                                <p className="text-gray-400 mb-6">You haven't purchased anything yet.</p>
                                <button onClick={() => navigate('/books')} className="px-8 py-3 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-700 shadow-md transition">
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            orders.map((order) => {
                                const isDelivered = order.status === 'Delivered';
                                const statusColor = isDelivered ? "bg-green-100 text-green-700" : "bg-blue-50 text-blue-600";

                                // [FIX] Safe check for products array
                                const products = order.products || [];

                                return (
                                    <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                            <div>
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order #{order.id}</span>
                                                <div className="text-sm text-gray-500 mt-1"><Calendar className="inline w-3 h-3 mr-1"/> {order.date}</div>
                                            </div>
                                            <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${statusColor}`}>
                                                {isDelivered ? <CheckCircle size={16}/> : <Truck size={16}/>}
                                                {order.status}
                                            </span>
                                        </div>

                                        <div className="p-6">
                                            {/* [FIX] Changed order.items to order.products */}
                                            <div className="space-y-4 mb-6">
                                                {products.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between items-center">
                                                        <div className="flex items-center gap-4">
                                                            <img
                                                                src={item.image}
                                                                className="w-12 h-16 object-cover rounded bg-gray-200"
                                                                alt={item.title}
                                                                onError={(e) => e.target.src="https://via.placeholder.com/150"}
                                                            />
                                                            <div>
                                                                <p className="font-bold text-gray-800">{item.title}</p>
                                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                            </div>
                                                        </div>
                                                        <span className="font-bold text-gray-900">RM {(item.price || 0).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                                <div className="text-sm text-gray-500">
                                                    <MapPin size={14} className="inline mr-1"/> {order.address}
                                                </div>
                                                <div className="text-xl font-black text-cyan-600">
                                                    Total: RM {(order.total || 0).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                );

            default: return null;
        }
    };

    return (
        <div className="page-container py-8 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <DashboardSidebar items={dashboardItems} active={activeTab} setActive={handleSidebarClick} />
                </div>
                <div className="md:col-span-3">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default UserDashboardPage;