// secondbook-frontend/src/pages/User/ProductListingPage.jsx
import React, { useState, useEffect } from 'react';
import BookCard from '../../components/Common/BookCard';
import FilterSidebar from '../../components/Products/FilterSidebar';
import mockBooks from '../../api/mockBooks.json'; // 👈 IMPORT MOCK DATA HERE
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const ProductListingPage = () => {
    const [books, setBooks] = useState([]);
    const [filters, setFilters] = useState({
        searchQuery: '',
        categories: [],
        maxPrice: 50
    });
    const [loading, setLoading] = useState(true);

    // --- Load Data on Component Mount ---
    useEffect(() => {
        // Simulate API delay for demonstration
        setTimeout(() => {
            setBooks(mockBooks);
            setLoading(false);
        }, 500);
    }, []);

    // --- Filter Logic ---
    const applyFilters = (currentBooks) => {
        return currentBooks.filter(book => {
            // 1. Search Filter (Title/Author)
            const matchesSearch = filters.searchQuery === '' ||
                book.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                book.author.toLowerCase().includes(filters.searchQuery.toLowerCase());

            // 2. Category Filter
            const matchesCategory = filters.categories.length === 0 ||
                filters.categories.includes(book.category);

            // 3. Price Filter
            const matchesPrice = book.price <= filters.maxPrice;

            return matchesSearch && matchesCategory && matchesPrice;
        });
    };

    const filteredBooks = applyFilters(books);

    // --- Handle Filter Changes from Sidebar ---
    const handleFilterChange = (newFilters) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            ...newFilters,
        }));
    };

    if (loading) {
        return <LoadingSpinner />; // Show the spinner while data loads
    }

    return (
        <div className="page-container">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
                Browse Our Collection ({filteredBooks.length} Books)
            </h1>
            <div className="flex flex-col md:flex-row gap-8">

                {/* Left: Filter Sidebar - NOW DYNAMICALLY UPDATES FILTERS */}
                <div className="md:w-1/4">
                    <FilterSidebar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        availableCategories={['Fiction', 'Non-Fiction', 'Mystery', 'Children']}
                    />
                </div>

                {/* Right: Book Grid */}
                <div className="md:w-3/4">
                    {filteredBooks.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredBooks.map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-12 bg-gray-50 rounded-xl shadow-inner">
                            <h2 className="text-2xl font-semibold text-gray-800">No Books Found 😥</h2>
                            <p className="text-gray-600 mt-2">Try adjusting your filters or search query.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductListingPage;