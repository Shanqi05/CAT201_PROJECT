// src/pages/Admin/ManageUsers.jsx
import React, { useState, useEffect } from 'react';
import { Search, UserX, Shield, User, Mail, Users, Filter } from 'lucide-react';

const ManageUsers = () => {
    // State Management
    const [users, setUsers] = useState([]); // Initialize with empty array
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    // 2. Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8080/CAT201_project/getUsers', {
                method: 'GET',
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Users fetched:", data);
                setUsers(data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };
    const handleDeleteUser = async (id) => {
            if(window.confirm("Are you sure you want to delete this user?")) {
                try {
                    // 3. Call Delete API
                    const response = await fetch(`http://localhost:8080/CAT201_project/deleteUser?id=${id}`, {
                        method: 'DELETE',
                        credentials: 'include',
                    });

                    if (response.ok) {
                        setUsers(users.filter(user => user.id !== id));
                        alert("User deleted successfully.");
                    } else {
                        alert("Failed to delete user.");
                    }
                } catch (error) {
                    console.error("Error deleting user:", error);
                }
            }
        };

    // Filter Logic
    const filteredUsers = users.filter(user => {
        // 4. Update filtering logic to use 'username' instead of 'name' if DB doesn't have name
        const matchesSearch =
            (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());

        // 5. Handle Role matching (DB might store "USER" uppercase, frontend uses 'customer' lowercase)
        // We normalize both to lowercase to compare safely
        const userRole = (user.role || '').toLowerCase();
        // Map 'USER' from DB to 'customer' for tab logic if needed, or just compare loosely
        // If DB has "USER", activeTab "customer" needs to match
        const matchesTab = activeTab === 'all' ||
                           (activeTab === 'customer' && userRole === 'user') ||
                           (activeTab === 'admin' && userRole === 'admin');

        return matchesSearch && matchesTab;
    });

    // Helper to count roles safely
    const countRoles = (targetRole) => {
        return users.filter(u => (u.role || '').toLowerCase() === targetRole).length;
    };

    return (
        <div className="p-8 max-w-7xl mx-auto w-full">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Manage Users
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Manage accounts, roles, and permissions.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Users</p>
                        <h3 className="text-3xl font-black text-gray-900 mt-1">{users.length}</h3>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-xl text-gray-600"><Users size={24} /></div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Customers</p>
                        {/* Use helper function to count 'user' role */}
                        <h3 className="text-3xl font-black text-cyan-600 mt-1">{countRoles('user')}</h3>
                    </div>
                    <div className="bg-cyan-50 p-3 rounded-xl text-cyan-600"><User size={24} /></div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Admins</p>
                        {/* Use helper function to count 'admin' role */}
                        <h3 className="text-3xl font-black text-purple-600 mt-1">{countRoles('admin')}</h3>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-xl text-purple-600"><Shield size={24} /></div>
                </div>
            </div>

            {/* Controls Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button onClick={() => setActiveTab('all')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-all ${activeTab === 'all' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>All Users</button>
                    <button onClick={() => setActiveTab('customer')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-all ${activeTab === 'customer' ? 'bg-white text-cyan-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>Customers</button>
                    <button onClick={() => setActiveTab('admin')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-all ${activeTab === 'admin' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>Admins</button>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 outline-none text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-5 font-bold text-gray-500 uppercase text-xs tracking-wider">User Profile</th>
                                <th className="p-5 font-bold text-gray-500 uppercase text-xs tracking-wider">Contact</th>
                                <th className="p-5 font-bold text-gray-500 uppercase text-xs tracking-wider">Username</th>
                                <th className="p-5 font-bold text-gray-500 uppercase text-xs tracking-wider">Role</th>
                                <th className="p-5 font-bold text-gray-500 uppercase text-xs tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${
                                                    (user.role || '').toUpperCase() === 'ADMIN' ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-gradient-to-br from-cyan-400 to-blue-500'
                                                }`}>
                                                    {/* Display first char of username since we don't have 'name' */}
                                                    {user.username ? user.username.charAt(0).toUpperCase() : '?'}
                                                </div>
                                                <div>
                                                    {/* Changed user.name to user.username */}
                                                    <p className="font-bold text-gray-900 leading-tight">{user.username}</p>
                                                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">ID: {user.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Mail size={14} className="text-gray-400" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="p-5 text-sm font-mono text-gray-600">
                                            @{user.username}
                                        </td>
                                        <td className="p-5">
                                            {(user.role || '').toUpperCase() === 'ADMIN' ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100">
                                                    <Shield size={12} fill="currentColor" className="opacity-50" />
                                                    Admin
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-100">
                                                    <User size={12} fill="currentColor" className="opacity-50" />
                                                    Customer
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-5 text-right">
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className={`p-2 rounded-lg transition-colors ${
                                                    (user.role || '').toUpperCase() === 'ADMIN'
                                                    ? 'text-gray-300 cursor-not-allowed'
                                                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                                }`}
                                                disabled={(user.role || '').toUpperCase() === 'ADMIN'}
                                            >
                                                <UserX size={18}/>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;