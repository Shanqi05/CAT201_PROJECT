// secondbook-frontend/src/pages/User/AccessoriesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
    ShoppingBag, 
    Sparkles, 
    StickyNote, 
    Bookmark, 
    Briefcase, 
    Layout, 
    Box, 
    PenTool // Added for Stationery
} from 'lucide-react';

import AccessoryCard from '../../components/Common/AccessoryCard';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

// Updated categories list - divide stationery by type
const keyCategories = [
    { key: 'Stickers', label: 'Stickers', icon: StickyNote, color: 'text-yellow-500' },
    { key: 'Stands', label: 'Stands', icon: Box, color: 'text-indigo-500' },
    { key: 'Bookmarks', label: 'Bookmarks', icon: Bookmark, color: 'text-pink-500' },
    { key: 'Bags', label: 'Bags', icon: Briefcase, color: 'text-orange-500' },
    { key: 'Holders', label: 'Holders', icon: Layout, color: 'text-blue-500' },
    { key: 'Stationery', label: 'Stationery', icon: PenTool, color: 'text-emerald-500' },
];

const AccessoriesPage = () => {
    const [accessories, setAccessories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();

    const activeCategory = searchParams.get('category');

    useEffect(() => {
        fetchAccessories();
    }, []);

    const fetchAccessories = async () => {
        try {
            const response = await fetch('http://localhost:8080/CAT201_project/getAccessories', {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setAccessories(data);
            }
        } catch (error) {
            console.error('Error fetching accessories:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAccessories = activeCategory
        ? accessories.filter(acc => acc.category === activeCategory)
        : accessories;

    if (loading) return <LoadingSpinner />;

    return (
        <div className="w-full bg-[#fdfdfd]">
            {/* 1. Hero Header */}
            <div className="relative h-[350px] w-full flex items-center justify-center overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=2000" 
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Reading Accessories"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-black/20" />
                
                <div className="relative z-10 text-center px-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Sparkles className="text-pink-600 w-5 h-5 animate-pulse" />
                        <span className="text-pink-600 font-bold tracking-[0.2em] text-xs uppercase">Elevate Your Journey</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>
                        The Reading <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-400 italic">Companion.</span>
                    </h1>
                    <p className="mt-6 text-gray-700 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                        Stationery, stickers, and stands curated for the modern reader.
                    </p>
                </div>
            </div>

            {/* 2. Sticky Navigation - Categories Distributed Evenly */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm overflow-hidden">
                <div className="w-full">
                    <div className="flex flex-col">
                        {/* ALL ITEMS Button */}
                        <Link 
                            to="/accessories"
                            className={`w-full px-6 py-5 text-xs font-black tracking-widest text-center transition-all duration-300 border-b-2 ${
                                !activeCategory ? 'border-pink-600 text-pink-600 bg-pink-50' : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            ALL ITEMS
                        </Link>
                        {/* Categories Grid */}
                        <div className="grid grid-cols-3 md:grid-cols-6 w-full border-t border-gray-100">
                            {keyCategories.map((cat) => (
                                <Link
                                    key={cat.key}
                                    to={`/accessories?category=${cat.key}`}
                                    className={`px-6 py-5 text-xs font-black tracking-widest text-center transition-all duration-300 border-b-2 ${
                                        activeCategory === cat.key
                                        ? 'border-pink-600 text-pink-600 bg-pink-50'
                                        : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-pink-50/30'
                                    }`}
                                >
                                    {cat.label.toUpperCase()}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Product Grid */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="h-1 w-12 bg-pink-600 mb-4" />
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                            {activeCategory ? `${activeCategory} Collection` : "Essential Accessories"}
                        </h3>
                        <p className="text-gray-400 font-medium mt-1">Discover {filteredAccessories.length} items for your library</p>
                    </div>
                </div>

                {filteredAccessories.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
                        {filteredAccessories.map((accessory) => (
                            <div key={accessory.accessoryId} className="transform transition-transform hover:-translate-y-2 duration-300">
                                <AccessoryCard accessory={accessory} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white border border-dashed border-gray-200 rounded-[3rem]">
                        <div className="inline-flex p-8 rounded-full bg-pink-50 text-pink-300 mb-8">
                            <ShoppingBag size={48} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-3">No companions found</h2>
                        <p className="text-gray-400 max-w-sm mx-auto mb-10 font-medium leading-relaxed">
                            We don't have any items in this category right now. Explore our new stationery or bookmarks instead!
                        </p>
                        <Link 
                            to="/accessories"
                            className="inline-block px-12 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-pink-600 transition-all shadow-xl hover:shadow-pink-200 mx-auto"
                        >
                            Reset Selection
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccessoriesPage;