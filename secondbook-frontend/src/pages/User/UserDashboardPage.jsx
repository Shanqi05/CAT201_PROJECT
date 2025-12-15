import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../../components/Dashboard/DashboardSidebar';
import { User, BookOpen, Settings, LogOut, Package, Truck, CheckCircle, MapPin, Trash2, Camera, Plus, ChevronDown, ChevronUp, Smartphone, Lock, Edit3 } from 'lucide-react';

const UserDashboardPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');

    // Data States
    const [userData, setUserData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [savedAddresses, setSavedAddresses] = useState([]);

    // UI States
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({ fullName: '', phone: '', address: '', city: '', zip: '' });

    // --- SETTINGS FORM STATES ---
    const [editMode, setEditMode] = useState({ username: false, phone: false });
    const [settingsInput, setSettingsInput] = useState({ username: '', phone: '' });
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    useEffect(() => {
        // Load User
        const storedUser = localStorage.getItem("registeredUser");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserData(parsedUser);
            // Initialize settings inputs
            setSettingsInput({ username: parsedUser.username, phone: parsedUser.phone });
        }

        // Load History & Addresses
        const storedOrders = localStorage.getItem("orderHistory");
        if (storedOrders) setOrders(JSON.parse(storedOrders));

        const storedAddr = localStorage.getItem("userAddresses");
        if (storedAddr) setSavedAddresses(JSON.parse(storedAddr));
    }, []);

    // --- 1. SETTINGS: UPDATE USERNAME ---
    const updateUsername = () => {
        if (!settingsInput.username.trim()) return alert("Username cannot be empty!");

        // Simulating "Unique" check (In real app, this calls API)
        if (settingsInput.username === "admin") return alert("Username 'admin' is taken!");

        const updatedUser = { ...userData, username: settingsInput.username };
        setUserData(updatedUser);
        localStorage.setItem("registeredUser", JSON.stringify(updatedUser));
        setEditMode({ ...editMode, username: false });
        alert("Username updated successfully!");
    };

    // --- 2. SETTINGS: UPDATE PHONE ---
    const updatePhone = () => {
        // Regex Validation (Same as Registration)
        if (settingsInput.phone.length < 10 || isNaN(settingsInput.phone.replace('+', ''))) {
            return alert("Invalid Phone Number! Please enter a valid mobile number.");
        }

        const updatedUser = { ...userData, phone: settingsInput.phone };
        setUserData(updatedUser);
        localStorage.setItem("registeredUser", JSON.stringify(updatedUser));
        setEditMode({ ...editMode, phone: false });
        alert("Phone number updated successfully!");
    };

    // --- 3. SETTINGS: CHANGE PASSWORD ---
    const updatePassword = () => {
        // A. Verify Current Password
        if (passwords.current !== userData.password) {
            return alert("Error: Current password is incorrect!");
        }

        // B. Verify Match
        if (passwords.new !== passwords.confirm) {
            return alert("Error: New passwords do not match!");
        }

        // C. Verify Complexity (Same as RegisterPage)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(passwords.new)) {
            return alert("Error: Password must be 8+ chars, include Upper, Lower, Number, and Symbol (@$!%*?&).");
        }

        // D. Save
        const updatedUser = { ...userData, password: passwords.new };
        setUserData(updatedUser);
        localStorage.setItem("registeredUser", JSON.stringify(updatedUser));
        alert("Password changed successfully! Please login again.");

        // Force Logout for security
        localStorage.removeItem("userToken");
        navigate('/login');
    };

    // --- OTHER LOGIC (Images, Addresses, Orders) ---
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedUser = { ...userData, profilePic: reader.result };
                setUserData(updatedUser);
                localStorage.setItem("registeredUser", JSON.stringify(updatedUser));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddAddress = (e) => {
        e.preventDefault();
        const updatedAddresses = [...savedAddresses, newAddress];
        setSavedAddresses(updatedAddresses);
        localStorage.setItem("userAddresses", JSON.stringify(updatedAddresses));
        setIsAddingAddress(false);
        setNewAddress({ fullName: '', phone: '', address: '', city: '', zip: '' });
    };

    const handleDeleteAddress = (index) => {
        const updated = savedAddresses.filter((_, i) => i !== index);
        setSavedAddresses(updated);
        localStorage.setItem("userAddresses", JSON.stringify(updated));
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            localStorage.removeItem("userToken");
            navigate('/login');
        }
    };

    const handleSidebarClick = (key) => key === 'logout' ? handleLogout() : setActiveTab(key);

    const dashboardItems = [
        { key: 'profile', icon: User, label: 'My Profile' },
        { key: 'orders', icon: BookOpen, label: 'My Orders' },
        { key: 'settings', icon: Settings, label: 'Account Settings' },
        { key: 'logout', icon: LogOut, label: 'Logout' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            // ... (Profile and Orders are same as before, skipping to Settings) ...
            case 'profile':
                return (
                    <div className="space-y-8">
                        {/* Profile Header */}
                        <div className="bg-white p-6 rounded-xl shadow border border-gray-100 flex flex-col md:flex-row items-center gap-6">
                            <div className="relative group">
                                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200">
                                    {userData?.profilePic ? (
                                        <img src={userData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-pink-500 text-white text-4xl font-bold">
                                            {userData?.name?.charAt(0) || "U"}
                                        </div>
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-cyan-600 text-white p-2 rounded-full cursor-pointer hover:bg-cyan-700 shadow-sm transition">
                                    <Camera size={18} />
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                            </div>

                            <div className="text-center md:text-left flex-1">
                                <h2 className="text-3xl font-bold text-gray-800">{userData ? userData.name : "Guest"}</h2>
                                <p className="text-gray-500">@{userData?.username}</p>
                                <p className="text-gray-500">{userData?.email}</p>
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                    <MapPin className="mr-2 text-cyan-600"/> My Addresses
                                </h3>
                                <button onClick={() => setIsAddingAddress(!isAddingAddress)} className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 flex items-center">
                                    <Plus size={16} className="mr-1"/> {isAddingAddress ? "Cancel" : "Add New"}
                                </button>
                            </div>
                            {isAddingAddress && (
                                <form onSubmit={handleAddAddress} className="mb-6 p-4 bg-gray-50 rounded border border-cyan-100">
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <input required placeholder="Full Name" className="p-2 border rounded" value={newAddress.fullName} onChange={e => setNewAddress({...newAddress, fullName: e.target.value})} />
                                        <input required placeholder="Phone" className="p-2 border rounded" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} />
                                    </div>
                                    <textarea required placeholder="Address" className="w-full p-2 border rounded mb-3" rows="2" value={newAddress.address} onChange={e => setNewAddress({...newAddress, address: e.target.value})} />
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <input required placeholder="City" className="p-2 border rounded" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                                        <input required placeholder="Zip" className="p-2 border rounded" value={newAddress.zip} onChange={e => setNewAddress({...newAddress, zip: e.target.value})} />
                                    </div>
                                    <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded text-sm hover:bg-cyan-700">Save Address</button>
                                </form>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {savedAddresses.map((addr, idx) => (
                                    <div key={idx} className="border p-4 rounded-lg relative bg-gray-50">
                                        <h4 className="font-bold">{addr.fullName}</h4>
                                        <p className="text-sm">{addr.phone}</p>
                                        <p className="text-sm text-gray-500">{addr.address}, {addr.city}, {addr.zip}</p>
                                        <button onClick={() => handleDeleteAddress(idx)} className="absolute top-3 right-3 text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'orders':
                return (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-800">Order History</h2>
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                                <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div><p className="font-bold text-gray-800">{order.id}</p><p className="text-sm text-gray-500">{order.date}</p></div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{order.status}</span>
                                    <div className="flex items-center gap-4">
                                        <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                                        <button onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)} className="text-cyan-600 hover:bg-cyan-50 p-2 rounded-full"><ChevronDown /></button>
                                    </div>
                                </div>
                                {expandedOrderId === order.id && (
                                    <div className="bg-gray-50 p-6 border-t border-gray-100">
                                        <h4 className="font-bold mb-3 text-sm text-gray-700">Items:</h4>
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm text-gray-600 mb-2">
                                                <span>{item.quantity}x {item.title}</span>
                                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )).reverse()}
                    </div>
                );

            // ================== SETTINGS TAB (UPDATED) ==================
            case 'settings':
                return (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-800">Account Settings</h2>

                        {/* 1. Profile Details */}
                        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                            <h3 className="font-bold text-lg mb-4 flex items-center text-gray-700">
                                <User className="mr-2 text-cyan-600" /> Public Profile
                            </h3>

                            <div className="space-y-4 max-w-lg">
                                {/* Username Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Username (Must be unique)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            disabled={!editMode.username}
                                            value={settingsInput.username}
                                            onChange={(e) => setSettingsInput({...settingsInput, username: e.target.value})}
                                            className={`flex-1 p-2 border rounded ${editMode.username ? 'bg-white border-cyan-500 ring-1 ring-cyan-500' : 'bg-gray-50'}`}
                                        />
                                        {editMode.username ? (
                                            <button onClick={updateUsername} className="bg-green-600 text-white px-4 rounded hover:bg-green-700">Save</button>
                                        ) : (
                                            <button onClick={() => setEditMode({...editMode, username: true})} className="text-cyan-600 hover:bg-cyan-50 px-3 rounded border border-gray-200"><Edit3 size={16}/></button>
                                        )}
                                    </div>
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number (1 number per account)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="tel"
                                            disabled={!editMode.phone}
                                            value={settingsInput.phone}
                                            onChange={(e) => setSettingsInput({...settingsInput, phone: e.target.value})}
                                            className={`flex-1 p-2 border rounded ${editMode.phone ? 'bg-white border-cyan-500 ring-1 ring-cyan-500' : 'bg-gray-50'}`}
                                        />
                                        {editMode.phone ? (
                                            <button onClick={updatePhone} className="bg-green-600 text-white px-4 rounded hover:bg-green-700">Save</button>
                                        ) : (
                                            <button onClick={() => setEditMode({...editMode, phone: true})} className="text-cyan-600 hover:bg-cyan-50 px-3 rounded border border-gray-200"><Edit3 size={16}/></button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Security / Password */}
                        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                            <h3 className="font-bold text-lg mb-4 flex items-center text-gray-700">
                                <Lock className="mr-2 text-cyan-600" /> Security
                            </h3>
                            <div className="space-y-3 max-w-md bg-gray-50 p-4 rounded-lg">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Current Password</label>
                                    <input type="password" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} className="w-full p-2 border rounded bg-white"/>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">New Password</label>
                                    <input type="password" placeholder="8+ chars, Upper, Symbol..." value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} className="w-full p-2 border rounded bg-white"/>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Confirm New Password</label>
                                    <input type="password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} className="w-full p-2 border rounded bg-white"/>
                                </div>
                                <button onClick={updatePassword} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-2 w-full font-bold">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="page-container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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