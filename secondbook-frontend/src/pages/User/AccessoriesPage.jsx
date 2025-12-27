// secondbook-frontend/src/pages/User/AccessoriesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, Zap, Gift, ShoppingBag, ChevronDown, Sparkles } from 'lucide-react';

import BookCard from '../../components/Common/BookCard';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const keyCategories = [
    { key: 'Lighting', label: 'Book Lights', icon: Zap, color: 'text-cyan-500' },
    { key: 'Keepsakes', label: 'Bookmarks', icon: BookOpen, color: 'text-pink-500' },
    { key: 'Gifts', label: 'Gift Sets', icon: Gift, color: 'text-green-500' },
    { key: 'Writing', label: 'Journals & Pens', icon: BookOpen, color: 'text-indigo-500' },
];

const AccessoriesPage = () => {
    const [accessories, setAccessories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();

    // Get the category filter from the URL
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
            } else {
                console.error('Failed to fetch accessories');
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

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="w-full bg-[#fdfdfd]">
            {/* 1. 明亮的 Hero Header */}
            <div className="relative h-[350px] w-full flex items-center justify-center overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=2000" 
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Reading Accessories"
                />
                {/* 渐变遮罩 */}
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
                        Tools, keepsakes, and gifts designed to make every page turn more magical.
                    </p>
                </div>
            </div>

            {/* 2. 交互式分类导航 (Sticky) */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex w-full overflow-x-auto no-scrollbar">
                        {/* "All" 分类 */}
                        <Link 
                            to="/accessories"
                            className={`flex-1 py-5 text-xs font-black tracking-widest text-center transition-all duration-300 border-b-2 ${
                                !activeCategory ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            ALL ITEMS
                        </Link>
                        {keyCategories.map((cat) => (
                            <Link
                                key={cat.key}
                                to={`/accessories?category=${cat.key}`}
                                className={`flex-1 py-5 text-xs font-black tracking-widest text-center transition-all duration-300 border-b-2 ${
                                    activeCategory === cat.key 
                                    ? 'border-pink-600 text-pink-600' 
                                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-pink-50/50'
                                }`}
                            >
                                {cat.label.toUpperCase()}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. 产品展示网格 */}
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
                            <div key={accessory.id} className="transform transition-transform hover:-translate-y-2 duration-300">
                                <BookCard book={accessory} />
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
                            We don't have any items in this category right now. Explore our bookmarks or gift sets instead!
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