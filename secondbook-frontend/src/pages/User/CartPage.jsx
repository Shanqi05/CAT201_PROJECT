import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';

const CartPage = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const storedCart = localStorage.getItem("shoppingCart");
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    const updateQuantity = (index, change) => {
        const newCart = [...cartItems];
        const newQuantity = newCart[index].quantity + change;

        // Validation
        if (newQuantity < 1) return;
        // Check stock only if the item has a 'stock' property
        if (newCart[index].stock !== undefined && newQuantity > newCart[index].stock) return;

        newCart[index].quantity = newQuantity;
        setCartItems(newCart);
        localStorage.setItem("shoppingCart", JSON.stringify(newCart));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const removeFromCart = (indexToRemove) => {
        const newCart = cartItems.filter((_, index) => index !== indexToRemove);
        setCartItems(newCart);
        localStorage.setItem("shoppingCart", JSON.stringify(newCart));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <div className="page-container py-10 max-w-7xl mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500 text-xl mb-4">Your cart is empty.</p>
                    <button onClick={() => navigate('/books')} className="px-6 py-2 bg-black text-white rounded font-bold">
                        Browse Books
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* LEFT: Items List */}
                    <div className="md:col-span-2 space-y-4">
                        {cartItems.map((item, index) => (
                            <div key={index} className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center space-x-4 w-full sm:w-auto">
                                    <img src={item.imageUrl} alt={item.title} className="w-16 h-20 object-cover rounded bg-gray-100" />
                                    <div>
                                        <h3 className="font-bold text-gray-800 line-clamp-1">{item.title}</h3>
                                        <p className="text-gray-500 text-sm">RM {item.price.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                                    {/* Logic: Only show + / - if it's NOT a unique secondhand book, OR if we decide all items are unique, remove this.
                                       Assuming Accessories have qty, Books don't. */}
                                    {item.itemType === 'accessory' ? (
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => updateQuantity(index, -1)} className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(index, 1)} className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-sm font-bold text-gray-400">Qty: 1</span>
                                    )}

                                    <span className="font-bold text-cyan-600 text-lg w-24 text-right">RM {(item.price * item.quantity).toFixed(2)}</span>

                                    <button onClick={() => removeFromCart(index)} className="text-red-400 hover:text-red-600 p-2">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT: Summary */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h2>
                            <div className="flex justify-between text-lg font-semibold mb-6 text-gray-700">
                                <span>Total:</span>
                                <span>RM {cartTotal.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-cyan-600 text-white py-3 rounded-lg font-bold hover:bg-cyan-700 transition shadow-lg active:scale-95"
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