// src/pages/Admin/ManageUsers.jsx
import React, { useState } from 'react';
import { Search, UserX, Shield, User, Mail, Users, Filter } from 'lucide-react';
import usersData from '../../api/users.json';

const ManageUsers = () => {
    // 1. State Management
    const [users, setUsers] = useState(usersData);
    const [searchTerm, setSearchTerm] = useState('');
    // New: Currently active Tab ('all' | 'customer' | 'admin')
    const [activeTab, setActiveTab] = useState('all');

    const handleDeleteUser = (id) => {
        if(window.confirm("Are you sure you want to delete this user?")) {
            setUsers(users.filter(user => user.id !== id));
        }
    };

    // 2. Modified Filter Logic: Matches both Search Term AND Current Tab
    const filteredUsers = users.filter(user => {
        // Search match
        const matchesSearch = 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Tab match
        const matchesTab = activeTab === 'all' || user.role === activeTab;

        return matchesSearch && matchesTab;
    });

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
                        <h3 className="text-3xl font-black text-cyan-600 mt-1">{users.filter(u => u.role === 'customer').length}</h3>
                    </div>
                    <div className="bg-cyan-50 p-3 rounded-xl text-cyan-600"><User size={24} /></div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Admins</p>
                        <h3 className="text-3xl font-black text-purple-600 mt-1">{users.filter(u => u.role === 'admin').length}</h3>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-xl text-purple-600"><Shield size={24} /></div>
                </div>
            </div>

            {/* Controls Section: Tabs & Search */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                
                {/* 3. New: Tab Switcher */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button 
                        onClick={() => setActiveTab('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-all ${
                            activeTab === 'all' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        All Users
                    </button>
                    <button 
                        onClick={() => setActiveTab('customer')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-all ${
                            activeTab === 'customer' ? 'bg-white text-cyan-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        Customers
                    </button>
                    <button 
                        onClick={() => setActiveTab('admin')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-all ${
                            activeTab === 'admin' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        Admins
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none text-sm transition-all"
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
                                        No {activeTab !== 'all' ? activeTab : ''} users found matching "{searchTerm}"
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${
                                                    user.role === 'admin' ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-gradient-to-br from-cyan-400 to-blue-500'
                                                }`}>
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 leading-tight">{user.name}</p>
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
                                            {user.role === 'admin' ? (
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
                                                    user.role === 'admin' 
                                                    ? 'text-gray-300 cursor-not-allowed' 
                                                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                                }`}
                                                disabled={user.role === 'admin'}
                                                title={user.role === 'admin' ? "Cannot delete admin" : "Delete User"}
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
                
                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-500 flex justify-between items-center font-medium">
                    <span>Showing {filteredUsers.length} results</span>
                    <span>Filter: {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;