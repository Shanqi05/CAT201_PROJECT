import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ShoppingCart, ChevronDown, LogOut, LogIn } from 'lucide-react';
import { getCartCount } from '../../utils/cartUtils';

const Header = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Update Cart Badge
        const updateCart = () => setCartCount(getCartCount());
        updateCart();
        window.addEventListener('cartUpdated', updateCart);

        // Check Login Status
        const token = localStorage.getItem("userToken");
        setIsLoggedIn(!!token);

        return () => window.removeEventListener('cartUpdated', updateCart);
    }, []);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("userToken");
            setIsLoggedIn(false);
            setIsDropdownOpen(false);
            navigate('/login');
        }
    };

    return (
        <header className="bg-white shadow-lg sticky top-0 z-20 border-b-4 border-pink-400">
            <div className="page-container flex items-center justify-between py-3">

                {/* LOGO */}
                <div className="flex flex-col items-start">
                    <Link to="/" className="flex items-center space-x-2 text-3xl font-black text-gray-800">
                        <BookOpen className="w-8 h-8 text-cyan-500" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-teal-500">
                            SecondBook
                        </span>
                    </Link>
                    <p className="text-xs font-semibold text-pink-600 tracking-wider ml-10 -mt-1 uppercase">
                        Your Preloved Bookstore
                    </p>
                </div>

                {/* NAVIGATION */}
                <div className="flex items-center space-x-6">
                    <nav className="hidden md:flex items-center text-md font-semibold bg-pink-50 rounded-lg overflow-hidden border border-pink-100">
                        <Link to="/books" className="py-3 px-5 text-gray-800 hover:bg-pink-100 hover:text-pink-600 border-r border-pink-100">Books</Link>
                        <Link to="/accessories" className="py-3 px-5 text-gray-800 hover:bg-pink-100 hover:text-pink-600 border-r border-pink-100">Accessories</Link>
                        <Link to="/about" className="py-3 px-5 text-gray-800 hover:bg-pink-100 hover:text-pink-600 border-r border-pink-100">About Us</Link>

                        {/* === ACCOUNT SECTION === */}
                        {isLoggedIn ? (
                            <div
                                className="relative group"
                                onMouseEnter={() => setIsDropdownOpen(true)}
                                onMouseLeave={() => setIsDropdownOpen(false)}
                            >
                                {/* MAIN BUTTON - NOW CLICKABLE */}
                                <Link
                                    to="/dashboard"
                                    className="flex items-center py-3 px-5 text-gray-800 hover:bg-pink-100 hover:text-pink-600 cursor-pointer"
                                >
                                    My Account
                                    <ChevronDown className="w-4 h-4 ml-1" />
                                </Link>

                                {/* DROPDOWN MENU */}
                                {isDropdownOpen && (
                                    <div className="absolute top-full right-0 w-48 bg-white border border-gray-200 rounded-b-lg shadow-2xl z-50">
                                        <Link
                                            to="/dashboard"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600"
                                        >
                                            My Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t flex items-center"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center py-3 px-5 text-gray-800 hover:bg-pink-100 hover:text-pink-600">
                                <LogIn className="w-4 h-4 mr-2" /> Login
                            </Link>
                        )}
                    </nav>

                    {/* CART ICON */}
                    <Link to="/cart" className="relative p-3 rounded-full text-white bg-pink-500 hover:bg-pink-600 shadow-md">
                        <ShoppingCart className="w-6 h-6" />
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full border-2 border-white transform translate-x-1/4 -translate-y-1/4">
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