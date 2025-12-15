import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ShoppingCart, ChevronDown, LogOut, LogIn } from 'lucide-react';
// IMPORT LOGIC
import { getCartCount } from '../../utils/cartUtils';

const Header = () => {
    const navigate = useNavigate();

    // UI State
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Logic State
    const [cartCount, setCartCount] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 1. LISTEN FOR UPDATES (Cart & Login Status)
    useEffect(() => {
        // A. Load Cart Count
        const updateCart = () => setCartCount(getCartCount());
        updateCart(); // Run once on load
        window.addEventListener('cartUpdated', updateCart);

        // B. Check Login Status
        setIsLoggedIn(!!localStorage.getItem("userToken"));

        return () => window.removeEventListener('cartUpdated', updateCart);
    }, []); // Empty dependency array means this runs once when header loads

    // 2. LOGOUT LOGIC
    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("userToken");
            setIsLoggedIn(false);
            setIsDropdownOpen(false);
            navigate('/login');
        }
    };

    // List of links for the dropdown menu
    const accountLinks = [
        { name: 'My Dashboard', to: '/dashboard' },
        // You can add more specific links later if needed
    ];

    return (
        <header className="bg-white shadow-lg sticky top-0 z-20 border-b-4 border-pink-400">
            <div className="page-container flex items-center justify-between py-3">

                {/* Left Section: Logo/Brand (Hers) */}
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

                {/* Right Section: Navigation and Icons */}
                <div className="flex items-center space-x-6">
                    <nav className="hidden md:flex items-center text-md font-semibold bg-pink-50 rounded-lg overflow-hidden border border-pink-100">
                        <Link to="/books" className="py-3 px-5 text-gray-800 hover:bg-pink-100 hover:text-pink-600 transition duration-150 border-r border-pink-100">
                            Books
                        </Link>
                        <Link to="/accessories" className="py-3 px-5 text-gray-800 hover:bg-pink-100 hover:text-pink-600 transition duration-150 border-r border-pink-100">
                            Accessories
                        </Link>
                        <Link to="/about" className="py-3 px-5 text-gray-800 hover:bg-pink-100 hover:text-pink-600 transition duration-150 border-r border-pink-100">
                            About Us
                        </Link>

                        {/* --- LOGIC: SHOW DROPDOWN ONLY IF LOGGED IN --- */}
                        {isLoggedIn ? (
                            <div
                                className="relative"
                                onMouseEnter={() => setIsDropdownOpen(true)}
                                onMouseLeave={() => setIsDropdownOpen(false)}
                            >
                                <div className="flex items-center py-3 px-5 text-gray-800 hover:bg-pink-100 hover:text-pink-600 transition duration-150 cursor-pointer">
                                    My Account
                                    <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                                </div>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute top-full right-0 w-48 bg-white border border-gray-200 rounded-b-lg shadow-2xl z-30 overflow-hidden">
                                        {accountLinks.map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.to}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                        {/* Logout Button inside Dropdown */}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition border-t flex items-center"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* --- IF LOGGED OUT: Show Login Link --- */
                            <Link to="/login" className="flex items-center py-3 px-5 text-gray-800 hover:bg-pink-100 hover:text-pink-600 transition duration-150 cursor-pointer">
                                <LogIn className="w-4 h-4 mr-2" /> Login
                            </Link>
                        )}
                    </nav>

                    {/* --- CART ICON (With Badge) --- */}
                    <Link
                        to="/cart"
                        className="relative p-3 rounded-full text-white bg-pink-500 hover:bg-pink-600 transition duration-150 shadow-md"
                        title="View Shopping Cart"
                    >
                        <ShoppingCart className="w-6 h-6" />

                        {/* Red Badge Logic */}
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full border-2 border-white">
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