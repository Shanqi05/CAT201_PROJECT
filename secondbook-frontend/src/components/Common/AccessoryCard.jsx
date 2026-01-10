import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { addToCart } from '../../utils/cartUtils';
import { ShoppingCart, Plus, Minus, Check, X } from 'lucide-react';

const AccessoryCard = ({ accessory }) => {
    const [showQty, setShowQty] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const API_BASE = "http://localhost:8080/CAT201_project/uploads/";
    const safeAccessory = accessory || {
        title: "Loading...", price: 0, imagePath: null, id: 0, stock: 100
    };

    const { title, price, id, stock, category } = safeAccessory;

    const displayImage = safeAccessory.imagePath
        ? (safeAccessory.imagePath.startsWith('http') ? safeAccessory.imagePath : API_BASE + safeAccessory.imagePath)
        : "https://via.placeholder.com/300x450?text=No+Cover";

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
        if (quantity < (stock || 100)) setQuantity(prev => prev + 1);
    };

    const decreaseQty = (e) => {
        e.preventDefault();
        if (quantity > 1) setQuantity(prev => prev - 1);
    };

    const handleConfirmAdd = (e) => {
        e.preventDefault();
        addToCart({ ...safeAccessory, imageUrl: displayImage }, quantity, 'accessory');
        setShowQty(false);
        setQuantity(1);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-pink-100
                        hover:shadow-2xl hover:scale-[1.02] hover:border-pink-200 transition-all duration-300 overflow-hidden group flex flex-col h-full">

                <div className="relative overflow-hidden h-80 bg-pink-50">
                    <img
                        src={displayImage}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {e.target.src = "https://via.placeholder.com/300x450?text=Error"}}
                    />
                </div>

                <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-pink-600 transition-colors">{title}</h3>
                        {category && <p className="text-xs text-gray-500 mt-1 font-medium">{category}</p>}
                        {stock && <p className="text-xs text-green-600 mt-2 font-semibold">{stock} available</p>}
                    </div>
                    <span className="text-2xl font-extrabold text-pink-600 block mt-2">RM {parseFloat(price).toFixed(2)}</span>
                </div>

                {/* BUTTONS AREA */}
                <div className="p-4 pt-0 mt-auto">
                    {showQty ? (
                        <div className="bg-pink-50 p-2 rounded-xl border border-pink-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-pink-400 uppercase">Select Qty</span>
                                <span className="text-xs text-pink-600 font-semibold">{stock || 100} available</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button onClick={decreaseQty} className="p-1 rounded-lg bg-white border border-pink-100 hover:bg-pink-100 text-pink-600">
                                    <Minus size={16} />
                                </button>
                                <span className="flex-grow text-center font-bold text-gray-800">{quantity}</span>
                                <button onClick={increaseQty} disabled={quantity >= (stock || 100)} className={`p-1 rounded-lg border border-pink-100 ${quantity >= (stock || 100) ? 'bg-gray-100 text-gray-300' : 'bg-white hover:bg-pink-100 text-pink-600'}`}>
                                    <Plus size={16} />
                                </button>
                            </div>

                            <div className="flex gap-2 mt-2">
                                <button onClick={handleCancel} className="flex-1 py-1 bg-white border border-pink-200 text-gray-400 rounded-lg hover:bg-gray-50 hover:text-red-400 flex justify-center">
                                    <X size={16} />
                                </button>
                                <button onClick={handleConfirmAdd} className="flex-1 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 shadow-md flex justify-center">
                                    <Check size={16} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleInitClick}
                                className="p-3 rounded-xl border shadow-sm transition-all duration-300 bg-pink-50 text-pink-600 border-pink-100 hover:bg-pink-100 hover:border-pink-200 hover:scale-105"
                                title="Add to Cart"
                            >
                                <ShoppingCart size={20} />
                            </button>
                            <button
                                onClick={handleInitClick}
                                className="flex-grow font-bold py-2 px-4 rounded-xl shadow-md transition-all duration-300 bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-lg hover:scale-105"
                            >
                                Add to Cart
                            </button>
                        </div>
                    )}
                </div>
        </div>
    );
};

export default AccessoryCard;
