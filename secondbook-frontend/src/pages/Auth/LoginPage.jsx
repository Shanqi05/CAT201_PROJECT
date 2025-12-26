import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Lock, User } from 'lucide-react';

// [REMOVE]: We don't need the JSON file anymore
// import usersData from '../../api/users.json';

const LoginPage = () => {
    const navigate = useNavigate();
    const [loginInput, setLoginInput] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        // 1. Prepare data for the backend (FormData matches Servlet expectation)
        const formData = new URLSearchParams();
        formData.append('username', loginInput);
        formData.append('password', password);

        try {
            // 2. Send request to Java Servlet
            const response = await fetch('http://localhost:8080/CAT201_project/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            });

            if (response.ok) {
                // 3. Get the User Object from Backend (includes id, username, role, etc.)
                const user = await response.json();
                console.log("Login Successful:", user);

                // 4. Save User Data to Local Storage
                // We use the key 'user' so AdminLayout can find it easily
                localStorage.setItem("user", JSON.stringify(user));

                // Optional: Save specific items if needed elsewhere
                localStorage.setItem("userRole", user.role);

                // 5. Trigger storage event to update other components immediately
                window.dispatchEvent(new Event("storage"));

                // 6. Redirect based on Role (Check lowercase to match DB)
                if (user.role && user.role.toLowerCase() === 'admin') {
                    navigate('/admin/home');
                } else {
                    navigate('/home');
                }
            } else {
                // Handle Login Failed
                alert("Invalid username or password.");
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("Server error. Please try again later.");
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
                            placeholder="Username"
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