import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, ShieldCheck } from 'lucide-react';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        role: 'customer' // Default role
    });

    const handleRegister = (e) => {
        e.preventDefault();

        // In a real app, you'd send this to an API.
        // Here we simulate saving the user to the "session"
        localStorage.setItem("registeredUser", JSON.stringify(formData));

        alert(`Account created successfully as ${formData.role}! Please login.`);
        navigate('/login');
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] py-10">
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border-t-8 border-pink-500">
                <div className="text-center mb-8">
                    <UserPlus className="w-12 h-12 text-pink-500 mx-auto mb-2" />
                    <h2 className="text-3xl font-black text-gray-800">Register</h2>
                    <p className="text-gray-500">Join the preloved book movement</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Choose Username"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                    />

                    {/* Role Selection (For Testing Purposes) */}
                    <div className="pt-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Account Type</label>
                        <select
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 outline-none"
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                        >
                            <option value="customer">Customer (Buy Books)</option>
                            <option value="admin">Admin (Manage Store)</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-pink-500 text-white font-bold py-3 rounded-xl hover:bg-pink-600 transition-all shadow-lg mt-4">
                        Create Account
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600 text-sm">
                    Already have an account? <Link to="/login" className="text-pink-500 font-bold hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;