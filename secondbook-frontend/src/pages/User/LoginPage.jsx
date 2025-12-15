import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    // We rename 'email' to 'loginInput' since it can be either
    const [loginInput, setLoginInput] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        const storedUserString = localStorage.getItem("registeredUser");
        const storedUser = storedUserString ? JSON.parse(storedUserString) : null;

        if (!storedUser) {
            alert("No account found! Please Register first.");
            return;
        }

        // LOGIC: Check if input matches Email OR Username
        const isEmailMatch = loginInput === storedUser.email;
        const isUsernameMatch = loginInput === storedUser.username;
        const isPasswordMatch = password === storedUser.password;

        if ((isEmailMatch || isUsernameMatch) && isPasswordMatch) {
            localStorage.setItem("userToken", "fake-jwt-token-123");
            alert(`Welcome back, ${storedUser.name}!`);
            navigate('/books');
        } else {
            alert("Invalid Login Credentials!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

                <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                        {/* Updated Label */}
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email or Username</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-blue-500"
                            placeholder="Enter email or username"
                            value={loginInput}
                            onChange={(e) => setLoginInput(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-blue-500"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
                        Sign In
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;