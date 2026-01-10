import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCartTotal } from '../../utils/cartUtils';
import { CreditCard, Truck, MapPin, Banknote, Smartphone, ExternalLink, Plus } from 'lucide-react';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const [total, setTotal] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [loadingAddresses, setLoadingAddresses] = useState(true);

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });

    useEffect(() => {
        // 1. Load Cart
        setTotal(getCartTotal());
        setCartItems(JSON.parse(localStorage.getItem("shoppingCart") || "[]"));

        // 2. Fetch Addresses from Backend
        const fetchAddresses = async () => {
            try {
                const response = await fetch('http://localhost:8080/CAT201_project/getAddresses', {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    setSavedAddresses(data);
                    // Select first address by default
                    if (data.length > 0) setSelectedAddressId(data[0].addressId);
                }
            } catch (err) {
                console.error("Error loading addresses", err);
            } finally {
                setLoadingAddresses(false);
            }
        };
        fetchAddresses();
    }, []);

    const handleCardChange = (e) => {
        setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!selectedAddressId) {
            alert("Please select a shipping address.");
            return;
        }

        // Validate Card if selected
        if (paymentMethod === 'card') {
            if (cardDetails.number.length < 16 || cardDetails.cvc.length < 3) {
                alert("Please check your card details.");
                return;
            }
        }

        // Prepare JSON Payload
        const orderData = {
            addressId: parseInt(selectedAddressId),
            paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : (paymentMethod === 'tng' ? 'Touch n Go' : 'Credit Card'),
            total: total + 5,
            items: cartItems.map(item => ({
                id: item.bookId || item.id, // Handle both ID formats
                quantity: item.quantity,
                price: item.price
            }))
        };

        try {
            const response = await fetch('http://localhost:8080/CAT201_project/placeOrder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
                credentials: 'include'
            });

            if (response.ok) {
                localStorage.removeItem("shoppingCart");
                window.dispatchEvent(new Event("cartUpdated"));
                navigate('/order-success');
            } else {
                const result = await response.json();
                alert("Order Failed: " + (result.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Order Error:", error);
            alert("Server connection failed.");
        }
    };

    return (
        <div className="page-container py-10 max-w-6xl mx-auto px-4">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">

                    {/* --- 1. SHIPPING ADDRESS SECTION --- */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="flex items-center text-xl font-bold text-gray-700">
                                <MapPin className="mr-2 text-cyan-600" /> Shipping Address
                            </h2>
                            {/* Link to dashboard to add address */}
                            <button onClick={() => navigate('/dashboard')} className="text-sm font-bold text-cyan-600 hover:underline flex items-center">
                                <Plus size={16} className="mr-1"/> Add New
                            </button>
                        </div>

                        {loadingAddresses ? (
                            <p className="text-gray-500">Loading addresses...</p>
                        ) : savedAddresses.length > 0 ? (
                            <div className="space-y-3">
                                {savedAddresses.map((addr) => (
                                    <label key={addr.addressId} className={`block border p-4 rounded-lg cursor-pointer transition-all ${selectedAddressId == addr.addressId ? 'border-cyan-500 bg-cyan-50 ring-1 ring-cyan-500' : 'hover:bg-gray-50'}`}>
                                        <div className="flex items-start">
                                            <input
                                                type="radio"
                                                name="addressSelect"
                                                value={addr.addressId}
                                                checked={selectedAddressId == addr.addressId}
                                                onChange={(e) => setSelectedAddressId(e.target.value)}
                                                className="mt-1 text-cyan-600 focus:ring-cyan-500 mr-3"
                                            />
                                            <div>
                                                <p className="font-bold text-gray-800">{addr.houseNo}, {addr.street}</p>
                                                <p className="text-sm text-gray-600">{addr.city}, {addr.postcode}</p>
                                                <p className="text-sm text-gray-500">{addr.state}</p>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded border border-dashed border-gray-300">
                                <p className="text-gray-500 mb-2">No saved addresses found.</p>
                                <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-black text-white rounded font-bold text-sm">
                                    Create Address in Dashboard
                                </button>
                            </div>
                        )}
                    </div>

                    {/* --- 2. PAYMENT METHOD SECTION --- */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                        <h2 className="flex items-center text-xl font-bold mb-4 text-gray-700">
                            <CreditCard className="mr-2 text-cyan-600" /> Payment Method
                        </h2>
                        <div className="space-y-3">

                            {/* Card Option */}
                            <div className={`border rounded-lg p-4 cursor-pointer transition ${paymentMethod === 'card' ? 'border-cyan-500 bg-cyan-50' : 'hover:bg-gray-50'}`}>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="text-cyan-600 focus:ring-cyan-500"/>
                                    <span className="font-bold text-gray-700">Credit / Debit Card</span>
                                </label>
                                {paymentMethod === 'card' && (
                                    <div className="mt-4 pt-4 border-t border-cyan-200 grid grid-cols-1 gap-3 animate-in fade-in">
                                        <input name="number" value={cardDetails.number} onChange={handleCardChange} type="text" placeholder="Card Number (16 digits)" className="w-full p-2 border rounded" maxLength="16" />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input name="expiry" value={cardDetails.expiry} onChange={handleCardChange} type="text" placeholder="MM/YY" className="w-full p-2 border rounded" maxLength="5"/>
                                            <input name="cvc" value={cardDetails.cvc} onChange={handleCardChange} type="text" placeholder="CVC" className="w-full p-2 border rounded" maxLength="3"/>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* TnG Option */}
                            <div className={`border rounded-lg p-4 cursor-pointer transition ${paymentMethod === 'tng' ? 'border-cyan-500 bg-cyan-50' : 'hover:bg-gray-50'}`}>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="radio" name="paymentMethod" value="tng" checked={paymentMethod === 'tng'} onChange={() => setPaymentMethod('tng')} className="text-cyan-600 focus:ring-cyan-500"/>
                                    <span className="font-bold text-gray-700 flex items-center"><Smartphone size={18} className="mr-2 text-blue-500"/> Touch 'n Go eWallet</span>
                                </label>
                                {paymentMethod === 'tng' && (
                                    <div className="mt-4 pt-4 border-t border-cyan-200 animate-in fade-in">
                                        <div className="flex items-start bg-white p-3 rounded border border-blue-100 text-blue-700 text-sm">
                                            <ExternalLink size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                                            <p>Redirecting to <strong>Touch 'n Go</strong> app after confirmation.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* COD Option */}
                            <div className={`border rounded-lg p-4 cursor-pointer transition ${paymentMethod === 'cod' ? 'border-cyan-500 bg-cyan-50' : 'hover:bg-gray-50'}`}>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="text-cyan-600 focus:ring-cyan-500"/>
                                    <span className="font-bold text-gray-700 flex items-center"><Banknote size={18} className="mr-2 text-green-600"/> Cash on Delivery</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: ORDER SUMMARY --- */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md sticky top-24 border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h2>
                        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                            {cartItems.map((item, index) => (
                                <div key={index} className="flex justify-between items-start text-sm pb-2 border-b border-gray-100">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800 line-clamp-1">{item.title}</p>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <span className="text-gray-700 font-semibold ml-2">RM {(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2 border-b pb-4 mb-4">
                            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>RM {total.toFixed(2)}</span></div>
                            <div className="flex justify-between text-gray-600"><span>Shipping</span><span>RM 5.00</span></div>
                        </div>

                        <div className="flex justify-between text-2xl font-bold text-gray-900 mb-6">
                            <span>Total</span><span>RM {(total + 5).toFixed(2)}</span>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            className="w-full bg-cyan-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-cyan-700 transition flex items-center justify-center shadow-lg transform active:scale-95"
                        >
                            <Truck className="mr-2" /> Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;