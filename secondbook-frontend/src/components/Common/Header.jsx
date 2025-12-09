// secondbook-frontend/src/components/Common/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// NOTE: Importing ShoppingCart instead of Search
import { BookOpen, ShoppingCart, User } from 'lucide-react';

const Header = () => {
    return (
        <header className="bg-white shadow-lg sticky top-0 z-10 border-b-4 border-cyan-400">
            <div className="page-container flex items-center justify-between py-4">
                {/* Logo/Brand */}
                <Link to="/" className="flex items-center space-x-2 text-3xl font-extrabold text-gray-800">
                    <BookOpen className="w-8 h-8 text-cyan-500" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-teal-500">SecondBook</span>
                </Link>

                {/* Navigation - INCREASED DISTANCE TO space-x-16 */}
                <nav className="hidden md:flex space-x-16 text-lg font-medium">
                    <Link to="/" className="text-gray-600 hover:text-cyan-500 transition duration-150">Home</Link>
                    <Link to="/books" className="text-gray-600 hover:text-cyan-500 transition duration-150">Browse Books</Link>
                    <Link to="/donate" className="text-gray-600 hover:text-cyan-500 transition duration-150">Donate</Link>
                </nav>

                {/* Icons/Actions */}
                <div className="flex items-center space-x-4">
                    {/* NEW: Shopping Cart (Trolley) Button */}
                    <button className="p-2 rounded-full text-gray-600 hover:bg-cyan-50 transition">
                        <ShoppingCart className="w-6 h-6" />
                    </button>

                    {/* User/Profile Button (Retains pink accent) */}
                    <Link to="/dashboard" className="p-2 rounded-full text-white bg-pink-500 hover:bg-pink-600 transition shadow-md">
                        <User className="w-6 h-6" />
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;