import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart } from '../../utils/cartUtils'; // <--- Import logic
import { ShoppingCart } from 'lucide-react';      // <--- Import Icon

const BookCard = ({ book }) => {
    const navigate = useNavigate();

    // Placeholder data if no book prop is passed
    const { title, author, price, imageUrl, id } = book || {
        title: "Vivid Adventures in Wonderland",
        author: "L. Carroll",
        price: 18.99,
        imageUrl: "https://via.placeholder.com/200x300/67e8f9/ffffff?text=Book+Cover",
        id: 1,
    };

    // 1. Logic for Add to Cart
    const handleAddToCart = (e) => {
        e.preventDefault(); // Stop the click from bubbling up
        addToCart({ id, title, price, imageUrl }); // Save to memory
    };

    // 2. Logic for Buy Now
    const handleBuyNow = (e) => {
        e.preventDefault();
        addToCart({ id, title, price, imageUrl }); // Save first
        navigate('/cart'); // Then go to checkout
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200
                    hover:shadow-2xl hover:scale-[1.05] hover:-rotate-1 transition-all duration-300 overflow-hidden group flex flex-col h-full transform">

            {/* WRAP ONLY IMAGE & TEXT IN LINK */}
            <Link to={`/books/${id}`} className="flex-grow">
                {/* Image Display */}
                <div className="relative overflow-hidden h-64">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-900 truncate" title={title}>
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{author}</p>
                    <div className="mt-2">
                        <span className="text-2xl font-extrabold text-pink-600">${price.toFixed(2)}</span>
                    </div>
                </div>
            </Link>

            {/* BUTTONS AREA (Outside the Link so they work independently) */}
            <div className="p-4 pt-0 mt-auto flex gap-2">

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 rounded-xl hover:from-purple-200 hover:to-pink-200 transition-all duration-300 border border-purple-200 shadow-md hover:shadow-lg transform hover:scale-110"
                    title="Add to Cart"
                >
                    <ShoppingCart size={20} />
                </button>

                {/* Buy Now Button */}
                <button
                    onClick={handleBuyNow}
                    className="flex-grow bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold py-2 px-4 rounded-xl
                             hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                    Buy Now
                </button>
            </div>
        </div>
    );
};

export default BookCard;