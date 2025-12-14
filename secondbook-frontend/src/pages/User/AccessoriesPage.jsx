// secondbook-frontend/src/pages/User/AccessoriesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Zap, Gift, ShoppingBag } from 'lucide-react';

// Import Components
import BookCard from '../../components/Common/BookCard';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

// --- 👇 IMPORT THE NEW JSON FILE 👇 ---
import mockAccessories from '../../api/accessories.json';


const AccessoriesPage = () => {
    const [accessories, setAccessories] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- Load Data on Component Mount ---
    useEffect(() => {
        // Simulate API delay for demonstration
        setTimeout(() => {
            setAccessories(mockAccessories);
            setLoading(false);
        }, 500);
    }, []);

    // Show spinner while data loads
    if (loading) {
        return <LoadingSpinner />;
    }

    // Define the key accessory categories used in the section below
    const keyCategories = [
        { key: 'Lighting', label: 'Book Lights', icon: Zap, color: 'cyan' },
        { key: 'Keepsakes', label: 'Bookmarks', icon: BookOpen, color: 'pink' },
        { key: 'Gifts', label: 'Gift Sets', icon: Gift, color: 'green' },
        { key: 'Writing', label: 'Journals & Pens', icon: BookOpen, color: 'indigo' },
    ];

    // Filter accessories to display 4 featured items
    const featuredAccessories = accessories.slice(0, 4);

    return (
        <div className="page-container">
            {/* Hero Section */}
            <div className="text-center bg-pink-50 p-12 rounded-2xl shadow-inner mb-12 border-b-4 border-pink-400">
                <ShoppingBag className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Enhance Your Reading Experience</h1>
                <p className="text-xl text-gray-600">Discover essential tools and thoughtful gifts for every book enthusiast.</p>
            </div>

            {/* --- Key Categories Section (Dynamic Styling) --- */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Must-Have Reading Companions</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {keyCategories.map((cat) => {
                        const Icon = cat.icon;
                        const borderClass = `border-${cat.color}-400`;
                        const textClass = `text-${cat.color}-600`;

                        return (
                            <Link key={cat.key} to={`/accessories?category=${cat.key}`} className="block">
                                <div className={`text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 ${borderClass}`}>
                                    <Icon className={`w-8 h-8 ${textClass} mx-auto mb-4`} />
                                    <h3 className="text-xl font-semibold mb-2">{cat.label}</h3>
                                    <p className="text-gray-600 text-sm">Explore all {cat.label.toLowerCase()} items.</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* --- Featured Accessories (Using loaded data) --- */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Featured Accessories</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {featuredAccessories.map((accessory) => (
                        <BookCard key={accessory.id} book={accessory} />
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link
                        to="/accessories/all"
                        className="bg-pink-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-pink-600 transition shadow-lg"
                    >
                        View All {accessories.length} Accessories →
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default AccessoriesPage;