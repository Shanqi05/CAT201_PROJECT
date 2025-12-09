// secondbook-frontend/src/components/Common/BookCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
    // Placeholder data if no book prop is passed
    const { title, author, price, imageUrl, id } = book || {
        title: "Vivid Adventures in Wonderland",
        author: "L. Carroll",
        price: 18.99,
        imageUrl: "https://via.placeholder.com/200x300/67e8f9/ffffff?text=Book+Cover", // Placeholder with new color
        id: 1,
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100
                    hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 overflow-hidden group">
            <Link to={`/books/${id}`}>
                {/* Image Display */}
                <div className="relative overflow-hidden h-64">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-900 truncate" title={title}>
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{author}</p>
                    <div className="flex justify-between items-center mt-3">
                        {/* Price in a contrasting vibrant color */}
                        <span className="text-2xl font-extrabold text-pink-600">${price.toFixed(2)}</span>
                        <button className="bg-teal-500 text-white text-sm font-medium py-2 px-4 rounded-full
                             hover:bg-teal-600 transition duration-150 shadow-md">
                            Buy Now
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default BookCard;