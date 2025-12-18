import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Lock, User } from 'lucide-react';
import usersData from '../../api/users.json';

const LoginPage = () => {
    const navigate = useNavigate();
    const [loginInput, setLoginInput] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        // Debug: See what you are typing
        console.log("Attempting login for:", loginInput);

        // 1. Find user in the JSON list
        const user = usersData.find(
            (u) => (u.username === loginInput || u.email === loginInput) && u.password === password
        );

        if (user) {
            console.log("User found:", user.name, "Role:", user.role);

            // 2. Save Session Data
            localStorage.setItem("userToken", "fake-jwt-token-" + user.id);
            localStorage.setItem("userRole", user.role); // Important for AdminProtectedRoute
            localStorage.setItem("registeredUser", JSON.stringify(user));

            // 3. Trigger a storage event (In case Header needs to update immediately)
            window.dispatchEvent(new Event("storage"));

            // 4. Role-based Navigation
            if (user.role === 'admin') {
                console.log("Navigating to Admin Dashboard...");
                navigate('/admin-dashboard');
            } else {
                console.log("Navigating to Customer Home...");
                navigate('/home');
            }
        } else {
            console.error("Login failed: No matching user found.");
            alert("Invalid credentials. Please check your username and password.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md border-t-8 border-cyan-600">
                <div className="text-center mb-8">
                    <LogIn className="w-12 h-12 text-cyan-600 mx-auto mb-2" />
                    <h2 className="text-3xl font-black text-gray-800 tracking-tight">Welcome Back</h2>
                    <p className="text-gray-500">Sign in to SecondBook</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Username or Email"
                            className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                            value={loginInput}
                            onChange={(e) => setLoginInput(e.target.value)}
                            required
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            placeholder="Password"
                            className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-cyan-600 text-white font-bold py-3 rounded-xl hover:bg-cyan-700 transition-all shadow-lg hover:shadow-cyan-200 transform active:scale-[0.98]"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-gray-600">
                        New to SecondBook? {' '}
                        <Link to="/register" className="text-cyan-600 font-bold hover:text-cyan-700 transition-colors">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;