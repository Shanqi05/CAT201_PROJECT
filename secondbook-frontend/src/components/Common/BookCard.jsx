import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart } from '../../utils/cartUtils';
import { ShoppingCart, Plus, Minus, Check, X } from 'lucide-react';

const BookCard = ({ book }) => {
    const navigate = useNavigate();

    // 1. STATE
    const [showQty, setShowQty] = useState(false);
    const [quantity, setQuantity] = useState(1);

    // Placeholder data
    const { title, author, price, imageUrl, id, stock } = book || {
        title: "Vivid Adventures",
        author: "L. Carroll",
        price: 18.99,
        imageUrl: "https://via.placeholder.com/200",
        id: 1,
        stock: 5
    };

    // --- HANDLERS ---
    const handleInitClick = (e) => {
        e.preventDefault();
        setShowQty(true);
    };

    const handleCancel = (e) => {
        e.preventDefault();
        setShowQty(false);
        setQuantity(1);
    };

    const increaseQty = (e) => {
        e.preventDefault();
        if (quantity < stock) setQuantity(prev => prev + 1);
    };

    const decreaseQty = (e) => {
        e.preventDefault();
        if (quantity > 1) setQuantity(prev => prev - 1);
    };

    const handleConfirmAdd = (e) => {
        e.preventDefault();
        addToCart({ id, title, price, imageUrl, stock }, quantity);
        setShowQty(false);
        setQuantity(1);
    };

    const handleBuyNow = (e) => {
        e.preventDefault();
        addToCart({ id, title, price, imageUrl, stock }, 1);
        navigate('/checkout');
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-pink-100
                    hover:shadow-2xl hover:scale-[1.02] hover:border-pink-200 transition-all duration-300 overflow-hidden group flex flex-col h-full">

            {/* CARD LINK */}
            <Link to={`/books/${id}`} className="flex-grow flex flex-col">
                <div className="relative overflow-hidden h-64 bg-pink-50">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Stock Badge */}
                    {stock < 5 && stock > 0 && (
                        <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md animate-pulse">
                            Only {stock} left!
                        </div>
                    )}
                    {stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="bg-gray-800 text-white font-bold px-4 py-2 rounded-lg">Out of Stock</span>
                        </div>
                    )}
                </div>

                <div className="p-4 flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-pink-600 transition-colors">{title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{author}</p>
                    <span className="text-2xl font-extrabold text-pink-600">${price.toFixed(2)}</span>
                </div>
            </Link>

            {/* BUTTONS AREA */}
            <div className="p-4 pt-0 mt-auto">
                {showQty ? (
                    // --- QUANTITY SELECTOR (PINK THEME) ---
                    <div className="bg-pink-50 p-2 rounded-xl border border-pink-100 animate-fadeIn">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-pink-400 uppercase">Select Qty</span>
                            <span className="text-xs text-pink-600 font-semibold">Stock: {stock}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Decrease */}
                            <button onClick={decreaseQty} className="p-1 rounded-lg bg-white border border-pink-100 hover:bg-pink-100 text-pink-600">
                                <Minus size={16} />
                            </button>

                            {/* Number */}
                            <span className="flex-grow text-center font-bold text-gray-800">{quantity}</span>

                            {/* Increase */}
                            <button
                                onClick={increaseQty}
                                disabled={quantity >= stock}
                                className={`p-1 rounded-lg border border-pink-100 ${quantity >= stock ? 'bg-gray-100 text-gray-300' : 'bg-white hover:bg-pink-100 text-pink-600'}`}
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        <div className="flex gap-2 mt-2">
                            {/* Cancel */}
                            <button onClick={handleCancel} className="flex-1 py-1 bg-white border border-pink-200 text-gray-400 rounded-lg hover:bg-gray-50 hover:text-red-400 flex justify-center">
                                <X size={16} />
                            </button>
                            {/* Confirm */}
                            <button onClick={handleConfirmAdd} className="flex-1 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 shadow-md flex justify-center">
                                <Check size={16} />
                            </button>
                        </div>
                    </div>
                ) : (
                    // --- NORMAL BUTTONS (PINK THEME) ---
                    <div className="flex gap-2">
                        {/* Add to Cart */}
                        <button
                            onClick={handleInitClick}
                            disabled={stock === 0}
                            className={`p-3 rounded-xl border shadow-sm transition-all duration-300
                                ${stock === 0
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-pink-50 text-pink-600 border-pink-100 hover:bg-pink-100 hover:border-pink-200 hover:scale-105'
                            }`}
                            title="Add to Cart"
                        >
                            <ShoppingCart size={20} />
                        </button>

                        {/* Buy Now */}
                        <button
                            onClick={handleBuyNow}
                            disabled={stock === 0}
                            className={`flex-grow font-bold py-2 px-4 rounded-xl shadow-md transition-all duration-300
                                ${stock === 0
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                            }`}
                        >
                            {stock === 0 ? "Sold Out" : "Buy Now"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookCard;