import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCartTotal } from '../../utils/cartUtils';
import { CreditCard, Truck, MapPin, Banknote, Save } from 'lucide-react'; // Removed Landmark

const CheckoutPage = () => {
    const navigate = useNavigate();
    const [total, setTotal] = useState(0);
    const [cartItems, setCartItems] = useState([]);

    // State for Saved Addresses
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [saveAddressChecked, setSaveAddressChecked] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
        paymentMethod: 'card', // Default
        // Payment Details (Card Only)
        cardNumber: '',
        cardExpiry: '',
        cardCvc: ''
    });

    // --- 1. LOAD DATA ON MOUNT ---
    useEffect(() => {
        // A. Calculate Total
        setTotal(getCartTotal());

        // B. Load Cart Items
        const items = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
        setCartItems(items);

        // C. Load Saved Addresses
        const storedAddresses = JSON.parse(localStorage.getItem("userAddresses") || "[]");
        setSavedAddresses(storedAddresses);

        // D. AUTO-FILL
        const registeredUser = JSON.parse(localStorage.getItem("registeredUser"));
        if (registeredUser) {
            setFormData(prev => ({
                ...prev,
                fullName: registeredUser.name || '',
                phone: registeredUser.phone || ''
            }));
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- 2. HANDLE ADDRESS SELECTION ---
    const handleAddressSelect = (e) => {
        const index = e.target.value;
        if (index !== "") {
            const selected = savedAddresses[index];
            setFormData(prev => ({
                ...prev,
                fullName: selected.fullName,
                phone: selected.phone,
                address: selected.address,
                city: selected.city,
                zip: selected.zip
            }));
        } else {
            const registeredUser = JSON.parse(localStorage.getItem("registeredUser"));
            setFormData(prev => ({
                ...prev,
                address: '', city: '', zip: '',
                fullName: registeredUser?.name || '',
                phone: registeredUser?.phone || ''
            }));
        }
    };

    // --- 3. VALIDATION LOGIC ---
    const validateForm = () => {
        // Basic Fields
        if(!formData.address || !formData.phone || !formData.fullName || !formData.city || !formData.zip) {
            alert("Please fill in all shipping details.");
            return false;
        }

        // Zip Code
        if (!/^\d{5}$/.test(formData.zip)) {
            alert("Invalid Zip Code! It must be exactly 5 digits (e.g., 11900).");
            return false;
        }

        // Phone
        if (formData.phone.length < 10) {
            alert("Invalid Phone Number!");
            return false;
        }

        // Payment Validation (Card Only)
        if (formData.paymentMethod === 'card') {
            if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
                alert("Invalid Card Number! Must be 16 digits.");
                return false;
            }
            if (!/^\d{3}$/.test(formData.cardCvc)) {
                alert("Invalid CVV! Must be 3 digits.");
                return false;
            }
            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.cardExpiry)) {
                alert("Invalid Expiry! Use MM/YY.");
                return false;
            }
        }

        return true;
    };

    // --- 4. PLACE ORDER ---
    const handlePlaceOrder = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        // A. Save Address Logic
        if (saveAddressChecked) {
            const newAddress = {
                fullName: formData.fullName,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                zip: formData.zip
            };
            const isDuplicate = savedAddresses.some(addr =>
                addr.address === newAddress.address && addr.zip === newAddress.zip
            );

            if (!isDuplicate) {
                const updatedAddresses = [...savedAddresses, newAddress];
                localStorage.setItem("userAddresses", JSON.stringify(updatedAddresses));
            }
        }

        // B. Create Order Object
        const newOrder = {
            id: "ORD-" + Math.floor(Math.random() * 100000),
            date: new Date().toLocaleDateString(),
            items: cartItems,
            total: total + 5,
            status: "Processing",
            address: `${formData.address}, ${formData.city} ${formData.zip}`,
            paymentMethod: formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card'
        };

        // C. Save to History
        const currentHistory = JSON.parse(localStorage.getItem("orderHistory") || "[]");
        currentHistory.push(newOrder);
        localStorage.setItem("orderHistory", JSON.stringify(currentHistory));

        // D. Clear Cart & Redirect
        localStorage.removeItem("shoppingCart");
        window.dispatchEvent(new Event("cartUpdated"));
        navigate('/order-success');
    };

    return (
        <div className="page-container py-10">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                {/* LEFT COLUMN: Forms */}
                <div className="space-y-6">

                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                        <h2 className="flex items-center text-xl font-bold mb-4 text-gray-700">
                            <MapPin className="mr-2 text-cyan-600" /> Shipping Details
                        </h2>

                        {/* --- SAVED ADDRESS DROPDOWN --- */}
                        {savedAddresses.length > 0 && (
                            <div className="mb-6 bg-cyan-50 p-4 rounded border border-cyan-200">
                                <label className="block text-sm font-bold text-cyan-800 mb-2">Fast Checkout</label>
                                <select onChange={handleAddressSelect} className="w-full p-2 border rounded text-gray-700 focus:outline-cyan-500">
                                    <option value="">-- Select a Saved Address --</option>
                                    {savedAddresses.map((addr, index) => (
                                        <option key={index} value={index}>
                                            {addr.fullName} - {addr.city} ({addr.zip})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input required name="fullName" value={formData.fullName} onChange={handleChange} type="text" className="w-full p-2 border border-gray-300 rounded focus:border-cyan-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full p-2 border border-gray-300 rounded focus:border-cyan-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea required name="address" value={formData.address} onChange={handleChange} rows="2" className="w-full p-2 border border-gray-300 rounded focus:border-cyan-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input required name="city" value={formData.city} onChange={handleChange} type="text" className="w-full p-2 border border-gray-300 rounded focus:border-cyan-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                                    <input required name="zip" value={formData.zip} onChange={handleChange} type="text" className="w-full p-2 border border-gray-300 rounded focus:border-cyan-500" />
                                </div>
                            </div>

                            {/* --- SAVE ADDRESS CHECKBOX --- */}
                            <div className="flex items-center space-x-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="saveAddress"
                                    checked={saveAddressChecked}
                                    onChange={(e) => setSaveAddressChecked(e.target.checked)}
                                    className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
                                />
                                <label htmlFor="saveAddress" className="text-sm text-gray-600 font-medium flex items-center cursor-pointer">
                                    <Save size={16} className="mr-1"/> Save this address for future purchases
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Section */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                        <h2 className="flex items-center text-xl font-bold mb-4 text-gray-700">
                            <CreditCard className="mr-2 text-cyan-600" /> Payment Method
                        </h2>

                        <div className="space-y-4">

                            {/* Option 1: Card */}
                            <div className={`border rounded-lg p-4 cursor-pointer transition ${formData.paymentMethod === 'card' ? 'border-cyan-500 bg-cyan-50' : 'hover:bg-gray-50'}`}>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleChange} className="text-cyan-600 focus:ring-cyan-500"/>
                                    <span className="font-bold text-gray-700 flex items-center">Credit / Debit Card</span>
                                </label>

                                {formData.paymentMethod === 'card' && (
                                    <div className="mt-4 pt-4 border-t border-cyan-200 grid grid-cols-1 gap-3">
                                        <input name="cardNumber" onChange={handleChange} type="text" placeholder="Card Number (16 digits)" className="w-full p-2 border rounded bg-white" maxLength="19" />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input name="cardExpiry" onChange={handleChange} type="text" placeholder="MM/YY" className="w-full p-2 border rounded bg-white" maxLength="5"/>
                                            <input name="cardCvc" onChange={handleChange} type="text" placeholder="CVV" className="w-full p-2 border rounded bg-white" maxLength="3"/>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Option 2: COD */}
                            <div className={`border rounded-lg p-4 cursor-pointer transition ${formData.paymentMethod === 'cod' ? 'border-cyan-500 bg-cyan-50' : 'hover:bg-gray-50'}`}>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} className="text-cyan-600 focus:ring-cyan-500"/>
                                    <span className="font-bold text-gray-700 flex items-center"><Banknote size={18} className="mr-2"/> Cash on Delivery (COD)</span>
                                </label>
                            </div>

                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Summary */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md sticky top-24 border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h2>

                        {/* Items List */}
                        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                            {cartItems.map((item, index) => (
                                <div key={index} className="flex justify-between items-start text-sm pb-2 border-b border-gray-100">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{item.title}</p>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <span className="text-gray-700 font-semibold ml-2">RM {(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2 border-b pb-4 mb-4">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>RM {total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping Fee</span>
                                <span>RM 5.00</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-2xl font-bold text-gray-900 mb-6">
                            <span>Total</span>
                            <span>RM {(total + 5).toFixed(2)}</span>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            className="w-full bg-cyan-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-cyan-700 transition flex items-center justify-center shadow-lg transform active:scale-95"
                        >
                            <Truck className="mr-2" /> Place Order
                        </button>
                        <p className="text-xs text-gray-400 text-center mt-4">
                            Secure SSL Encrypted Transaction
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;