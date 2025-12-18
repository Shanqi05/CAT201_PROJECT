import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../../components/Dashboard/DashboardSidebar';
import { User, BookOpen, Settings, LogOut, MapPin, Trash2, Camera, Plus, Lock, Edit3, CreditCard, Calendar, Clock, Package, CheckCircle, Truck, AlertCircle } from 'lucide-react';

const UserDashboardPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders'); // Defaults to 'orders' so you can see the change immediately

    // --- DATA STATES ---
    const [userData, setUserData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [savedAddresses, setSavedAddresses] = useState([]);

    // --- UI STATES ---
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({ fullName: '', phone: '', address: '', city: '', zip: '' });

    // --- SETTINGS STATES ---
    const [editMode, setEditMode] = useState({ username: false, phone: false });
    const [settingsInput, setSettingsInput] = useState({ username: '', phone: '' });

    // Password Logic
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    // --- 1. LOAD DATA ---
    useEffect(() => {
        // Load User
        const storedUser = localStorage.getItem("registeredUser");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserData(parsedUser);
            setSettingsInput({ username: parsedUser.username, phone: parsedUser.phone });
        }

        // Load Orders
        const storedOrders = localStorage.getItem("orderHistory");
        if (storedOrders) setOrders(JSON.parse(storedOrders));

        // Load Addresses
        const storedAddr = localStorage.getItem("userAddresses");
        if (storedAddr) setSavedAddresses(JSON.parse(storedAddr));
    }, []);

    // --- 2. UPDATE USERNAME ---
    const updateUsername = () => {
        const newName = settingsInput.username.trim();
        if (!newName) return alert("Username cannot be empty!");

        const takenUsernames = ["admin", "test", "superuser", "shanqi", "ali"]; // Simulated DB check
        if (newName !== userData.username && takenUsernames.includes(newName.toLowerCase())) {
            return alert(`Error: The username "${newName}" is already taken.`);
        }

        const updatedUser = { ...userData, username: newName };
        setUserData(updatedUser);
        localStorage.setItem("registeredUser", JSON.stringify(updatedUser));
        setEditMode({ ...editMode, username: false });
        alert("Username updated successfully!");
    };

    // --- 3. CHANGE PASSWORD LOGIC ---
    const updatePassword = () => {
        if (!passwords.current) return alert("Please enter your current password.");
        if (passwords.current !== userData.password) return alert("Error: The current password you entered is incorrect!");
        if (passwords.new !== passwords.confirm) return alert("Error: New passwords do not match!");

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(passwords.new)) return alert("Password must be 8+ chars, include Upper, Lower, Number, and Symbol.");

        const updatedUser = { ...userData, password: passwords.new };
        setUserData(updatedUser);
        localStorage.setItem("registeredUser", JSON.stringify(updatedUser));

        alert("Password changed successfully! Please login again.");
        localStorage.removeItem("userToken");
        navigate('/login');
    };

    // --- OTHER HANDLERS ---
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

    // --- RENDER CONTENT ---
    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="space-y-8 animate-fadeIn">
                        {/* Header */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-cyan-50 shadow-md bg-gray-100">
                                    {userData?.profilePic ? (
                                        <img src={userData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-400 to-red-400 text-white text-5xl font-bold">
                                            {userData?.name?.charAt(0) || "U"}
                                        </div>
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-white text-cyan-600 p-2 rounded-full cursor-pointer hover:bg-gray-50 shadow-lg border border-gray-100 transition-transform hover:scale-110">
                                    <Camera size={20} />
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                            </div>
                            <div className="text-center md:text-left flex-1">
                                <h2 className="text-3xl font-bold text-gray-900">{userData ? userData.name : "Guest User"}</h2>
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
                                        <input required placeholder="Full Name" className="p-3 border rounded-lg focus:ring-2 focus:ring-cyan-200 outline-none" value={newAddress.fullName} onChange={e => setNewAddress({...newAddress, fullName: e.target.value})} />
                                        <input required placeholder="Phone" className="p-3 border rounded-lg focus:ring-2 focus:ring-cyan-200 outline-none" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} />
                                    </div>
                                    <textarea required placeholder="Address" className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-cyan-200 outline-none" rows="2" value={newAddress.address} onChange={e => setNewAddress({...newAddress, address: e.target.value})} />
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <input required placeholder="City" className="p-3 border rounded-lg focus:ring-2 focus:ring-cyan-200 outline-none" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                                        <input required placeholder="Zip Code" className="p-3 border rounded-lg focus:ring-2 focus:ring-cyan-200 outline-none" value={newAddress.zip} onChange={e => setNewAddress({...newAddress, zip: e.target.value})} />
                                    </div>
                                    <button type="submit" className="bg-cyan-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-cyan-700 shadow-md">Save Address</button>
                                </form>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {savedAddresses.map((addr, idx) => (
                                    <div key={idx} className="border border-gray-100 p-5 rounded-xl relative bg-white hover:shadow-md transition">
                                        <div className="flex items-start">
                                            <div className="bg-cyan-100 p-2 rounded-full mr-3 text-cyan-600"><MapPin size={20}/></div>
                                            <div>
                                                <h4 className="font-bold text-gray-800">{addr.fullName}</h4>
                                                <p className="text-sm text-gray-500 mb-1">{addr.phone}</p>
                                                <p className="text-sm text-gray-600 leading-relaxed">{addr.address}, {addr.city}, {addr.zip}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeleteAddress(idx)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition"><Trash2 size={18} /></button>
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
                        <h2 className="text-3xl font-bold text-gray-900">Order History</h2>
                        {orders.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <Package className="mx-auto w-16 h-16 text-gray-300 mb-4" />
                                <h3 className="text-xl font-bold text-gray-800">No Orders Yet</h3>
                                <p className="text-gray-500">Looks like you haven't bought anything yet.</p>
                                <button onClick={() => navigate('/books')} className="mt-6 px-6 py-2 bg-cyan-600 text-white rounded-lg font-bold hover:bg-cyan-700">Start Shopping</button>
                            </div>
                        ) : (
                            orders.map((order) => {
                                // --- CALCULATE SHIPPING ---
                                const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                                const shippingFee = order.total - subtotal;

                                return (
                                    <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 mb-6">
                                        {/* HEADER */}
                                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</span>
                                                <span className="text-lg font-black text-gray-800">{order.id}</span>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-1 rounded-md border border-gray-200">
                                                    <Calendar className="w-4 h-4 text-cyan-500"/>
                                                    {order.date}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-1 rounded-md border border-gray-200">
                                                    <Clock className="w-4 h-4 text-cyan-500"/>
                                                    {order.time || "10:00 AM"}
                                                </div>
                                            </div>

                                            <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2
                                                ${order.status === 'Delivered' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                                                {order.status === 'Delivered' ? <CheckCircle className="w-4 h-4"/> : <Truck className="w-4 h-4"/>}
                                                {order.status}
                                            </div>
                                        </div>

                                        {/* BODY */}
                                        <div className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center"><MapPin className="w-3 h-3 mr-1"/> Delivery To</p>
                                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                        <p className="text-gray-800 text-sm font-medium leading-relaxed">
                                                            {order.address || "123, Default Street, Penang"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center"><CreditCard className="w-3 h-3 mr-1"/> Payment Info</p>
                                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                                                        <span className="text-gray-700 text-sm">{order.paymentMethod || "Credit Card"}</span>
                                                        <span className="font-bold text-gray-900">RM {order.total.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-t border-gray-100 pt-4">
                                                <p className="text-xs font-bold text-gray-400 uppercase mb-3">Items Purchased</p>
                                                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                                    {order.items && order.items.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between items-center text-sm group">
                                                            <div className="flex items-center">
                                                                <span className="bg-white border border-gray-200 w-8 h-8 flex items-center justify-center rounded-md text-xs font-bold text-gray-500 mr-3">
                                                                    {item.quantity}x
                                                                </span>
                                                                <span className="text-gray-700 font-medium group-hover:text-cyan-600 transition">{item.title}</span>
                                                            </div>
                                                            <span className="text-gray-900 font-bold">
                                                                RM {(item.price * item.quantity).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    ))}

                                                    {/* --- SUBTOTAL & SHIPPING --- */}
                                                    <div className="border-t border-dashed border-gray-300 my-4"></div>

                                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                                        <span>Subtotal</span>
                                                        <span>RM {subtotal.toFixed(2)}</span>
                                                    </div>

                                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                                        <span>Shipping Fee</span>
                                                        <span>RM {shippingFee > 0 ? shippingFee.toFixed(2) : "0.00"}</span>
                                                    </div>

                                                    <div className="border-t border-gray-200 my-2"></div>

                                                    <div className="flex justify-between items-center text-base pt-1">
                                                        <span className="font-bold text-gray-800">Total Paid</span>
                                                        <span className="font-black text-cyan-600 text-lg">RM {order.total.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }).reverse()
                        )}
                    </div>
                );

            case 'settings':
                return (
                    <div className="space-y-8 animate-fadeIn">
                        <h2 className="text-3xl font-bold text-gray-900">Account Settings</h2>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg mb-6 flex items-center text-gray-800">
                                <User className="mr-2 text-cyan-500" /> Public Profile
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
                                    <p className="text-xs text-gray-400 mb-2">Must be unique.</p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            disabled={!editMode.username}
                                            value={settingsInput.username}
                                            onChange={(e) => setSettingsInput({...settingsInput, username: e.target.value})}
                                            className={`w-full p-3 border rounded-xl transition-all ${editMode.username ? 'bg-white ring-2 ring-cyan-100 border-cyan-500' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                                        />
                                        {editMode.username ? (
                                            <button onClick={updateUsername} className="bg-green-600 text-white px-4 rounded-xl hover:bg-green-700 text-sm font-bold shadow-md">Save</button>
                                        ) : (
                                            <button onClick={() => setEditMode({...editMode, username: true})} className="text-cyan-600 px-3 rounded-xl border border-gray-200 hover:bg-cyan-50 transition"><Edit3 size={18}/></button>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                    <p className="text-xs text-red-400 mb-2 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> Locked (One account per email)</p>
                                    <input
                                        type="email"
                                        disabled
                                        value={userData?.email || ''}
                                        className="w-full p-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed opacity-70"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg mb-4 flex items-center text-gray-800">
                                <Lock className="mr-2 text-cyan-500" /> Security
                            </h3>
                            {!showPasswordForm ? (
                                <div className="flex items-center justify-between bg-gray-50 p-6 rounded-xl border border-gray-200">
                                    <div>
                                        <h4 className="font-bold text-gray-800">Password</h4>
                                        <p className="text-sm text-gray-500">Last changed: Never</p>
                                    </div>
                                    <button
                                        onClick={() => setShowPasswordForm(true)}
                                        className="flex items-center text-white bg-cyan-600 px-5 py-2.5 rounded-xl font-bold hover:bg-cyan-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                        <Edit3 className="w-4 h-4 mr-2" /> Change Password
                                    </button>
                                </div>
                            ) : (
                                <div className="max-w-lg bg-white p-6 rounded-xl border-2 border-cyan-50 shadow-lg animate-fadeIn">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="font-bold text-gray-800 text-lg">Change Password</h4>
                                        <button onClick={() => setShowPasswordForm(false)} className="text-sm text-red-500 hover:text-red-700 font-semibold px-3 py-1 hover:bg-red-50 rounded-lg transition">Cancel</button>
                                    </div>
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Old Password</label>
                                            <input type="password" autoComplete="new-password" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition" placeholder="Enter current password" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
                                            <input type="password" autoComplete="new-password" placeholder="8+ chars, Upper, Symbol..." className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Confirm New Password</label>
                                            <input type="password" autoComplete="new-password" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none transition" placeholder="Retype new password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} />
                                        </div>
                                        <button onClick={updatePassword} className="w-full bg-cyan-600 text-white font-bold py-3 rounded-xl hover:bg-cyan-700 transition shadow-md mt-2">Confirm Change</button>
                                    </div>
                                </div>
                            )}
                        </div>
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