import React, { useState } from 'react';
import { Heart, BookOpen, Users, Gift, CheckCircle, Package, Sparkles, AlertCircle } from 'lucide-react';

const DonationPage = () => {
    const [formData, setFormData] = useState({
        donorName: '',
        donorEmail: '',
        donorPhone: '',
        bookTitle: '',
        author: '',
        bookCondition: 'Good',
        category: '',
        quantity: 1,
        address: '',    // House No / Taman
        jalan: '',      // Street Name
        postcode: '',
        city: '',
        state: '',
        message: ''
    });
    const [errors, setErrors] = useState({}); 
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const bookConditions = ['Brand new', 'Like New', 'Acceptable', 'Old'];
    const categories = ['Fiction', 'Non-Fiction', 'Children & Young Adults'];
    const states = ['Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Perak', 'Perlis', 'Pulau Pinang', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu', 'Kuala Lumpur', 'Labuan', 'Putrajaya'];

    const validateForm = () => {
        let newErrors = {};
        if (!formData.donorName.trim()) newErrors.donorName = "Full name is required";
        
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(formData.donorEmail)) newErrors.donorEmail = "Invalid email address (@ required)";
        
        const phoneRegex = /^\d{3}-\d{7,8}$/;
        if (!phoneRegex.test(formData.donorPhone)) newErrors.donorPhone = "Format must be XXX-XXXXXXX";

        if (!formData.address.trim()) newErrors.address = "House No / Taman is required";
        if (!formData.jalan.trim()) newErrors.jalan = "Street name (Jalan) is required";
        if (!/^\d{5}$/.test(formData.postcode)) newErrors.postcode = "Postcode must be 5 digits";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.state) newErrors.state = "Please select a state";

        if (!formData.bookTitle.trim()) newErrors.bookTitle = "Book title is required";
        if (!formData.category) newErrors.category = "Please select a category";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'donorPhone') {
            const clean = value.replace(/\D/g, '');
            let masked = clean;
            if (clean.length > 3) masked = `${clean.slice(0, 3)}-${clean.slice(3, 11)}`;
            setFormData(prev => ({ ...prev, [name]: masked }));
        } else if (name === 'postcode') {
            setFormData(prev => ({ ...prev, [name]: value.replace(/\D/g, '').slice(0, 5) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);

        try {
            const fullPickupAddress = `${formData.address}, ${formData.jalan}, ${formData.postcode} ${formData.city}, ${formData.state}`;
            const dataToSubmit = { ...formData, pickupAddress: fullPickupAddress };
            const params = new URLSearchParams(dataToSubmit);
            
            const response = await fetch('http://localhost:8080/CAT201_project/addDonatedBook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                credentials: 'include',
                body: params
            });

            const data = await response.json();
            if (data.success) {
                setIsSubmitted(true);
                setTimeout(() => {
                    setIsSubmitted(false);
                    setFormData({ donorName: '', donorEmail: '', donorPhone: '', bookTitle: '', author: '', bookCondition: 'Good', category: '', quantity: 1, address: '', jalan: '', postcode: '', city: '', state: '', message: '' });
                }, 3000);
            } else {
                alert('Failed to submit: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const impactStats = [
        { icon: <BookOpen className="w-8 h-8" />, value: "5,000+", label: "Books Donated" },
        { icon: <Users className="w-8 h-8" />, value: "2,500+", label: "Students Helped" },
        { icon: <Package className="w-8 h-8" />, value: "150+", label: "Collections Received" },
    ];

    // CSS helper for errors
    const inputClass = (name) => `w-full px-4 py-3 border-2 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all ${errors[name] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="relative h-[500px] w-full flex items-center justify-center overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=2000" 
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Books donation"
                />
                <div className="absolute inset-0 bg-black/50 z-[1]" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent z-[2]" />
                <div className="relative z-10 text-center px-6">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <Sparkles className="text-yellow-400 w-6 h-6 animate-pulse" />
                        <span className="text-white font-bold tracking-[0.4em] text-sm uppercase drop-shadow-md">Share the Gift of Knowledge</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none drop-shadow-md" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Donate <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 italic">Books.</span>
                    </h1>
                    <p className="mt-8 text-white text-lg md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                        "Give your used books a second life. Help students and communities access quality reading materials."
                    </p>
                </div>
            </div>
            
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {impactStats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                            <div className="inline-block p-3 bg-purple-100 rounded-full mb-3 text-purple-600">{stat.icon}</div>
                            <h3 className="text-3xl font-black text-gray-800 mb-1">{stat.value}</h3>
                            <p className="text-gray-600 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
                        <h2 className="text-3xl font-black mb-2">Donate Your Books</h2>
                        <p className="text-purple-100 italic">Every book makes a difference</p>
                    </div>

                    {isSubmitted ? (
                        <div className="p-12 text-center">
                            <div className="inline-block p-4 bg-green-100 rounded-full mb-4"><CheckCircle className="w-16 h-16 text-green-600" /></div>
                            <h3 className="text-3xl font-black text-gray-800 mb-2">Thank You!</h3>
                            <p className="text-lg text-gray-600">Your book donation has been submitted successfully.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Your Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                                        <input type="text" name="donorName" value={formData.donorName} onChange={handleChange} className={inputClass('donorName')} placeholder="John Doe" />
                                        {errors.donorName && <p className="text-red-500 text-xs mt-1 font-bold italic">{errors.donorName}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                                        <input type="email" name="donorEmail" value={formData.donorEmail} onChange={handleChange} className={inputClass('donorEmail')} placeholder="john@example.com" />
                                        {errors.donorEmail && <p className="text-red-500 text-xs mt-1 font-bold italic">{errors.donorEmail}</p>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number * (XXX-XXXXXXX)</label>
                                        <input type="tel" name="donorPhone" value={formData.donorPhone} onChange={handleChange} className={inputClass('donorPhone')} placeholder="012-3456789" />
                                        {errors.donorPhone && <p className="text-red-500 text-xs mt-1 font-bold italic">{errors.donorPhone}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Pickup Address</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">House No / Taman *</label>
                                        <input name="address" value={formData.address} onChange={handleChange} className={inputClass('address')} placeholder="e.g. 38, Taman Sepakat" />
                                        {errors.address && <p className="text-red-500 text-xs mt-1 font-bold italic">{errors.address}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Street Name (Jalan) *</label>
                                        <input name="jalan" value={formData.jalan} onChange={handleChange} className={inputClass('jalan')} placeholder="e.g. Jalan Batas Paip" />
                                        {errors.jalan && <p className="text-red-500 text-xs mt-1 font-bold italic">{errors.jalan}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Postcode *</label>
                                        <input name="postcode" value={formData.postcode} onChange={handleChange} className={inputClass('postcode')} placeholder="06600" maxLength="5" />
                                        {errors.postcode && <p className="text-red-500 text-xs mt-1 font-bold italic">{errors.postcode}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">City *</label>
                                        <input name="city" value={formData.city} onChange={handleChange} className={inputClass('city')} placeholder="Alor Setar" />
                                        {errors.city && <p className="text-red-500 text-xs mt-1 font-bold italic">{errors.city}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">State *</label>
                                        <select name="state" value={formData.state} onChange={handleChange} className={inputClass('state')}>
                                            <option value="">Select State</option>
                                            {states.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        {errors.state && <p className="text-red-500 text-xs mt-1 font-bold italic">{errors.state}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Book Details</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Book Title *</label>
                                            <input type="text" name="bookTitle" value={formData.bookTitle} onChange={handleChange} className={inputClass('bookTitle')} placeholder="e.g. Introduction to Algorithms" />
                                            {errors.bookTitle && <p className="text-red-500 text-xs mt-1 font-bold italic">{errors.bookTitle}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Author</label>
                                            <input type="text" name="author" value={formData.author} onChange={handleChange} className={inputClass('author')} placeholder="e.g. Thomas H. Cormen" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Book Condition *</label>
                                            <select name="bookCondition" value={formData.bookCondition} onChange={handleChange} className={inputClass('bookCondition')}>
                                                {bookConditions.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
                                            <select name="category" value={formData.category} onChange={handleChange} className={inputClass('category')}>
                                                <option value="">Select category</option>
                                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                            {errors.category && <p className="text-red-500 text-xs mt-1 font-bold italic">{errors.category}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Quantity *</label>
                                            <input type="number" name="quantity" min="1" value={formData.quantity} onChange={handleChange} className={inputClass('quantity')} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Additional Message (Optional)</label>
                                        <textarea name="message" value={formData.message} onChange={handleChange} rows="3" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 outline-none resize-none" placeholder="Any special notes about the books..." />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black py-4 rounded-xl hover:shadow-2xl transition-all disabled:opacity-50 text-lg uppercase tracking-wider"
                            >
                                <BookOpen className="inline-block w-5 h-5 mr-2" />
                                {isSubmitting ? 'Submitting...' : 'Donate Books'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DonationPage;