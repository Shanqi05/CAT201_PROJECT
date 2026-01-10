import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- IMPORTED NAVIGATE
import { Trash2, Plus, Minus } from 'lucide-react';

const CartPage = () => {
    const navigate = useNavigate(); // <--- ENABLE NAVIGATION
    const [cartItems, setCartItems] = useState([]);

    // Load cart from storage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem("shoppingCart");
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    const updateQuantity = (index, change) => {
        const newCart = [...cartItems];
        const newQuantity = newCart[index].quantity + change;
        
        // Check if quantity is valid
        if (newQuantity < 1) return;
        if (newCart[index].stock && newQuantity > newCart[index].stock) return;
        
        newCart[index].quantity = newQuantity;
        setCartItems(newCart);
        localStorage.setItem("shoppingCart", JSON.stringify(newCart));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const removeFromCart = (indexToRemove) => {
        const newCart = cartItems.filter((_, index) => index !== indexToRemove);
        setCartItems(newCart);
        localStorage.setItem("shoppingCart", JSON.stringify(newCart));

        // Notify Header to update the red badge
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <div className="page-container py-10">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-xl mb-4">Your cart is empty.</p>
                    <button
                        onClick={() => navigate('/books')}
                        className="text-cyan-600 font-bold hover:underline"
                    >
                        Go browse some books!
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* LEFT: Items List */}
                    <div className="md:col-span-2 space-y-4">
                        {cartItems.map((item, index) => (
                            <div key={index} className="flex justify-between items-center bg-white p-4 rounded shadow hover:shadow-md transition">
                                <div className="flex items-center space-x-4">
                                    {/* Small Image Preview */}
                                    <img src={item.imageUrl} alt={item.title} className="w-16 h-20 object-cover rounded bg-gray-200" />

                                    <div>
                                        <h3 className="font-bold text-gray-800">{item.title}</h3>
                                        <p className="text-gray-500 text-sm">RM {item.price.toFixed(2)} each</p>
                                        {(item.stock || item.quantity) && (
                                            <p className="text-xs text-green-600">{item.stock || item.quantity} available</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQuantity(index, -1)}
                                            disabled={item.quantity <= 1}
                                            className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-12 text-center font-bold text-gray-800">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(index, 1)}
                                            disabled={item.stock && item.quantity >= item.stock}
                                            className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    <span className="font-bold text-cyan-600 text-lg w-20 text-right">RM {(item.price * item.quantity).toFixed(2)}</span>
                                    <button
                                        onClick={() => removeFromCart(index)}
                                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded transition"
                                        title="Remove Item"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT: Summary & Checkout */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded shadow sticky top-24 border border-gray-100">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h2>
                            <div className="flex justify-between text-lg font-semibold mb-6 text-gray-700">
                                <span>Total:</span>
                                <span>RM {cartTotal.toFixed(2)}</span>
                            </div>

                            {/* THIS BUTTON NOW GOES TO CHECKOUT */}
                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-lg transform hover:-translate-y-0.5"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;