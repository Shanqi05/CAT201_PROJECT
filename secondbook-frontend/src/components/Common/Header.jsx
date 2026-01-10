import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ShoppingCart, LogOut, LogIn, User, Heart } from 'lucide-react';
import { getCartCount } from '../../utils/cartUtils';

const Header = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const updateCart = () => setCartCount(getCartCount());
        updateCart();
        window.addEventListener('cartUpdated', updateCart);
        const token = localStorage.getItem("userToken");
        const role = localStorage.getItem("userRole");
        setIsLoggedIn(!!token);
        setUserRole(role || '');
        
        // Listen for storage changes (e.g., after login)
        const handleStorageChange = () => {
            const newToken = localStorage.getItem("userToken");
            const newRole = localStorage.getItem("userRole");
            setIsLoggedIn(!!newToken);
            setUserRole(newRole || '');
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('cartUpdated', updateCart);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleLogout = async () => {
        if (window.confirm("Are you sure you want to logout?")) {
            navigate('/home');
            try {
                // Call backend
                await fetch('http://localhost:8080/CAT201_project/logout', {
                    method: 'GET',
                    credentials: 'include',
                });
            } catch (error) {
                console.error('Logout error:', error);
            }
            // Clear local storage
            localStorage.removeItem("userToken");
            localStorage.removeItem("userRole");
            localStorage.removeItem("registeredUser");
            localStorage.removeItem("user");
            setIsLoggedIn(false);
            setUserRole('');
            setIsDropdownOpen(false);

            // force header update
            window.dispatchEvent(new Event("storage"));
        }
    };

    // Determine the home link based on user role
    const getHomeLink = () => {
        if (userRole === 'admin') {
            return '/admin/home';
        }
        return '/home';
    };

    return (
        <header className="bg-black shadow-2xl sticky top-0 z-50 border-b border-white/10 backdrop-blur-md bg-opacity-95">
            <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">

                {/* LOGO */}
                <div className="flex flex-col items-start group">
                    <Link to={getHomeLink()} className="flex items-center space-x-2 text-2xl font-black tracking-tighter">
                        
                        <BookOpen className="w-8 h-8 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
                        
                        
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                            BookShelter
                        </span>
                    </Link>
                    {/* Slogan */}
                    <p className="text-[10px] font-bold text-purple-400/80 tracking-[0.2em] ml-10 -mt-1 uppercase">
                        Your Preloved Bookstore
                    </p>
                </div>

                    {/* NAVIGATION */}
                <div className="flex items-center space-x-8">
                    <nav className="hidden md:flex items-center text-sm font-black bg-white/5 rounded-xl border border-white/10">
                        <Link to="/books" className="py-3 px-6 text-gray-300 hover:bg-white hover:text-black transition-all border-r border-white/10 uppercase tracking-widest">Books</Link>
                        <Link to="/accessories" className="py-3 px-6 text-gray-300 hover:bg-white hover:text-black transition-all border-r border-white/10 uppercase tracking-widest">Accessories</Link>
                        <Link to="/donation" className="py-3 px-6 text-gray-300 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all border-r border-white/10 uppercase tracking-widest">Donate</Link>
                        <Link to="/about" className="py-3 px-6 text-gray-300 hover:bg-white hover:text-black transition-all border-r border-white/10 uppercase tracking-widest">About Us</Link>

                        {/* ACCOUNT SECTION */}
                        {isLoggedIn ? (
                            <div
                                className="relative group"
                                onMouseEnter={() => setIsDropdownOpen(true)}
                                onMouseLeave={() => setIsDropdownOpen(false)}
                            >
                                <Link
                                    to={userRole === 'admin' ? '/admin/home' : '/dashboard'}
                                    className="flex items-center py-3 px-6 text-gray-300 hover:bg-white hover:text-black transition-all cursor-pointer uppercase tracking-widest"
                                >
                                    <User className="w-4 h-4 mr-2" /> Account
                                </Link>

                                {isDropdownOpen && (
                                    <div className="absolute top-0 right-0 mt-0 w-48 bg-[#0a0a0a] border border-white/10 rounded-b-xl shadow-2xl z-50 overflow-hidden transform -translate-y-full animate-in fade-in slide-in-from-top-2 duration-200">
                                        <Link
                                            to={userRole === 'admin' ? '/admin/home' : '/dashboard'}
                                            className="block px-6 py-4 text-xs font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5"
                                        >
                                            DASHBOARD
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-6 py-4 text-xs font-bold text-red-500 hover:bg-red-500/10 flex items-center transition-colors"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" /> LOGOUT
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center py-3 px-6 text-gray-300 hover:bg-white hover:text-black transition-all uppercase tracking-widest">
                                <LogIn className="w-4 h-4 mr-2" /> Login
                            </Link>
                        )}
                    </nav>

                    {/* CART ICON */}
                    <Link to="/cart" className="relative p-3 rounded-full text-black bg-white hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] transform hover:scale-110 active:scale-90">
                        <ShoppingCart className="w-5 h-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-black leading-none text-white bg-red-600 rounded-full border-2 border-black">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;