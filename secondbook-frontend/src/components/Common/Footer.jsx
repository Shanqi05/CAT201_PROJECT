// secondbook-frontend/src/components/Common/Footer.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TermsModal from './TermsModal';
import PrivacyModal from './PrivacyModal';
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';

const Footer = () => {
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [email, setEmail] = useState('');
    
    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        // Add newsletter subscription logic here
        alert(`Thank you for subscribing with: ${email}`);
        setEmail('');
    };
    
    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-auto">
            {/* Top Section */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Section 1 - Brand */}
                    <div className="space-y-4">
                        <div className="flex flex-col items-start">
                            <Link to="/" className="flex items-center space-x-2 text-2xl font-black tracking-tighter group">
                                <BookOpen className="w-8 h-8 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                                    BookShelter
                                </span>
                            </Link>
                            <p className="text-[10px] font-bold text-purple-400/80 tracking-[0.2em] ml-10 -mt-1 uppercase">
                                Your Preloved Bookstore
                            </p>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Giving preloved books a second life. Join our sustainable reading community and discover thousands of quality pre-loved books.
                        </p>
                        {/* Social Media */}
                        <div className="flex space-x-3 pt-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-blue-400 flex items-center justify-center transition-all duration-300 hover:scale-110">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-blue-700 flex items-center justify-center transition-all duration-300 hover:scale-110">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                    
                    {/* Section 2 - Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-yellow-400">Quick Links</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="/books" className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 inline-block">
                                    📚 All Books
                                </a>
                            </li>
                            <li>
                                <a href="/accessories" className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 inline-block">
                                    🎒 Accessories
                                </a>
                            </li>
                            <li>
                                <a href="/donation" className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 inline-block">
                                    ❤️ Donate Books
                                </a>
                            </li>
                            <li>
                                <a href="/about" className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 inline-block">
                                    ℹ️ About Us
                                </a>
                            </li>
                            <li>
                                <a href="/dashboard" className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 inline-block">
                                    👤 My Dashboard
                                </a>
                            </li>
                        </ul>
                    </div>
                    
                    {/* Section 3 - Contact Info */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-yellow-400">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-gray-400">
                                <Mail className="w-5 h-5 mt-0.5 text-yellow-400 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-white">Email</p>
                                    <a href="mailto:info@BookShelter.com" className="text-sm hover:text-yellow-400 transition-colors">
                                        info@bookshelter.com
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start space-x-3 text-gray-400">
                                <Phone className="w-5 h-5 mt-0.5 text-yellow-400 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-white">Phone</p>
                                    <a href="tel:012-8888888" className="text-sm hover:text-yellow-400 transition-colors">
                                        012-8888888
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start space-x-3 text-gray-400">
                                <MapPin className="w-5 h-5 mt-0.5 text-yellow-400 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-white">Location</p>
                                    <p className="text-sm">37, Jalan Desa, Taman Desa<br />11700 Gelugor, Pulau Pinang<br />Malaysia</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    
                    {/* Section 4 - Newsletter */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-yellow-400">Newsletter</h4>
                        <p className="text-gray-400 text-sm mb-4">
                            Subscribe to get special offers, free giveaways, and updates!
                        </p>
                        <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold py-3 px-6 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                            >
                                <span>Subscribe</span>
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            
            {/* Bottom Section */}
            <div className="border-t border-gray-700">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-gray-400 text-sm">
                            &copy; {new Date().getFullYear()} BookShelter. All rights reserved.
                        </div>
                        <div className="flex space-x-6 text-sm">
                            <button 
                                onClick={() => setShowPrivacyModal(true)}
                                className="text-gray-400 hover:text-yellow-400 transition-colors cursor-pointer"
                            >
                                Privacy Policy
                            </button>
                            <span className="text-gray-600">•</span>
                            <button 
                                onClick={() => setShowTermsModal(true)}
                                className="text-gray-400 hover:text-yellow-400 transition-colors cursor-pointer"
                            >
                                Terms & Conditions
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Modals */}
            {showTermsModal && <TermsModal onClose={() => setShowTermsModal(false)} />}
            {showPrivacyModal && <PrivacyModal onClose={() => setShowPrivacyModal(false)} />}
        </footer>
    );
};

export default Footer;