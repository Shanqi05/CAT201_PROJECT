import React, {useEffect, useRef, useState} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Lock, User, BookOpen, Eye, EyeOff } from 'lucide-react'; // Added Eye and EyeOff

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loginInput, setLoginInput] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // New state for visibility
    const API_URL = 'http://localhost:8080/CAT201_project/login';
    const hasAlerted = useRef(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        const formData = new URLSearchParams();
        formData.append('username', loginInput);
        formData.append('password', password);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
                credentials: 'include'
            });

            if (response.ok) {
                const user = await response.json();
                console.log("Login Successful:", user);
                localStorage.setItem("userToken", "logged-in");
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("userRole", user.role);

                // Update header
                window.dispatchEvent(new Event("storage"));

                // Redirect based on Role
                if (user.role && user.role.toLowerCase() === 'admin') {
                    navigate('/admin/home');
                } else {
                    navigate('/home');
                }
            } else {
                alert("Invalid username or password.");
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("Server error. Please try again later.");
        }
    };

    useEffect(() => {
        // Check if there is a message in the navigation state
        if (location.state?.message && !hasAlerted.current) {
            hasAlerted.current = true;
            window.alert(location.state.message);

            // Clear the message so it doesn't pop up again if they refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md border-t-8 border-cyan-600">
                <div className="text-center mb-8">
                    <LogIn className="w-12 h-12 text-cyan-600 mx-auto mb-2" />
                    <h2 className="text-3xl font-black text-gray-800 tracking-tight">Welcome Back</h2>
                    <p className="text-gray-500">Sign in to
                        <Link to="/home">
                            <span className="hover:text-cyan-600 transition-colors tracking-tighter"> BookShelter</span>
                        </Link>
                    </p>
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
                            type={showPassword ? "text" : "password"} // Type changes based on state
                            placeholder="Password"
                            className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {/* Eye Button Toggle */}
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-cyan-600 transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
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
                        New to BookShelter? {' '}
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