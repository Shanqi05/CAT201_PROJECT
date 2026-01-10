import React, { useState, useEffect } from 'react';
import { Save, Lock, Eye, EyeOff, User, Shield } from 'lucide-react';

const AdminSettings = () => {
    const [profileForm, setProfileForm] = useState({ username: '', email: '' });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/CAT201_project/getUserProfile', { credentials: 'include' });
                if (response.ok) {
                    const data = await response.json();
                    setProfileForm({ username: data.username || '', email: data.email || '' });
                }
            } catch (error) {
                console.error("Error loading admin profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/CAT201_project/updateProfile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'updateInfo',
                    username: profileForm.username,
                    email: profileForm.email
                }),
                credentials: 'include'
            });
            const result = await response.json();
            if (result.success) {
                alert("Profile updated successfully!");
                window.location.reload();
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
                body: JSON.stringify({
                    action: 'changePassword',
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                }),
                credentials: 'include'
            });
            const result = await response.json();
            if (result.success) {
                alert("Password changed successfully!");
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                alert("Error: " + result.message);
            }
        } catch (error) { console.error(error); }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;

    return (
        // [UPDATE] Centering Container
        <div className="min-h-[80vh] flex flex-col justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="w-full max-w-5xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Admin Settings
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage your administrator account details and security.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 1. Edit Info Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                            <User className="mr-2 text-cyan-600"/> Profile Information
                        </h3>
                        <form onSubmit={handleUpdateProfile} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
                                <input
                                    type="text"
                                    value={profileForm.username}
                                    onChange={(e) => setProfileForm({...profileForm, username: e.target.value})}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 outline-none transition bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={profileForm.email}
                                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 outline-none transition bg-gray-50"
                                />
                            </div>
                            <div className="pt-2">
                                <button type="submit" className="w-full px-6 py-3 bg-cyan-600 text-white rounded-xl font-bold shadow-lg hover:bg-cyan-700 transition flex items-center justify-center">
                                    <Save size={18} className="mr-2"/> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* 2. Change Password Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                            <Lock className="mr-2 text-purple-600"/> Security
                        </h3>
                        <form onSubmit={handleChangePassword} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none transition bg-gray-50"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                                        {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none transition bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Confirm</label>
                                    <input
                                        type="password"
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none transition bg-gray-50"
                                    />
                                </div>
                            </div>
                            <div className="pt-2">
                                <button type="submit" className="w-full px-6 py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg hover:bg-black transition flex items-center justify-center">
                                    <Shield size={18} className="mr-2"/> Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;