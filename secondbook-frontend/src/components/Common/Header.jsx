import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, ShoppingCart, User, LogOut, LogIn } from 'lucide-react';
// IMPORT THE HELPER FUNCTION
import { getCartCount } from '../../utils/cartUtils';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [cartCount, setCartCount] = useState(0);
    const isLoggedIn = !!localStorage.getItem("userToken");

    // 1. LISTEN FOR CART UPDATES (This makes the red badge work)
    useEffect(() => {
        // Update immediately on load
        setCartCount(getCartCount());

        // Listen for the custom event 'cartUpdated'
        const handleCartUpdate = () => {
            setCartCount(getCartCount());
        };

        window.addEventListener('cartUpdated', handleCartUpdate);

        // Cleanup listener when component closes
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, []);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("userToken");
            navigate('/login');
        }
    };

    return (
        <header className="bg-white shadow-lg sticky top-0 z-10 border-b-4 border-cyan-400">
            <div className="page-container flex items-center justify-between py-4">
                {/* Logo/Brand */}
                <Link to="/" className="flex items-center space-x-2 text-3xl font-extrabold text-gray-800">
                    <BookOpen className="w-8 h-8 text-cyan-500" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-teal-500">SecondBook</span>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex space-x-16 text-lg font-medium">
                    <Link to="/" className="text-gray-600 hover:text-cyan-500 transition duration-150">Home</Link>
                    <Link to="/books" className="text-gray-600 hover:text-cyan-500 transition duration-150">Browse Books</Link>
                    <Link to="/donate" className="text-gray-600 hover:text-cyan-500 transition duration-150">Donate</Link>
                </nav>

                {/* Icons/Actions */}
                <div className="flex items-center space-x-4">

                    {/* --- SHOPPING CART LINK (Updates with Red Badge) --- */}
                    <Link to="/cart" className="relative p-2 rounded-full text-gray-600 hover:bg-cyan-50 transition">
                        <ShoppingCart className="w-6 h-6" />

                        {/* Red Badge Count - Only shows if items > 0 */}
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* User Logic (Login vs Dashboard) */}
                    {isLoggedIn ? (
                        <>
                            <Link to="/dashboard" title="Dashboard" className="p-2 rounded-full text-white bg-pink-500 hover:bg-pink-600 transition shadow-md">
                                <User className="w-6 h-6" />
                            </Link>

                            <button
                                onClick={handleLogout}
                                title="Logout"
                                className="p-2 rounded-full text-gray-600 hover:bg-red-50 hover:text-red-500 transition border border-gray-200"
                            >
                                <LogOut className="w-6 h-6" />
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="flex items-center space-x-2 px-4 py-2 bg-cyan-500 text-white rounded-full font-semibold hover:bg-cyan-600 transition shadow-md">
                            <LogIn className="w-4 h-4" />
                            <span>Login</span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;