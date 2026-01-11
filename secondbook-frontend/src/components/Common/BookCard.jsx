import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart } from '../../utils/cartUtils';
import { ShoppingCart, Tag } from 'lucide-react'; // Added Tag icon

const BookCard = ({ book }) => {
    const navigate = useNavigate();

    const API_BASE = "http://localhost:8080/CAT201_project/uploads/";

    // Default safe object
    const safeBook = book || {
        title: "Loading...", author: "", price: 0, imagePath: null, bookId: 0, status: 'Available', genres: [], condition: 'Good'
    };

    // Destructure properties
    const { title, author, price, bookId, status, genres, condition } = safeBook;

    // Check if sold
    const isSoldOut = status === 'Sold';

    // Checks if it's an external URL (Supabase) or local upload
    const displayImage = safeBook.imagePath
        ? (safeBook.imagePath.startsWith('http') ? safeBook.imagePath : API_BASE + safeBook.imagePath)
        : "https://via.placeholder.com/300x450?text=No+Cover";

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-pink-100
                        hover:shadow-2xl hover:scale-[1.02] hover:border-pink-200 transition-all duration-300 overflow-hidden group flex flex-col h-full relative">

            {/* CARD LINK */}
            <Link
                to={isSoldOut ? '#' : `/books/${bookId}`}
                onClick={(e) => isSoldOut && e.preventDefault()}
                className={`flex-grow flex flex-col relative ${isSoldOut ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <div className="relative overflow-hidden h-80 bg-pink-50">
                    {/* Condition Badge */}
                    <div className="absolute top-3 right-3 z-20">
                        <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-700 shadow-sm border border-gray-100 flex items-center gap-1">
                            <Tag size={10} className="text-pink-500"/>
                            {condition || 'Preloved'}
                        </span>
                    </div>

                    {/* Image with grayscale effect if sold */}
                    <img
                        src={displayImage}
                        alt={title}
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isSoldOut ? 'opacity-40 grayscale' : ''}`}
                        onError={(e) => {e.target.style.display = 'none'}}
                    />

                    {/* Sold Out Overlay */}
                    {isSoldOut && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/20 backdrop-blur-[2px] z-10">
                            <span className="bg-black text-cyan-400 px-6 py-2.5 rounded-lg font-black text-xs uppercase tracking-[0.2em] shadow-2xl border border-gray-800">
                                Sold Out
                            </span>
                        </div>
                    )}
                </div>

                <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                        <h3 className={`text-lg font-bold line-clamp-2 transition-colors ${isSoldOut ? 'text-gray-400' : 'text-gray-900 group-hover:text-pink-600'}`}>
                            {title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">{author}</p>

                        {/* Genre Pills */}
                        <div className="flex flex-wrap gap-1 mb-2">
                            {(() => {
                                if (!genres) return null;
                                let gList = [];
                                if (Array.isArray(genres)) gList = genres;
                                else if (typeof genres === 'string') gList = genres.replace(/[{"}]/g, '').split(',');

                                // Show top 3 genres max
                                return gList.filter(g => g && g.trim() !== '').slice(0, 3).map((g, i) => (
                                    <span key={i} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200 font-medium">
                                        {g.trim()}
                                    </span>
                                ));
                            })()}
                        </div>
                    </div>

                    {/* Price */}
                    <span className={`text-2xl font-extrabold block mt-auto ${isSoldOut ? 'text-gray-300 line-through decoration-2' : 'text-pink-600'}`}>
                        RM {parseFloat(price).toFixed(2)}
                    </span>
                </div>
            </Link>

            {/* BUTTONS AREA */}
            <div className="p-4 pt-0 mt-auto">
                <div className="flex gap-2">
                    {/* Add to Cart */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            if (!isSoldOut) addToCart({ ...safeBook, imageUrl: displayImage }, 1, 'book', true);
                        }}
                        disabled={isSoldOut}
                        className={`p-3 rounded-xl border shadow-sm transition-all duration-300 
                            ${isSoldOut
                            ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                            : 'bg-pink-50 text-pink-600 border-pink-100 hover:bg-pink-100 hover:border-pink-200 hover:scale-105'
                        }`}
                        title={isSoldOut ? "Item is Sold Out" : "Add to Cart"}
                    >
                        <ShoppingCart size={20} />
                    </button>

                    {/* Buy Now */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            if (!isSoldOut) {
                                addToCart({ ...safeBook, imageUrl: displayImage }, 1, 'book', false);
                                navigate('/checkout');
                            }
                        }}
                        disabled={isSoldOut}
                        className={`flex-grow font-bold py-2 px-4 rounded-xl shadow-md transition-all duration-300 
                            ${isSoldOut
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                            : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                        }`}
                    >
                        {isSoldOut ? 'Unavailable' : 'Buy Now'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookCard;