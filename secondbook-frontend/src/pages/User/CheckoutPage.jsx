import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCartTotal } from '../../utils/cartUtils';
import { CreditCard, Truck, MapPin, Banknote, Save, Smartphone, ExternalLink } from 'lucide-react';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const [total, setTotal] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [saveAddressChecked, setSaveAddressChecked] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        houseNo: '',    
        street: '',    
        city: '',
        zip: '',        
        state: '',      
        paymentMethod: 'card', 
        cardNumber: '',
        cardExpiry: '',
        cardCvc: ''
    });

    const states = ['Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Perak', 'Perlis', 'Pulau Pinang', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu', 'Kuala Lumpur', 'Labuan', 'Putrajaya'];

    useEffect(() => {
        setTotal(getCartTotal());
        const items = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
        setCartItems(items);
        const storedAddresses = JSON.parse(localStorage.getItem("userAddresses") || "[]");
        setSavedAddresses(storedAddresses);

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
        const { name, value } = e.target;
        // Auto-hyphen logic for phone while typing (optional but helpful)
        if (name === 'phone') {
            const clean = value.replace(/\D/g, '');
            let masked = clean;
            if (clean.length > 3) masked = `${clean.slice(0, 3)}-${clean.slice(3, 11)}`;
            setFormData({ ...formData, [name]: masked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleAddressSelect = (e) => {
        const index = e.target.value;
        if (index !== "") {
            const selected = savedAddresses[index];
            setFormData(prev => ({
                ...prev,
                fullName: selected.fullName,
                phone: selected.phone,
                houseNo: selected.houseNo,
                address: selected.address,
                city: selected.city,
                zip: selected.zip,
                state: selected.state
            }));
        }
    };

    const validateForm = () => {
        // Basic Shipping Validation
        if(!formData.houseNo || !formData.address || !formData.fullName || !formData.city || !formData.zip || !formData.state) {
            alert("Please fill in all shipping details.");
            return false;
        }

        // Phone format validation (XXX-XXXXXXX)
        const phoneRegex = /^\d{3}-\d{7,8}$/;
        if (!phoneRegex.test(formData.phone)) {
            alert("Invalid Phone Number format! Please use XXX-XXXXXXX (e.g., 012-3456789).");
            return false;
        }

        // Postcode
        if (!/^\d{5}$/.test(formData.zip)) {
            alert("Invalid Postcode! It must be exactly 5 digits.");
            return false;
        }

        // Conditional Payment Validation
        if (formData.paymentMethod === 'card') {
            const cleanCard = formData.cardNumber.replace(/\s/g, '');
            if (cleanCard.length < 16 || !/^\d{16}$/.test(cleanCard)) {
                alert("Please enter a valid 16-digit Card Number.");
                return false;
            }
            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.cardExpiry)) {
                alert("Invalid Expiry! Use MM/YY.");
                return false;
            }
            if (formData.cardCvc.length < 3) {
                alert("Invalid CVV! Must be 3 digits.");
                return false;
            }
        }
        return true;
    };

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Save Address logic
        if (saveAddressChecked) {
            const updatedAddresses = [...savedAddresses, { ...formData }];
            localStorage.setItem("userAddresses", JSON.stringify(updatedAddresses));
        }

        const newOrder = {
            id: "ORD-" + Math.floor(Math.random() * 100000),
            date: new Date().toLocaleDateString(),
            items: cartItems,
            total: total + 5,
            status: "Processing",
            address: `${formData.houseNo}, ${formData.address}, ${formData.zip} ${formData.city}, ${formData.state}`,
            paymentMethod: formData.paymentMethod.toUpperCase()
        };

        const currentHistory = JSON.parse(localStorage.getItem("orderHistory") || "[]");
        currentHistory.push(newOrder);
        localStorage.setItem("orderHistory", JSON.stringify(currentHistory));
        localStorage.removeItem("shoppingCart");
        window.dispatchEvent(new Event("cartUpdated"));
        navigate('/order-success');
    };

    return (
        <div className="page-container py-10">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    {/* Shipping Details */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                        <h2 className="flex items-center text-xl font-bold mb-4 text-gray-700">
                            <MapPin className="mr-2 text-cyan-600" /> Shipping Details
                        </h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input required name="fullName" value={formData.fullName} onChange={handleChange} type="text" className="w-full p-2 border border-gray-300 rounded focus:border-cyan-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (XXX-XXXXXXX)</label>
                                    <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full p-2 border border-gray-300 rounded focus:border-cyan-500" placeholder="012-3456789" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">House No / Taman</label>
                                    <input required name="houseNo" value={formData.houseNo} onChange={handleChange} type="text" className="w-full p-2 border border-gray-300 rounded focus:border-cyan-500" placeholder="e.g. 1, Taman ABC" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <input required name="address" value={formData.address} onChange={handleChange} type="text" className="w-full p-2 border border-gray-300 rounded focus:border-cyan-500" placeholder="e.g. Jalan USM" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
                                    <input required name="zip" value={formData.zip} onChange={handleChange} type="text" maxLength="5" className="w-full p-2 border border-gray-300 rounded focus:border-cyan-500" placeholder="11900" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input required name="city" value={formData.city} onChange={handleChange} type="text" className="w-full p-2 border border-gray-300 rounded focus:border-cyan-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                    <select 
                                        required 
                                        name="state" 
                                        value={formData.state} 
                                        onChange={handleChange} 
                                        className={`w-full p-2 border border-gray-300 rounded focus:border-cyan-500 ${!formData.state ? 'text-gray-400' : 'text-gray-700'}`}
                                    >
                                        <option value="" className="text-gray-400">Select State</option>
                                        {states.map(s => <option key={s} value={s} className="text-gray-700">{s}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                        <h2 className="flex items-center text-xl font-bold mb-4 text-gray-700">
                            <CreditCard className="mr-2 text-cyan-600" /> Payment Method
                        </h2>
                        <div className="space-y-4">
                            {/* Card Option */}
                            <div className={`border rounded-lg p-4 cursor-pointer transition ${formData.paymentMethod === 'card' ? 'border-cyan-500 bg-cyan-50' : 'hover:bg-gray-50'}`}>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleChange} className="text-cyan-600 focus:ring-cyan-500"/>
                                    <span className="font-bold text-gray-700 flex items-center">Credit / Debit Card</span>
                                </label>
                                {formData.paymentMethod === 'card' && (
                                    <div className="mt-4 pt-4 border-t border-cyan-200 grid grid-cols-1 gap-3 animate-in fade-in duration-300">
                                        <input name="cardNumber" value={formData.cardNumber} onChange={handleChange} type="text" placeholder="Card Number (16 digits)" className="w-full p-2 border rounded bg-white text-gray-700" maxLength="16" />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input name="cardExpiry" value={formData.cardExpiry} onChange={handleChange} type="text" placeholder="MM/YY" className="w-full p-2 border rounded bg-white text-gray-700" maxLength="5"/>
                                            <input name="cardCvc" value={formData.cardCvc} onChange={handleChange} type="text" placeholder="CVV" className="w-full p-2 border rounded bg-white text-gray-700" maxLength="3"/>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* TnG Option */}
                            <div className={`border rounded-lg p-4 cursor-pointer transition ${formData.paymentMethod === 'tng' ? 'border-cyan-500 bg-cyan-50' : 'hover:bg-gray-50'}`}>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="radio" name="paymentMethod" value="tng" checked={formData.paymentMethod === 'tng'} onChange={handleChange} className="text-cyan-600 focus:ring-cyan-500"/>
                                    <span className="font-bold text-gray-700 flex items-center"><Smartphone size={18} className="mr-2 text-blue-500"/> Touch 'n Go eWallet</span>
                                </label>
                                {formData.paymentMethod === 'tng' && (
                                    <div className="mt-4 pt-4 border-t border-cyan-200 animate-in fade-in duration-300">
                                        <div className="flex items-start bg-white p-3 rounded border border-blue-100 text-blue-700 text-sm">
                                            <ExternalLink size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                                            <p>You will be redirected to the <strong>Touch 'n Go</strong> app to complete your secure payment after clicking "Place Order".</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* COD Option */}
                            <div className={`border rounded-lg p-4 cursor-pointer transition ${formData.paymentMethod === 'cod' ? 'border-cyan-500 bg-cyan-50' : 'hover:bg-gray-50'}`}>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} className="text-cyan-600 focus:ring-cyan-500"/>
                                    <span className="font-bold text-gray-700 flex items-center"><Banknote size={18} className="mr-2 text-green-600"/> Cash on Delivery (COD)</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Column */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md sticky top-24 border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h2>
                        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                            {cartItems.map((item, index) => (
                                <div key={index} className="flex justify-between items-start text-sm pb-2 border-b border-gray-100">
                                    <div className="flex-1"><p className="font-medium text-gray-800">{item.title}</p><p className="text-xs text-gray-500">Qty: {item.quantity}</p></div>
                                    <span className="text-gray-700 font-semibold ml-2">RM {(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2 border-b pb-4 mb-4">
                            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>RM {total.toFixed(2)}</span></div>
                            <div className="flex justify-between text-gray-600"><span>Shipping Fee</span><span>RM 5.00</span></div>
                        </div>
                        <div className="flex justify-between text-2xl font-bold text-gray-900 mb-6"><span>Total</span><span>RM {(total + 5).toFixed(2)}</span></div>
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