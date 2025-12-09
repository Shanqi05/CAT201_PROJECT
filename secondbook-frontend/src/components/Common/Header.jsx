// secondbook-frontend/src/components/Common/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, User } from 'lucide-react'; // Using lucide-react for icons

const Header = () => {
    return (
        <header className="bg-white shadow-md sticky top-0 z-10">
            <div className="page-container flex items-center justify-between py-4">
                {/* Logo/Brand */}
                <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-gray-800">
                    <BookOpen className="w-7 h-7 text-indigo-600" />
                    <span>SecondBook</span>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex space-x-8 text-lg">
                    <Link to="/" className="text-gray-600 hover:text-indigo-600 transition duration-150">Home</Link>
                    <Link to="/books" className="text-gray-600 hover:text-indigo-600 transition duration-150">Browse Books</Link>
                    <Link to="/donate" className="text-gray-600 hover:text-indigo-600 transition duration-150">Donate</Link>
                </nav>

                {/* Icons/Actions */}
                <div className="flex items-center space-x-4">
                    <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition">
                        <Search className="w-5 h-5" />
                    </button>
                    <Link to="/dashboard" className="p-2 rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition">
                        <User className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;