import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../../components/Dashboard/DashboardSidebar';
import { User, BookOpen, Settings, LogOut, MapPin, Trash2, Plus, Edit3, Save, Lock, Eye, EyeOff, Calendar, Truck, Package, CheckCircle, Phone, XCircle, Clock } from 'lucide-react';

const UserDashboardPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');

    // Data States
    const [userData, setUserData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- SETTINGS FORM STATES ---
    const [profileForm, setProfileForm] = useState({ username: '', email: '' });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);

    // --- ADDRESS FORM STATES ---
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [addressForm, setAddressForm] = useState({
        houseNo: '', street: '', city: '', postcode: '', state: '', phone: ''
    });

    const states = ['Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Perak', 'Perlis', 'Pulau Pinang', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu', 'Kuala Lumpur', 'Labuan', 'Putrajaya'];

    useEffect(() => {
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        try {
            // 1. Fetch Profile
            const profileRes = await fetch('http://localhost:8080/CAT201_project/getUserProfile', { credentials: 'include' });
            if (profileRes.ok) {
                const data = await profileRes.json();
                setUserData(data);
                setProfileForm({ username: data.username || '', email: data.email || '' });
            } else if (profileRes.status === 401) {
                navigate('/login');
            }

            // 2. Fetch Addresses
            fetchAddresses();

            // 3. Fetch Orders
            const orderRes = await fetch('http://localhost:8080/CAT201_project/getUserOrders', { credentials: 'include' });
            if (orderRes.ok) setOrders(await orderRes.json());

        } catch (error) {
            console.error("Error loading dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAddresses = async () => {
        const addrRes = await fetch('http://localhost:8080/CAT201_project/getAddresses', { credentials: 'include' });
        if (addrRes.ok) setSavedAddresses(await addrRes.json());
    };

    // --- FORM HANDLERS ---
    const handleAddressInputChange = (e) => {
        setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setAddressForm({ houseNo: '', street: '', city: '', postcode: '', state: '', phone: '' });
        setEditingAddressId(null);
        setShowAddressForm(false);
    };

    const openAddForm = () => {
        resetForm();
        setShowAddressForm(true);
    };

    const openEditForm = (addr) => {
        setAddressForm({
            houseNo: addr.houseNo,
            street: addr.street,
            city: addr.city,
            postcode: addr.postcode,
            state: addr.state,
            phone: addr.phone || ''
        });
        setEditingAddressId(addr.addressId);
        setShowAddressForm(true);
    };

    // --- API ACTION HANDLERS ---
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/CAT201_project/updateProfile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'updateInfo', username: profileForm.username, email: profileForm.email }),
                credentials: 'include'
            });
            const result = await response.json();
            if (result.success) {
                alert("Profile updated!");
                fetchData();
            } else {
                alert("Failed: " + result.message);
            }
        } catch (error) { console.error(error); }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert("New passwords do not match!");
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/CAT201_project/updateProfile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'changePassword', currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }),
                credentials: 'include'
            });
            const result = await response.json();
            if (result.success) {
                alert("Password changed!");
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                alert("Error: " + result.message);
            }
        } catch (error) { console.error(error); }
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();

        // Phone Validation Logic
        // Allows: 0123456789, 012-3456789
        const phoneRegex = /^0\d{1,2}-?\d{7,8}$/;
        if (!phoneRegex.test(addressForm.phone)) {
            alert("Invalid phone number. Please use a format like 012-3456789 or 0123456789.");
            return;
        }

        try {
            const params = new URLSearchParams(addressForm);
            let url = 'http://localhost:8080/CAT201_project/addAddress';

            if (editingAddressId) {
                params.append('addressId', editingAddressId);
                url = 'http://localhost:8080/CAT201_project/updateAddress';
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params,
                credentials: 'include'
            });

            if (response.ok) {
                alert(editingAddressId ? "Address updated!" : "Address added!");
                resetForm();
                fetchAddresses();
            } else {
                const errorText = await response.text();
                alert(errorText || "Failed to save address.");
            }
        } catch (err) { console.error(err); }
    };

    const handleDeleteAddress = async (id) => {
        if (!window.confirm("Delete this address?")) return;
        try {
            const response = await fetch(`http://localhost:8080/CAT201_project/deleteAddress?id=${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                fetchAddresses();
            } else {
                alert("Failed to delete.");
            }
        } catch (e) { console.error(e); }
    };

    const handleLogout = async () => {
        if (window.confirm("Are you sure you want to log out?")) {
            try { await fetch('http://localhost:8080/CAT201_project/logout', { method: 'GET', credentials: 'include' }); } catch (error) {}
            localStorage.clear();
            window.dispatchEvent(new Event("storage"));
            window.dispatchEvent(new Event("cartUpdated"));
            navigate('/home');
        }
    };

    const getStatusBadge = (status) => {
        const s = (status || '').toLowerCase();
        switch(s) {
            case 'delivered': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit border border-green-200"><CheckCircle size={12} className="mr-1.5" /> Delivered</span>;
            case 'shipped': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit border border-blue-200"><Truck size={12} className="mr-1.5" /> Shipped</span>;
            case 'processing': return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit border border-yellow-200"><Clock size={12} className="mr-1.5" /> Processing</span>;
            case 'cancelled': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit border border-red-200"><XCircle size={12} className="mr-1.5" /> Cancelled</span>;
            default: return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit">{status}</span>;
        }
    };

    const dashboardItems = [
        { key: 'profile', icon: User, label: 'My Profile' },
        { key: 'orders', icon: BookOpen, label: 'My Orders' },
        { key: 'settings', icon: Settings, label: 'Settings' },
        { key: 'logout', icon: LogOut, label: 'Logout' }
    ];

    if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="space-y-8 animate-fadeIn">
                        {/* Profile Header */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
                            <div className="w-24 h-24 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center text-4xl font-bold border-4 border-white shadow-lg">
                                {userData?.name?.charAt(0) || userData?.username?.charAt(0) || "U"}
                            </div>
                            <div className="text-center md:text-left flex-1">
                                <h2 className="text-3xl font-bold text-gray-900">{userData?.name || userData?.username || "Guest"}</h2>
                                <p className="text-gray-500 font-medium">{userData?.email}</p>
                                <p className="text-sm text-cyan-600 font-bold mt-1 bg-cyan-50 px-2 py-1 rounded inline-block">
                                    @{userData?.username}
                                </p>
                            </div>
                            <button onClick={() => setActiveTab('settings')} className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition flex items-center gap-2 text-sm font-bold text-gray-700">
                                <Edit3 size={16}/> Edit Profile
                            </button>
                        </div>

                        {/* Address Section */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                    <MapPin className="mr-2 text-cyan-500 fill-current"/> My Addresses
                                </h3>
                                <button onClick={showAddressForm ? resetForm : openAddForm} className={`text-sm px-4 py-2 rounded-lg transition font-semibold flex items-center ${showAddressForm ? 'bg-gray-100 text-gray-600' : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100'}`}>
                                    {showAddressForm ? "Cancel" : <><Plus size={16} className="mr-1"/> Add New Address</>}
                                </button>
                            </div>

                            {/* ADD / EDIT FORM */}
                            {showAddressForm && (
                                <form onSubmit={handleSaveAddress} className="mb-8 p-6 bg-gray-50 rounded-xl border border-cyan-100 animate-in fade-in slide-in-from-top-2">
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                                        {editingAddressId ? "Edit Address" : "New Address"}
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <input name="houseNo" required placeholder="House No / Taman" className="p-3 border rounded-lg focus:ring-2 focus:ring-cyan-200 outline-none" value={addressForm.houseNo} onChange={handleAddressInputChange} />
                                        <input name="street" required placeholder="Street / Jalan" className="p-3 border rounded-lg focus:ring-2 focus:ring-cyan-200 outline-none" value={addressForm.street} onChange={handleAddressInputChange} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <input name="postcode" required placeholder="Postcode" maxLength="5" className="p-3 border rounded-lg focus:ring-2 focus:ring-cyan-200 outline-none" value={addressForm.postcode} onChange={handleAddressInputChange} />
                                        <input name="city" required placeholder="City" className="p-3 border rounded-lg focus:ring-2 focus:ring-cyan-200 outline-none" value={addressForm.city} onChange={handleAddressInputChange} />
                                        <select name="state" required className="p-3 border rounded-lg focus:ring-2 focus:ring-cyan-200 outline-none text-gray-700" value={addressForm.state} onChange={handleAddressInputChange}>
                                            <option value="">Select State</option>
                                            {states.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <input name="phone" required placeholder="Phone Number (e.g. 012-3456789)" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-cyan-200 outline-none" value={addressForm.phone} onChange={handleAddressInputChange} />
                                        <p className="text-xs text-gray-400 mt-1">Format: 0123456789 or 012-3456789</p>
                                    </div>

                                    <button type="submit" className="bg-cyan-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-cyan-700 shadow-md">
                                        {editingAddressId ? "Update Address" : "Save Address"}
                                    </button>
                                </form>
                            )}

                            {/* ADDRESS LIST */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {savedAddresses.map((addr) => (
                                    <div key={addr.addressId} className="border border-gray-100 p-5 rounded-xl relative bg-white hover:shadow-md transition group">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start">
                                                <div className="bg-cyan-100 p-2 rounded-full mr-3 text-cyan-600 flex-shrink-0"><MapPin size={20}/></div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{addr.houseNo}, {addr.street}</p>
                                                    <p className="text-sm text-gray-500">{addr.postcode} {addr.city}, {addr.state}</p>
                                                    {addr.phone && (
                                                        <p className="text-xs text-cyan-600 mt-1 font-bold flex items-center">
                                                            <Phone size={12} className="mr-1"/> {addr.phone}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEditForm(addr)} className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition" title="Edit">
                                                    <Edit3 size={16}/>
                                                </button>
                                                <button onClick={() => handleDeleteAddress(addr.addressId)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                                                    <Trash2 size={16}/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {savedAddresses.length === 0 && !showAddressForm && (
                                    <div className="col-span-2 text-center py-8 text-gray-400 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                                        <p>No addresses saved yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 'settings':
                return (
                    <div className="space-y-8 animate-fadeIn">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Account Settings</h2>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center"><User className="mr-2 text-cyan-500"/> Personal Information</h3>
                            <form onSubmit={handleUpdateProfile} className="space-y-5 max-w-lg">
                                <div><label className="block text-sm font-bold text-gray-700 mb-1">Username</label><input type="text" value={profileForm.username} onChange={(e) => setProfileForm({...profileForm, username: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl outline-none" /></div>
                                <div><label className="block text-sm font-bold text-gray-700 mb-1">Email</label><input type="email" value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl outline-none" /></div>
                                <button type="submit" className="px-6 py-3 bg-cyan-600 text-white rounded-xl font-bold shadow-lg hover:bg-cyan-700 transition flex items-center"><Save size={18} className="mr-2"/> Save Changes</button>
                            </form>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center"><Lock className="mr-2 text-purple-500"/> Security</h3>
                            <form onSubmit={handleChangePassword} className="space-y-5 max-w-lg">
                                <div><label className="block text-sm font-bold text-gray-700 mb-1">Current Password</label><div className="relative"><input type={showPassword ? "text" : "password"} value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl outline-none" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-sm font-bold text-gray-700 mb-1">New Password</label><input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl outline-none" /></div>
                                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Confirm</label><input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl outline-none" /></div>
                                </div>
                                <button type="submit" className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg hover:bg-black transition">Update Password</button>
                            </form>
                        </div>
                    </div>
                );

            case 'orders':
                return (
                    <div className="space-y-8 animate-fadeIn">
                        <div className="flex items-end gap-4">
                            <h2 className="text-3xl font-bold text-gray-900">Order History</h2>
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-bold">{orders.length} orders</span>
                        </div>
                        {orders.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                                <Package className="mx-auto w-16 h-16 text-gray-200 mb-4" />
                                <h3 className="text-xl font-bold text-gray-800">No Orders Yet</h3>
                                <p className="text-gray-400 mb-6">You haven't purchased anything yet.</p>
                                <button onClick={() => navigate('/books')} className="px-8 py-3 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-700 shadow-md transition">Start Shopping</button>
                            </div>
                        ) : (
                            orders.map((order) => {
                                const products = order.products || [];

                                return (
                                    <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                            <div>
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order #{order.id}</span>
                                                <div className="text-sm text-gray-500 mt-1"><Calendar className="inline w-3 h-3 mr-1"/> {order.date}</div>
                                            </div>
                                            {/* [FIX] Use shared status badge logic */}
                                            {getStatusBadge(order.status)}
                                        </div>
                                        <div className="p-6">
                                            <div className="space-y-4 mb-6">
                                                {products.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between items-center">
                                                        <div className="flex items-center gap-4">
                                                            <img src={item.image} className="w-12 h-16 object-cover rounded bg-gray-200" alt="" onError={(e)=>e.target.src="https://placehold.co/150"}/>
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
                                                <div className="text-sm text-gray-500"><MapPin size={14} className="inline mr-1"/> {order.address}</div>
                                                <div className="text-xl font-black text-cyan-600">Total: RM {(order.total || 0).toFixed(2)}</div>
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
                    <DashboardSidebar items={dashboardItems} active={activeTab} setActive={(key) => key === 'logout' ? handleLogout() : setActiveTab(key)} />
                </div>
                <div className="md:col-span-3">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default UserDashboardPage;