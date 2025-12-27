import React, { useState } from 'react';
import { Heart, BookOpen, Users, Gift, CheckCircle, Package, Sparkles } from 'lucide-react';

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
        pickupAddress: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const bookConditions = ['Excellent', 'Very Good', 'Good', 'Fair'];
    const categories = ['Fiction', 'Non-Fiction', 'Science', 'Mathematics', 'Computer Science', 'History', 'Children', 'Other'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const params = new URLSearchParams(formData);
            const response = await fetch('http://localhost:8080/CAT201_project/addDonatedBook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                credentials: 'include',
                body: params
            });

            const data = await response.json();
            
            if (data.success) {
                setIsSubmitted(true);
                setTimeout(() => {
                    setIsSubmitted(false);
                    setFormData({
                        donorName: '',
                        donorEmail: '',
                        donorPhone: '',
                        bookTitle: '',
                        author: '',
                        bookCondition: 'Good',
                        category: '',
                        quantity: 1,
                        pickupAddress: '',
                        message: ''
                    });
                }, 3000);
            } else {
                alert('Failed to submit donation: ' + data.message);
            }
        } catch (error) {
            console.error('Error submitting donation:', error);
            alert('Error submitting donation. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const impactStats = [
        { icon: <BookOpen className="w-8 h-8" />, value: "5,000+", label: "Books Donated" },
        { icon: <Users className="w-8 h-8" />, value: "2,500+", label: "Students Helped" },
        { icon: <Package className="w-8 h-8" />, value: "150+", label: "Collections Received" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Hero Image Section - Similar to About Us */}
            <div className="relative h-[500px] w-full flex items-center justify-center overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=2000" 
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Books donation"
                />
                
                {/* Dark overlay for text visibility */}
                <div className="absolute inset-0 bg-black/50 z-[1]" />
                
                {/* Bottom gradient transition */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent z-[2]" />
                
                <div className="relative z-10 text-center px-6">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <Sparkles className="text-yellow-400 w-6 h-6 animate-pulse" />
                        <span className="text-white font-bold tracking-[0.4em] text-sm uppercase drop-shadow-md">
                            Share the Gift of Knowledge
                        </span>
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Donate <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 italic">Books.</span>
                    </h1>
                    
                    <p className="mt-8 text-white text-lg md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                        "Give your used books a second life. Help students and communities access quality reading materials."
                    </p>
                </div>
            </div>
            
            <div className="max-w-6xl mx-auto px-6 py-12">

                {/* Impact Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {impactStats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                            <div className="inline-block p-3 bg-purple-100 rounded-full mb-3 text-purple-600">
                                {stat.icon}
                            </div>
                            <h3 className="text-3xl font-black text-gray-800 mb-1">{stat.value}</h3>
                            <p className="text-gray-600 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Donation Form */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
                        <h2 className="text-3xl font-black mb-2">Donate Your Books</h2>
                        <p className="text-purple-100">Every book makes a difference</p>
                    </div>

                    {isSubmitted ? (
                        <div className="p-12 text-center">
                            <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                                <CheckCircle className="w-16 h-16 text-green-600" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-800 mb-2">Thank You!</h3>
                            <p className="text-lg text-gray-600">Your book donation has been submitted. We'll contact you soon!</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-8">
                            {/* Donor Information */}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Your Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="donorName"
                                            required
                                            value={formData.donorName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            name="donorEmail"
                                            required
                                            value={formData.donorEmail}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="donorPhone"
                                            required
                                            value={formData.donorPhone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                                            placeholder="012-345-6789"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Book Information */}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Book Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Book Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="bookTitle"
                                            required
                                            value={formData.bookTitle}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                                            placeholder="e.g., Introduction to Algorithms"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Author
                                        </label>
                                        <input
                                            type="text"
                                            name="author"
                                            value={formData.author}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                                            placeholder="e.g., Thomas H. Cormen"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Book Condition *
                                            </label>
                                            <select
                                                name="bookCondition"
                                                value={formData.bookCondition}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                                            >
                                                {bookConditions.map(condition => (
                                                    <option key={condition} value={condition}>{condition}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Category
                                            </label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                                            >
                                                <option value="">Select category</option>
                                                {categories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Quantity *
                                            </label>
                                            <input
                                                type="number"
                                                name="quantity"
                                                min="1"
                                                required
                                                value={formData.quantity}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Pickup Address *
                                        </label>
                                        <textarea
                                            name="pickupAddress"
                                            required
                                            value={formData.pickupAddress}
                                            onChange={handleChange}
                                            rows="3"
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
                                            placeholder="Where should we pick up the books?"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Additional Message (Optional)
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows="3"
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
                                            placeholder="Any special notes about the books..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black py-4 rounded-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg uppercase tracking-wider"
                            >
                                <BookOpen className="inline-block w-5 h-5 mr-2" />
                                {isSubmitting ? 'Submitting...' : 'Donate Books'}
                            </button>

                            <p className="text-center text-sm text-gray-500 mt-4">
                                We'll contact you within 2-3 business days to arrange pickup
                            </p>
                        </form>
                    )}
                </div>

                {/* Why Donate Section */}
                <div className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8">
                    <h2 className="text-3xl font-black text-gray-800 mb-6 text-center">
                        Why Donate Your Books?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="font-bold text-lg text-purple-600 mb-2">Help Students</h3>
                            <p className="text-gray-600">
                                Your donated books help students who cannot afford new textbooks access quality education.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="font-bold text-lg text-purple-600 mb-2">Sustainability</h3>
                            <p className="text-gray-600">
                                Donating books reduces waste and supports environmental conservation efforts.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="font-bold text-lg text-purple-600 mb-2">Build Community</h3>
                            <p className="text-gray-600">
                                Your donation helps build a community of readers and learners across Malaysia.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="font-bold text-lg text-purple-600 mb-2">Free Pickup</h3>
                            <p className="text-gray-600">
                                We'll arrange a convenient time to pick up your books at no cost to you!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonationPage;
