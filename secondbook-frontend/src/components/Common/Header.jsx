// secondbook-frontend/src/components/Common/Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShoppingCart, User, ChevronDown } from 'lucide-react';

const Header = () => {
    // State to handle the visibility of the "My Account" dropdown
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // List of links for the dropdown menu
    const accountLinks = [
        { name: 'Orders', to: '/dashboard/orders' },
        { name: 'Profile', to: '/dashboard/profile' },
        { name: 'Addresses', to: '/dashboard/addresses' },
        { name: 'Account details', to: '/dashboard/settings' },
    ];

    return (
        // Added a vibrant bottom border for a pop of color
        <header className="bg-white shadow-lg sticky top-0 z-20 border-b-4 border-pink-400">
            <div className="page-container flex items-center justify-between py-3">

                {/* Left Section: Logo/Brand (Retains vibrant color + subtitle) */}
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
                    {/* Navigation Bar - Enhanced styling for a more colorful look */}
                    <nav className="hidden md:flex items-center text-md font-semibold bg-pink-50 rounded-lg overflow-hidden border border-pink-100">
                        <Link
                            to="/books"
                            className="py-3 px-5 text-gray-800 hover:bg-pink-100 hover:text-pink-600 transition duration-150 border-r border-pink-100"
                        >
                            Books
                        </Link>
                        <Link
                            to="/accessories"
                            className="py-3 px-5 text-gray-800 hover:bg-pink-100 hover:text-pink-600 transition duration-150 border-r border-pink-100"
                        >
                            Accessories
                        </Link>
                        <Link
                            to="/about"
                            className="py-3 px-5 text-gray-800 hover:bg-pink-100 hover:text-pink-600 transition duration-150 border-r border-pink-100"
                        >
                            About Us
                        </Link>

                        {/* My Account Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                        >
                            <Link
                                to="/dashboard"
                                className="flex items-center py-3 px-5 text-gray-800 hover:bg-pink-100 hover:text-pink-600 transition duration-150 cursor-pointer"
                            >
                                My Account
                                <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                            </Link>

                            {/* Dropdown Menu Content */}
                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 rounded-b-lg shadow-2xl z-30 overflow-hidden">
                                    {accountLinks.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.to}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition"
                                            onClick={() => setIsDropdownOpen(false)} // Close dropdown on click
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Cart Icon (Now uses the pink accent color for visibility) */}
                    <Link
                        to="/cart"
                        className="p-3 rounded-full text-white bg-pink-500 hover:bg-pink-600 transition duration-150 shadow-md"
                        title="View Shopping Cart"
                    >
                        <ShoppingCart className="w-6 h-6" />
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;