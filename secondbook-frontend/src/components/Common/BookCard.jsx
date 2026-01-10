import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart } from '../../utils/cartUtils';
import { ShoppingCart } from 'lucide-react';

const BookCard = ({ book }) => {
    const navigate = useNavigate();


    const API_BASE = "http://localhost:8080/CAT201_project/uploads/";
    const safeBook = book || {
        title: "Loading...", author: "", price: 0, imagePath: null, id: 0, stock: 0
    };

    const { title, author, price, id } = safeBook;

    // Logic: If it starts with 'http', it's an external link (placeholder).
    // If not, it's your local file, so add the API_BASE.
    const displayImage = safeBook.imagePath
        ? (safeBook.imagePath.startsWith('http') ? safeBook.imagePath : API_BASE + safeBook.imagePath)
        : "https://via.placeholder.com/300x450?text=No+Cover";

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-pink-100
                        hover:shadow-2xl hover:scale-[1.02] hover:border-pink-200 transition-all duration-300 overflow-hidden group flex flex-col h-full">

            {/* CARD LINK */}
            <Link to={`/books/${id}`} className="flex-grow flex flex-col">
                <div className="relative overflow-hidden h-80 bg-pink-50">
                    {/* Increased height to h-80 to see cover better */}
                    <img
                        src={displayImage}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {e.target.src = "https://via.placeholder.com/300x450?text=Error"}}
                    />
                    {/* No stock badge for secondhand single items */}
                </div>

                <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-pink-600 transition-colors">{title}</h3>
                        <p className="text-sm text-gray-500 mb-2">{author}</p>
                    </div>
                    <span className="text-2xl font-extrabold text-pink-600 block mt-2">RM {parseFloat(price).toFixed(2)}</span>
                </div>
            </Link>

            {/* BUTTONS AREA: direct add-to-cart for single-copy secondhand books */}
            <div className="p-4 pt-0 mt-auto">
                <div className="flex gap-2">
                    <button
                        onClick={(e) => { e.preventDefault(); addToCart({ ...safeBook, imageUrl: displayImage }, 1); }}
                        className={`p-3 rounded-xl border shadow-sm transition-all duration-300 bg-pink-50 text-pink-600 border-pink-100 hover:bg-pink-100 hover:border-pink-200 hover:scale-105`}
                        title="Add to Cart"
                    >
                        <ShoppingCart size={20} />
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); addToCart({ ...safeBook, imageUrl: displayImage }, 1); navigate('/checkout'); }}
                        className={`flex-grow font-bold py-2 px-4 rounded-xl shadow-md transition-all duration-300 bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-lg hover:scale-105`}
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookCard;