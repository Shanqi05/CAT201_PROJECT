// secondbook-frontend/src/components/Products/FilterSidebar.jsx
import React, { useState } from 'react';

// Receive filters and the function to update them
const FilterSidebar = ({ filters, onFilterChange, availableCategories }) => {
    const [tempSearch, setTempSearch] = useState(filters.searchQuery);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onFilterChange({ searchQuery: tempSearch });
    };

    const handleCategoryChange = (category) => {
        const newCategories = filters.categories.includes(category)
            ? filters.categories.filter(c => c !== category)
            : [...filters.categories, category];
        onFilterChange({ categories: newCategories });
    };

    const handlePriceChange = (e) => {
        onFilterChange({ maxPrice: Number(e.target.value) });
    };

    const handleResetFilters = () => {
        setTempSearch('');
        onFilterChange({
            searchQuery: '',
            categories: [],
            maxPrice: 50
        });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg sticky top-24">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Filter & Search</h3>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search by Title/Author</label>
                <input
                    type="text"
                    value={tempSearch}
                    onChange={(e) => setTempSearch(e.target.value)}
                    placeholder="e.g., sci-fi, Austen"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button type="submit" className="sr-only">Search</button>
            </form>

            {/* Category Filter */}
            <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Category</h4>
                <div className="space-y-2">
                    {availableCategories.map(category => (
                        <div key={category} className="flex items-center">
                            <input
                                id={category}
                                type="checkbox"
                                checked={filters.categories.includes(category)}
                                onChange={() => handleCategoryChange(category)}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor={category} className="ml-3 text-sm text-gray-600">{category}</label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Price Range: RM {filters.maxPrice}</h4>
                <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={filters.maxPrice}
                    onChange={handlePriceChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>RM 0</span>
                    <span>RM 50+</span>
                </div>
            </div>

            <button onClick={handleResetFilters} className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition">
                Reset Filters
            </button>
        </div>
    );
};

export default FilterSidebar;