// secondbook-frontend/src/pages/User/AccessoriesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, Zap, Gift, ShoppingBag } from 'lucide-react';

import BookCard from '../../components/Common/BookCard';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import mockAccessories from '../../api/accessories.json';

const keyCategories = [
    { key: 'Lighting', label: 'Book Lights', icon: Zap, color: 'cyan' },
    { key: 'Keepsakes', label: 'Bookmarks', icon: BookOpen, color: 'pink' },
    { key: 'Gifts', label: 'Gift Sets', icon: Gift, color: 'green' },
    { key: 'Writing', label: 'Journals & Pens', icon: BookOpen, color: 'indigo' },
];

const AccessoriesPage = () => {
    const [accessories, setAccessories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();

    // Get the category filter from the URL
    const activeCategory = searchParams.get('category');

    // --- Load Data on Component Mount ---
    useEffect(() => {
        // Simulate API delay
        setTimeout(() => {
            setAccessories(mockAccessories);
            setLoading(false);
        }, 500);
    }, []);

    // --- Filter Logic ---
    const filteredAccessories = activeCategory
        ? accessories.filter(acc => acc.category === activeCategory)
        : accessories;

    if (loading) {
        return <LoadingSpinner />;
    }

    // We are now showing all filtered accessories, so 'featured' is not needed here
    // const featuredAccessories = filteredAccessories.slice(0, 4);

    return (
        <div className="page-container">
            {/* Hero Section - UPDATED FILTER TEXT */}
            <div className="text-center bg-pink-50 p-12 rounded-2xl shadow-inner mb-12 border-b-4 border-pink-400">
                <ShoppingBag className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Enhance Your Reading Experience</h1>
                <p className="text-xl text-gray-600">
                    Discover essential tools and thoughtful gifts for every book enthusiast.
                    {activeCategory && (
                        // 👇 REPLACED THE OLD TEXT with an exciting, direct phrase
                        <span className="block mt-3 text-2xl font-black text-cyan-700 tracking-tight">
                            Category: {activeCategory} Must-Haves Await!
                        </span>
                    )}
                </p>
            </div>

            {/* --- Key Categories Section (Unchanged) --- */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Must-Have Reading Companions</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {keyCategories.map((cat) => {
                        const Icon = cat.icon;
                        const borderClass = `border-${cat.color}-400`;
                        const textClass = `text-${cat.color}-600`;
                        const isActive = cat.key === activeCategory;

                        return (
                            <Link key={cat.key} to={`/accessories?category=${cat.key}`} className="block">
                                <div className={`text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 ${borderClass} 
                                    ${isActive ? 'ring-4 ring-offset-2 ring-pink-300' : ''} `}>
                                    <Icon className={`w-8 h-8 ${textClass} mx-auto mb-4`} />
                                    <h3 className="text-xl font-semibold mb-2">{cat.label}</h3>
                                    <p className="text-gray-600 text-sm">Explore all {cat.label.toLowerCase()} items.</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* --- Accessories Grid (Unchanged) --- */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
                    {activeCategory ? `${activeCategory} Items` : "Featured Accessories"} ({filteredAccessories.length})
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {filteredAccessories.length > 0 ? (
                        filteredAccessories.map((accessory) => (
                            <BookCard key={accessory.id} book={accessory} />
                        ))
                    ) : (
                        <div className="md:col-span-4 text-center p-12 bg-gray-50 rounded-xl">
                            <h3 className="text-2xl font-semibold">No Accessories Found in this Category</h3>
                            <button onClick={() => window.location.href = '/accessories'} className="mt-4 text-pink-600 hover:underline">
                                View All Accessories
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default AccessoriesPage;