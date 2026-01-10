import React, { useState } from 'react';
import { Heart, BookOpen, Users, Gift, CheckCircle, Package, Sparkles, Upload, Image as ImageIcon } from 'lucide-react';

const DonationPage = () => {
    const [formData, setFormData] = useState({
        donorName: '',
        donorEmail: '',
        donorPhone: '',
        bookTitle: '',
        author: '',
        bookCondition: 'Like New',
        category: '',
        address: '',
        jalan: '',
        postcode: '',
        city: '',
        state: '',
        message: '',
        image: null
    });

    const [previewUrl, setPreviewUrl] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const bookConditions = ['Brand new', 'Like New', 'Acceptable', 'Old'];
    const categories = ['Fiction', 'Non-Fiction', 'Children & Young Adults', 'Others'];
    const states = ['Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Perak', 'Perlis', 'Pulau Pinang', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu', 'Kuala Lumpur', 'Labuan', 'Putrajaya'];

    const validateForm = () => {
        let newErrors = {};
        if (!formData.donorName.trim()) newErrors.donorName = "Full name is required";

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(formData.donorEmail)) newErrors.donorEmail = "Invalid email address";

        const phoneRegex = /^\d{3}-\d{7,8}$/;
        if (!phoneRegex.test(formData.donorPhone)) newErrors.donorPhone = "Format: XXX-XXXXXXX";

        if (!formData.address.trim()) newErrors.address = "Required";
        if (!formData.jalan.trim()) newErrors.jalan = "Required";
        if (!/^\d{5}$/.test(formData.postcode)) newErrors.postcode = "5 digits required";
        if (!formData.city.trim()) newErrors.city = "Required";
        if (!formData.state) newErrors.state = "Required";

        if (!formData.bookTitle.trim()) newErrors.bookTitle = "Required";
        if (!formData.category) newErrors.category = "Required";

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

    // [NEW] Handle File Selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);

        try {
            // [FIX] Use FormData for File Upload
            const data = new FormData();
            data.append('donorName', formData.donorName);
            data.append('donorEmail', formData.donorEmail);
            data.append('donorPhone', formData.donorPhone);
            data.append('bookTitle', formData.bookTitle);
            data.append('author', formData.author);
            data.append('bookCondition', formData.bookCondition);
            data.append('category', formData.category);
            data.append('message', formData.message);

            data.append('houseNo', formData.address);
            data.append('street', formData.jalan);
            data.append('postcode', formData.postcode);
            data.append('city', formData.city);
            data.append('state', formData.state);

            if (formData.image) {
                data.append('image', formData.image);
            }

            const response = await fetch('http://localhost:8080/CAT201_project/addDonatedBook', {
                method: 'POST',
                // No Content-Type header needed for FormData; browser sets it with boundary
                credentials: 'include',
                body: data
            });

            const result = await response.json();
            if (result.success) {
                setIsSubmitted(true);
                setTimeout(() => {
                    setIsSubmitted(false);
                    setFormData({
                        donorName: '', donorEmail: '', donorPhone: '',
                        bookTitle: '', author: '', bookCondition: 'Like New', category: '',
                        address: '', jalan: '', postcode: '', city: '', state: '', message: '',
                        image: null
                    });
                    setPreviewUrl(null);
                }, 3000);
            } else {
                alert('Failed to submit: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Server Error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = (name) => `w-full px-4 py-3 border-2 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all ${errors[name] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Hero Section (Same as before) */}
            <div className="relative h-[400px] w-full flex items-center justify-center overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=2000"
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Books donation"
                />
                <div className="absolute inset-0 bg-black/50 z-[1]" />
                <div className="relative z-10 text-center px-6">
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Donate Your Books
                    </h1>
                    <p className="text-white text-lg max-w-2xl mx-auto">Give your pre-loved books a new home.</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-12 -mt-20 relative z-20">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
                        <h2 className="text-2xl font-black">Donation Form</h2>
                        <p className="text-purple-100 text-sm">Please fill in the details below</p>
                    </div>

                    {isSubmitted ? (
                        <div className="p-12 text-center">
                            <div className="inline-block p-4 bg-green-100 rounded-full mb-4"><CheckCircle className="w-16 h-16 text-green-600" /></div>
                            <h3 className="text-3xl font-black text-gray-800 mb-2">Thank You!</h3>
                            <p className="text-lg text-gray-600">Your donation has been submitted.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-8 space-y-8">

                            {/* 1. Donor Info */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><Users className="w-5 h-5 mr-2 text-purple-600"/> Your Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                                        <input name="donorName" value={formData.donorName} onChange={handleChange} className={inputClass('donorName')} />
                                        {errors.donorName && <p className="text-red-500 text-xs mt-1">{errors.donorName}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                                        <input type="email" name="donorEmail" value={formData.donorEmail} onChange={handleChange} className={inputClass('donorEmail')} />
                                        {errors.donorEmail && <p className="text-red-500 text-xs mt-1">{errors.donorEmail}</p>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                                        <input name="donorPhone" value={formData.donorPhone} onChange={handleChange} className={inputClass('donorPhone')} placeholder="XXX-XXXXXXX" />
                                        {errors.donorPhone && <p className="text-red-500 text-xs mt-1">{errors.donorPhone}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* 2. Pickup Address */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><Package className="w-5 h-5 mr-2 text-purple-600"/> Pickup Address</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">House No / Taman</label>
                                        <input name="address" value={formData.address} onChange={handleChange} className={inputClass('address')} />
                                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Street (Jalan)</label>
                                        <input name="jalan" value={formData.jalan} onChange={handleChange} className={inputClass('jalan')} />
                                        {errors.jalan && <p className="text-red-500 text-xs mt-1">{errors.jalan}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Postcode</label>
                                        <input name="postcode" value={formData.postcode} onChange={handleChange} className={inputClass('postcode')} maxLength="5" />
                                        {errors.postcode && <p className="text-red-500 text-xs mt-1">{errors.postcode}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City</label>
                                        <input name="city" value={formData.city} onChange={handleChange} className={inputClass('city')} />
                                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">State</label>
                                        <select name="state" value={formData.state} onChange={handleChange} className={inputClass('state')}>
                                            <option value="">Select State</option>
                                            {states.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* 3. Book Details & Image */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><BookOpen className="w-5 h-5 mr-2 text-purple-600"/> Book Details</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Book Title</label>
                                            <input name="bookTitle" value={formData.bookTitle} onChange={handleChange} className={inputClass('bookTitle')} />
                                            {errors.bookTitle && <p className="text-red-500 text-xs mt-1">{errors.bookTitle}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Author</label>
                                            <input name="author" value={formData.author} onChange={handleChange} className={inputClass('author')} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Condition</label>
                                            <select name="bookCondition" value={formData.bookCondition} onChange={handleChange} className={inputClass('bookCondition')}>
                                                {bookConditions.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                                            <select name="category" value={formData.category} onChange={handleChange} className={inputClass('category')}>
                                                <option value="">Select category</option>
                                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                                        </div>
                                    </div>

                                    {/* [NEW] Image Upload */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Book Photo (Optional)</label>
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all hover:border-purple-400 relative overflow-hidden group">
                                            {previewUrl ? (
                                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-8 h-8 mb-3 text-gray-400 group-hover:text-purple-500 transition-colors" />
                                                    <p className="text-sm text-gray-500 font-medium">Click to upload photo</p>
                                                </div>
                                            )}
                                            <input type="file" name="image" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Message</label>
                                        <textarea name="message" value={formData.message} onChange={handleChange} rows="3" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 outline-none resize-none" placeholder="Any details..." />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black py-4 rounded-xl hover:shadow-2xl transition-all disabled:opacity-50 text-lg uppercase tracking-wider"
                            >
                                {isSubmitting ? 'Submitting...' : 'Donate Book'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DonationPage;