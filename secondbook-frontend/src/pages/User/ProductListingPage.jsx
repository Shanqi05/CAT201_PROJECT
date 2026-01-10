import React, { useState, useEffect } from 'react';
import BookCard from '../../components/Common/BookCard';
import { Search, SlidersHorizontal, X, Sparkles } from 'lucide-react';

const ProductListingPage = () => {
    const [books, setBooks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [maxPrice, setMaxPrice] = useState(200);
    const [loading, setLoading] = useState(true);

    const categories = ['All', 'Fiction', 'Non-Fiction', 'Children', 'Others'];

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await fetch('http://localhost:8080/CAT201_project/getBooks');
            if (response.ok) {
                const data = await response.json();
                console.log("Books loaded:", data);
                setBooks(data);
            } else {
                console.error('Failed to fetch books');
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBooks = books.filter(book => {
        // 1. Search Logic
        const matchesSearch = book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author?.toLowerCase().includes(searchQuery.toLowerCase());

        // 2. Category Logic (Case Insensitive)
        const matchesCategory = selectedCategory === 'All' ||
            (book.category && book.category.toLowerCase() === selectedCategory.toLowerCase());

        // 3. Price Logic
        const matchesPrice = book.price <= maxPrice;

        return matchesSearch && matchesCategory && matchesPrice;
    });

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading books...</div>;

    return (
        <div className="w-full bg-[#fdfdfd]">
            {/* 1. Hero Header */}
            <div className="relative h-[300px] md:h-[400px] w-full flex items-center justify-center overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=2000"
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Serene Reading Space"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-black/30" />
                <div className="relative z-10 text-center px-6 mt-0">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Sparkles className="text-purple-600 w-5 h-5 animate-pulse" />
                        <span className="text-purple-600 font-bold tracking-[0.2em] text-xs uppercase">Curated Preloved Treasures</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Your Next Story
                    </h1>
                </div>
            </div>

            {/* Toolbar */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm transition-all">
                <div className="w-full border-b border-gray-50">
                    <div className="flex justify-center w-full">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-4 text-xs font-black tracking-widest transition-all duration-300 relative group text-center ${selectedCategory === cat ? 'text-purple-600 bg-purple-50' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {cat.toUpperCase()}
                                {selectedCategory === cat && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600" />}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 group-focus-within:text-purple-600" />
                        <input
                            type="text"
                            placeholder="Find by title, author..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-purple-200 outline-none transition-all text-sm"
                        />
                        {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"><X className="w-3 h-3 text-gray-500" /></button>}
                    </div>
                    <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl w-full md:w-auto min-w-[280px]">
                        <SlidersHorizontal className="w-4 h-4 text-purple-500" />
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Max Price</span>
                                <span className="text-xs font-black text-purple-600">RM {maxPrice}</span>
                            </div>
                            <input type="range" min="0" max="200" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Book Grid */}
            <div className="max-w-7xl mx-auto px-6 py-10 min-h-[60vh]">
                <div className="mb-8">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                        {selectedCategory === 'All' ? 'Full Collection' : `${selectedCategory} Books`}
                    </h3>
                    <p className="text-gray-400 text-sm font-medium mt-1">Showing {filteredBooks.length} results</p>
                </div>

                {filteredBooks.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {filteredBooks.map((book) => (
                            <div key={book.bookId} className="h-full">
                                <BookCard book={book} />
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
export default ProductListingPage;