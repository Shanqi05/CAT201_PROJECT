import React, { useState, useEffect } from 'react';
import AccessoryCard from '../../components/Common/AccessoryCard';
import { Search, SlidersHorizontal, X, Sparkles } from 'lucide-react';

const AccessoriesPage = () => {
    const [accessories, setAccessories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [maxPrice, setMaxPrice] = useState(200);
    const [loading, setLoading] = useState(true);

    // Map display labels to DB values based on your request
    const categories = [
        { label: 'ALL', value: 'All' },
        { label: 'STICKERS', value: 'Stickers' },
        { label: 'BOOKMARK', value: 'Bookmark' },
        { label: 'BOOK STAND', value: 'Book Stand' },
        { label: 'BAG', value: 'Bag' },
        { label: 'STATIONERY', value: 'Stationery' },
        { label: 'READING LIGHT', value: 'Light' }, // Label: Reading Light, Value: Light
        { label: 'OTHERS', value: 'Other' }
    ];

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
                console.log("Accessories loaded:", data);
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

    const filteredAccessories = accessories.filter(acc => {
        // 1. Search Logic
        const matchesSearch = acc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            acc.description?.toLowerCase().includes(searchQuery.toLowerCase());

        // 2. Category Logic (Exact Match on Value)
        const matchesCategory = selectedCategory === 'All' ||
            (acc.category && acc.category === selectedCategory);

        // 3. Price Logic
        const matchesPrice = acc.price <= maxPrice;

        return matchesSearch && matchesCategory && matchesPrice;
    });

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading accessories...</div>;

    return (
        <div className="w-full bg-[#fdfdfd]">
            {/* 1. Hero Header */}
            <div className="relative h-[300px] md:h-[400px] w-full flex items-center justify-center overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=2000"
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Reading Accessories"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-black/30" />
                <div className="relative z-10 text-center px-6 mt-0">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Sparkles className="text-pink-600 w-5 h-5 animate-pulse" />
                        <span className="text-pink-600 font-bold tracking-[0.2em] text-xs uppercase">Elevate Your Journey</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>
                        The Reading <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-400 italic">Companion.</span>
                    </h1>
                </div>
            </div>

            {/* 2. Sticky Toolbar */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm transition-all">
                {/* Categories */}
                <div className="w-full border-b border-gray-50">
                    <div className="flex justify-center w-full overflow-x-auto no-scrollbar">
                        <div className="flex space-x-2 px-4">
                            {categories.map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => setSelectedCategory(cat.value)}
                                    className={`px-6 py-4 text-xs font-black tracking-widest transition-all duration-300 relative group text-center whitespace-nowrap 
                                    ${selectedCategory === cat.value ? 'text-pink-600 bg-pink-50' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {cat.label}
                                    {selectedCategory === cat.value && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-600" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Filters (Search & Price) */}
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 group-focus-within:text-pink-600" />
                        <input
                            type="text"
                            placeholder="Find stickers, bookmarks, bags..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-pink-200 outline-none transition-all text-sm"
                        />
                        {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"><X className="w-3 h-3 text-gray-500" /></button>}
                    </div>
                    {/* Price Slider */}
                    <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl w-full md:w-auto min-w-[280px]">
                        <SlidersHorizontal className="w-4 h-4 text-pink-500" />
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Max Price</span>
                                <span className="text-xs font-black text-pink-600">RM {maxPrice}</span>
                            </div>
                            <input type="range" min="0" max="200" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Product Grid */}
            <div className="max-w-7xl mx-auto px-6 py-10 min-h-[60vh]">
                <div className="mb-8">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                        {selectedCategory === 'All' ? 'Full Collection' : `${categories.find(c => c.value === selectedCategory)?.label} Collection`}
                    </h3>
                    <p className="text-gray-400 text-sm font-medium mt-1">Showing {filteredAccessories.length} results</p>
                </div>

                {filteredAccessories.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {filteredAccessories.map((accessory) => (
                            <div key={accessory.accessoryId} className="h-full">
                                <AccessoryCard accessory={accessory} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-3xl">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No matches found</h2>
                        <button onClick={() => {setSelectedCategory('All'); setSearchQuery('');}} className="px-8 py-3 bg-black text-white rounded-xl font-bold text-sm">
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccessoriesPage;