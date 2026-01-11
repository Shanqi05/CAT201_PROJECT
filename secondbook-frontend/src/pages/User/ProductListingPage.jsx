import React, { useState, useEffect } from 'react';
import BookCard from '../../components/Common/BookCard';
import { Search, SlidersHorizontal, X, Sparkles, Filter } from 'lucide-react';

const ProductListingPage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [maxPrice, setMaxPrice] = useState(200);
    const [filterCondition, setFilterCondition] = useState('All');
    const [filterGenre, setFilterGenre] = useState('All');
    const [filterStatus, setFilterStatus] = useState('Available'); // Default to Available

    // Lists
    const categories = ['All', 'Fiction', 'Non-Fiction', 'Children', 'Others'];
    const conditions = ["Brand new", "Like new", "Acceptable", "Old"];
    const statuses = ["Available", "Sold", "All Status"];

    // Comprehensive Genre List
    const genreOptions = [
        "Action/Adventure", "Art/Photography", "Biography/Memoir", "Business/Finance",
        "Children's", "Comics/Graphic Novels", "Cookbooks/Food", "Crime", "Dystopian",
        "Fantasy", "Fiction", "Health/Fitness", "History", "Historical Fiction", "Horror", "Music",
        "Mystery", "Non-Fiction", "Politics", "Religion/Spirituality", "Romance",
        "Science", "Sci-Fi", "Self-Help", "Technology", "Thriller", "Travel", "Young Adult"
    ];

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await fetch('http://localhost:8080/CAT201_project/getBooks');
            if (response.ok) {
                const data = await response.json();
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

        // 2. Main Category Logic
        const matchesCategory = selectedCategory === 'All' ||
            (book.category && book.category.toLowerCase() === selectedCategory.toLowerCase());

        // 3. Price Logic
        const matchesPrice = book.price <= maxPrice;

        // 4. Condition Logic
        const matchesCondition = filterCondition === 'All' || book.condition === filterCondition;

        // 5. Status Logic
        const matchesStatus = filterStatus === 'All Status' || (book.status || 'Available') === filterStatus;

        // 6. Genre Logic
        let matchesGenre = true;
        if (filterGenre !== 'All') {
            let gList = [];
            if (Array.isArray(book.genres)) gList = book.genres;
            else if (typeof book.genres === 'string') gList = book.genres.replace(/[{"}]/g, '').split(',');

            // Check if chosen genre exists in book's list
            matchesGenre = gList.map(g => g.trim()).includes(filterGenre);
        }

        return matchesSearch && matchesCategory && matchesPrice && matchesCondition && matchesStatus && matchesGenre;
    });

    // Reset all filters
    const clearFilters = () => {
        setSelectedCategory('All');
        setSearchQuery('');
        setFilterCondition('All');
        setFilterGenre('All');
        setFilterStatus('Available');
        setMaxPrice(200);
    };

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
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm transition-all">

                {/* Main Category Tabs */}
                <div className="w-full border-b border-gray-50 overflow-x-auto">
                    <div className="flex justify-center w-full min-w-max">
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

                {/* Search & Filters Row */}
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col xl:flex-row items-center gap-4">

                    {/* Search Input */}
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 group-focus-within:text-purple-600" />
                        <input
                            type="text"
                            placeholder="Find by title, author..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-purple-200 outline-none transition-all text-sm shadow-sm"
                        />
                        {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"><X className="w-3 h-3 text-gray-500" /></button>}
                    </div>

                    {/* Detailed Filters Group */}
                    <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-center xl:justify-end">

                        {/* Genre Filter */}
                        <div className="relative">
                            <select
                                value={filterGenre}
                                onChange={(e) => setFilterGenre(e.target.value)}
                                className="appearance-none bg-gray-50 border border-gray-200 text-gray-600 py-2.5 pl-4 pr-9 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-100 cursor-pointer shadow-sm hover:bg-gray-100 transition-colors"
                            >
                                <option value="All">Genre: All</option>
                                {genreOptions.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
                        </div>

                        {/* Condition Filter */}
                        <div className="relative">
                            <select
                                value={filterCondition}
                                onChange={(e) => setFilterCondition(e.target.value)}
                                className="appearance-none bg-gray-50 border border-gray-200 text-gray-600 py-2.5 pl-4 pr-9 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-100 cursor-pointer shadow-sm hover:bg-gray-100 transition-colors"
                            >
                                <option value="All">Condition: All</option>
                                {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="appearance-none bg-gray-50 border border-gray-200 text-gray-600 py-2.5 pl-4 pr-9 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-100 cursor-pointer shadow-sm hover:bg-gray-100 transition-colors"
                            >
                                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
                        </div>

                        {/* Price Slider */}
                        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl w-full sm:w-auto shadow-sm">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Max RM {maxPrice}</span>
                            <input type="range" min="0" max="200" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-24 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Book Grid */}
            <div className="max-w-7xl mx-auto px-6 py-10 min-h-[60vh]">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                            {selectedCategory === 'All' ? 'Full Collection' : `${selectedCategory} Books`}
                        </h3>
                        <p className="text-gray-400 text-sm font-medium mt-1">Showing {filteredBooks.length} results</p>
                    </div>
                    {/* Clear Filters Button (only shows if filters active) */}
                    {(filterCondition !== 'All' || filterGenre !== 'All' || searchQuery !== '') && (
                        <button onClick={clearFilters} className="text-xs text-red-500 font-bold hover:text-red-700 underline decoration-red-200 underline-offset-4">
                            Clear Active Filters
                        </button>
                    )}
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
                        <p className="text-gray-500 mb-6">Try adjusting your filters or search query.</p>
                        <button onClick={clearFilters} className="px-8 py-3 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors shadow-lg">
                            Clear All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
export default ProductListingPage;