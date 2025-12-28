// secondbook-frontend/src/pages/User/ProductListingPage.jsx
import React, { useState, useEffect } from 'react';
import BookCard from '../../components/Common/BookCard';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { Search, SlidersHorizontal, X, Sparkles } from 'lucide-react';

const ProductListingPage = () => {
    const [books, setBooks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [maxPrice, setMaxPrice] = useState(100); 
    const [loading, setLoading] = useState(true);

    const categories = ['All', 'Fiction', 'Non-Fiction', 'Mystery', 'Children'];

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await fetch('http://localhost:8080/CAT201_project/getBooks', {
                method: 'GET',
                credentials: 'include',
            });
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
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             book.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
        const matchesPrice = book.price <= maxPrice;
        return matchesSearch && matchesCategory && matchesPrice;
    });

    if (loading) return <LoadingSpinner />;

    return (
        <div className="w-full bg-[#fdfdfd]">
            {/* 1. 吸引人的明亮 Hero Header */}
            <div className="relative h-[400px] w-full flex items-center justify-center overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=2000" 
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Serene Reading Space"
                />
                {/* 渐变层：底部留白感，让内容过渡更自然 */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-black/10" />
                
                <div className="relative z-10 text-center px-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Sparkles className="text-purple-600 w-5 h-5 animate-pulse" />
                        <span className="text-purple-600 font-bold tracking-[0.2em] text-xs uppercase">Curated Preloved Treasures</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Your Next Story <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500 italic">is Waiting.</span>
                    </h1>
                    <p className="mt-6 text-gray-600 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                        Explore our library of 40,000+ hand-picked books that are looking for a new home. 
                    </p>
                </div>
            </div>

            {/* 2. 整合后的工具栏 (Sticky) */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6">
                    {/* 分类栏 - Evenly Distributed */}
                    <div className="flex w-full overflow-x-auto no-scrollbar border-b border-gray-50">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`flex-1 py-5 text-xs font-black tracking-widest transition-all duration-300 relative group ${
                                    selectedCategory === cat 
                                    ? 'text-purple-600' 
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-purple-50/50'
                                }`}
                            >
                                {cat.toUpperCase()}
                                {selectedCategory === cat && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* 搜索与价格整合区 */}
                    <div className="py-5 flex flex-col md:flex-row items-center gap-6">
                        {/* 搜索控制台 */}
                        <div className="relative flex-1 w-full group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 group-focus-within:text-purple-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Find by title, author or genre..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-10 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:border-purple-200 focus:ring-4 focus:ring-purple-50 outline-none transition-all placeholder:text-gray-300 font-medium"
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-3.5 h-3.5 text-gray-400" />
                                </button>
                            )}
                        </div>

                        {/* 价格控制台 */}
                        <div className="flex items-center gap-4 bg-gray-50/80 border border-gray-100 px-6 py-3 rounded-2xl w-full md:w-auto min-w-[300px]">
                            <SlidersHorizontal className="w-4 h-4 text-purple-500" />
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Budget RM</span>
                                    <span className="text-sm font-black text-purple-600">{maxPrice}</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="200" 
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. 内容展示 */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="h-1 w-12 bg-purple-600 mb-4" />
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                            {selectedCategory === 'All' ? 'Full Collection' : `${selectedCategory} Specials`}
                        </h3>
                        <p className="text-gray-400 font-medium mt-1">Found {filteredBooks.length} preloved books in this view</p>
                    </div>
                </div>

                {filteredBooks.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-14">
                        {filteredBooks.map((book) => (
                            <div key={book.id} className="transform transition-transform hover:-translate-y-1 duration-300">
                                <BookCard book={book} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40 bg-white border border-dashed border-gray-200 rounded-[3rem]">
                        <div className="inline-flex p-8 rounded-full bg-purple-50 text-purple-300 mb-8">
                            <Search size={48} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-3">No matches found</h2>
                        <p className="text-gray-400 max-w-sm mx-auto mb-10 font-medium leading-relaxed">
                            Try broadening your search or price range. Sometimes the best stories are hidden in other categories.
                        </p>
                        <button 
                            onClick={() => {setSelectedCategory('All'); setSearchQuery(''); setMaxPrice(100);}}
                            className="px-12 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-purple-600 transition-all shadow-xl hover:shadow-purple-200 flex items-center gap-3 mx-auto"
                        >
                            Reset Explorer
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductListingPage;