import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../utils/cartUtils';
import { ShoppingCart, Plus, Minus, Check, X, AlertCircle, Image as ImageIcon } from 'lucide-react';

const AccessoryCard = ({ accessory }) => {
    const navigate = useNavigate();
    const [showQty, setShowQty] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [imgError, setImgError] = useState(false);

    const API_BASE = "http://localhost:8080/CAT201_project/uploads/";

    // 1. [DEBUG] Check your browser console to see exactly what keys your backend sends
    // console.log("Accessory Data:", accessory);

    const safeAccessory = accessory || {
        title: "Loading...", price: 0, imagePath: null, id: 0, stock: 0
    };

    // 2. [FIX] Check ALL possible key names for the image
    const rawImage = safeAccessory.imagePath
        || safeAccessory.image
        || safeAccessory.img
        || safeAccessory.file;

    // 3. [FIX] Handle IDs
    const id = safeAccessory.accessoryId || safeAccessory.id || 0;

    const { title, price, stock, category } = safeAccessory;
    const isOutOfStock = (stock !== undefined && stock <= 0);

    // 4. [FIX] Construct URL safely with Encoding (Handles spaces in filenames)
    let displayImage = null;
    if (rawImage && !imgError) {
        if (rawImage.startsWith('http')) {
            displayImage = rawImage;
        } else {
            // Clean the filename and encode it
            const cleanName = rawImage.replace(/\\/g, '/').split('/').pop();
            displayImage = API_BASE + encodeURIComponent(cleanName);
        }
    }

    const handleInitClick = (e) => {
        e.preventDefault();
        if (!isOutOfStock) setShowQty(true);
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
        addToCart({ ...safeAccessory, id, imageUrl: displayImage }, quantity, 'accessory', true);
        setShowQty(false);
        setQuantity(1);
    };

    const handleBuyNow = (e) => {
        e.preventDefault();
        if (!isOutOfStock) {
            addToCart({ ...safeAccessory, id, imageUrl: displayImage }, quantity, 'accessory', false);
            navigate('/checkout');
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-pink-100
                        hover:shadow-2xl hover:scale-[1.02] hover:border-pink-200 transition-all duration-300 overflow-hidden group flex flex-col h-full">

            {/* IMAGE AREA */}
            <div className="block relative overflow-hidden h-80 bg-pink-50 flex items-center justify-center">
                {displayImage ? (
                    <img
                        src={displayImage}
                        alt={title}
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isOutOfStock ? 'opacity-40 grayscale' : ''}`}
                        onError={(e) => {
                            console.error("Failed to load image:", displayImage);
                            setImgError(true); // Switch to fallback icon
                        }}
                    />
                ) : (
                    // 5. [FIX] Local Fallback (No internet needed)
                    <div className="flex flex-col items-center justify-center text-pink-300">
                        <ImageIcon size={48} strokeWidth={1.5} />
                        <span className="text-xs mt-2 font-bold uppercase tracking-wider text-pink-300">No Preview</span>
                    </div>
                )}

                {/* Out of Stock Overlay */}
                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/20 backdrop-blur-[2px] z-10">
                        <span className="bg-black text-cyan-400 px-6 py-2.5 rounded-lg font-black text-xs uppercase tracking-[0.2em] shadow-2xl border border-gray-800">
                            Sold Out
                        </span>
                    </div>
                )}
            </div>

            <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                    <h3 className={`text-lg font-bold line-clamp-2 transition-colors ${isOutOfStock ? 'text-gray-400' : 'text-gray-900 group-hover:text-pink-600'}`}>
                        {title || "Untitled"}
                    </h3>
                    {category && <p className="text-xs text-gray-500 mt-1 font-medium">{category}</p>}

                    {!isOutOfStock && (
                        <p className={`text-xs mt-2 font-bold flex items-center ${stock < 5 ? 'text-orange-500' : 'text-green-600'}`}>
                            {stock < 5 && <AlertCircle size={12} className="mr-1"/>}
                            {stock} left in stock
                        </p>
                    )}
                </div>
                <span className={`text-2xl font-extrabold block mt-2 ${isOutOfStock ? 'text-gray-300 line-through' : 'text-pink-600'}`}>
                    RM {parseFloat(price || 0).toFixed(2)}
                </span>
            </div>

            {/* BUTTONS AREA */}
            <div className="p-4 pt-0 mt-auto">
                {showQty ? (
                    <div className="bg-pink-50 p-2 rounded-xl border border-pink-100 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-pink-400 uppercase">Select Qty</span>
                            <span className="text-xs text-pink-600 font-semibold">{stock} max</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={decreaseQty} className="p-1 rounded-lg bg-white border border-pink-100 hover:bg-pink-100 text-pink-600"><Minus size={16} /></button>
                            <span className="flex-grow text-center font-bold text-gray-800">{quantity}</span>
                            <button onClick={increaseQty} disabled={quantity >= stock} className={`p-1 rounded-lg border border-pink-100 ${quantity >= stock ? 'bg-gray-100 text-gray-300' : 'bg-white hover:bg-pink-100 text-pink-600'}`}><Plus size={16} /></button>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <button onClick={handleCancel} className="flex-1 py-1 bg-white border border-pink-200 text-gray-400 rounded-lg hover:bg-gray-50 hover:text-red-400 flex justify-center"><X size={16} /></button>
                            <button onClick={handleConfirmAdd} className="flex-1 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 shadow-md flex justify-center"><Check size={16} /></button>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <button onClick={handleInitClick} disabled={isOutOfStock} className={`p-3 rounded-xl border shadow-sm transition-all duration-300 ${isOutOfStock ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed' : 'bg-pink-50 text-pink-600 border-pink-100 hover:bg-pink-100 hover:border-pink-200 hover:scale-105'}`}>
                            <ShoppingCart size={20} />
                        </button>
                        <button onClick={handleBuyNow} disabled={isOutOfStock} className={`flex-grow font-bold py-2 px-4 rounded-xl shadow-md transition-all duration-300 ${isOutOfStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'}`}>
                            {isOutOfStock ? 'Sold Out' : 'Buy Now'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccessoryCard;