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
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100
                    hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 overflow-hidden group flex flex-col h-full">

            {/* WRAP ONLY IMAGE & TEXT IN LINK */}
            <Link to={`/books/${id}`} className="flex-grow">
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
                    className="p-2 bg-gray-100 text-teal-600 rounded-lg hover:bg-teal-50 transition border border-gray-200"
                    title="Add to Cart"
                >
                    <ShoppingCart size={20} />
                </button>

                {/* Buy Now Button */}
                <button
                    onClick={handleBuyNow}
                    className="flex-grow bg-teal-500 text-white text-sm font-bold py-2 px-4 rounded-lg
                             hover:bg-teal-600 transition duration-150 shadow-md"
                >
                    Buy Now
                </button>
            </div>
        </div>
    );
};

export default BookCard;