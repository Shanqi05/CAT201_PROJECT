import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, UserX, Shield, User, Mail, Calendar } from 'lucide-react';
import usersData from '../../api/users.json';

const ManageUsers = () => {
    const [users, setUsers] = useState(usersData);
    const [searchTerm, setSearchTerm] = useState('');

    const handleDeleteUser = (id) => {
        if(window.confirm("Are you sure you want to delete this user?")) {
            setUsers(users.filter(user => user.id !== id));
        }
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <h1 className="text-3xl font-black text-gray-900">Manage Users</h1>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search users by name, email, or username..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-purple-500">
                    <p className="text-sm text-gray-500 font-bold uppercase">Total Users</p>
                    <h3 className="text-2xl font-black">{users.length}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-cyan-500">
                    <p className="text-sm text-gray-500 font-bold uppercase">Customers</p>
                    <h3 className="text-2xl font-black">{users.filter(u => u.role === 'customer').length}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-orange-500">
                    <p className="text-sm text-gray-500 font-bold uppercase">Admins</p>
                    <h3 className="text-2xl font-black">{users.filter(u => u.role === 'admin').length}</h3>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-bold text-gray-600 uppercase text-xs">User ID</th>
                            <th className="p-4 font-bold text-gray-600 uppercase text-xs">User Details</th>
                            <th className="p-4 font-bold text-gray-600 uppercase text-xs">Username</th>
                            <th className="p-4 font-bold text-gray-600 uppercase text-xs">Role</th>
                            <th className="p-4 font-bold text-gray-600 uppercase text-xs text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">
                                    No users found matching "{searchTerm}"
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4">
                                        <span className="font-mono text-sm text-gray-600">{user.id}</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-white font-bold mr-3">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{user.name}</p>
                                                <p className="text-xs text-gray-500 flex items-center">
                                                    <Mail size={12} className="mr-1" /> {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        <span className="flex items-center">
                                            <User size={14} className="mr-1" /> {user.username}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {user.role === 'admin' ? (
                                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit">
                                                <Shield size={12} className="mr-1" /> Admin
                                            </span>
                                        ) : (
                                            <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit">
                                                <User size={12} className="mr-1" /> Customer
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                                                disabled={user.role === 'admin'}
                                            >
                                                <UserX size={18}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 text-sm text-gray-500">
                Showing {filteredUsers.length} of {users.length} users
            </div>
        </div>
    );
};

export default ManageUsers;
