// secondbook-frontend/src/components/Common/BookCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
    // Placeholder data if no book prop is passed
    const { title, author, price, imageUrl, id } = book || {
        title: "The Old Man and the Sea",
        author: "Ernest Hemingway",
        price: 12.99,
        imageUrl: "https://via.placeholder.com/200x300?text=Book+Cover",
        id: 1,
    };

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <Link to={`/books/${id}`}>
                {/* Image Display */}
                <div className="relative overflow-hidden h-64">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 truncate" title={title}>
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{author}</p>
                    <div className="flex justify-between items-center mt-3">
                        <span className="text-xl font-bold text-indigo-600">${price.toFixed(2)}</span>
                        <button className="bg-green-500 text-white text-sm font-medium py-1 px-3 rounded-full hover:bg-green-600 transition duration-150">
                            Buy Now
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default BookCard;