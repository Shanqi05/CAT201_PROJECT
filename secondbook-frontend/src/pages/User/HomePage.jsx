// secondbook-frontend/src/pages/User/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../../components/Common/BookCard';
import { Star } from 'lucide-react';
import mockBooks from '../../api/mockBooks.json';
import PROMO_BANNER_PATH from '../../assets/images/promo_banner.png';

// Placeholder data for Customer Reviews
const mockReviews = [
    {
        name: 'Seaw Kim Tan',
        initials: 'SK',
        date: 'September 27, 2025',
        rating: 5,
        review: 'Books were securely wrapped and arrived in excellent condition. Very satisfied with the packaging and care taken. Condition is good.',
    },
    {
        name: 'Lee Fui San',
        initials: 'LF',
        date: 'September 28, 2025',
        rating: 4,
        review: 'The book\'s parcel packaging was well pack. Received on time. Good!',
    },
    {
        name: 'Rose',
        initials: 'RO',
        date: 'October 8, 2025',
        rating: 5,
        review: 'Wonderful! I just received my copy of a Christmas album I thought was lost. The album seems to be in great condition. Accompanied by a lovely note from the business owner.',
    },
];


const HomePage = () => {
    const newArrivals = mockBooks.slice(0, 5);

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <Star
                    key={i}
                    className={`w-4 h-4 ${i < fullStars ? 'fill-green-500 text-green-500' : 'text-gray-300'}`}
                />
            );
        }
        return <div className="flex space-x-0.5">{stars}</div>;
    };

    return (
        <div className="page-container space-y-16">

            {/* 1. Welcome Message (Enhanced with gradient and animation) */}
            <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-12 md:p-20 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1.5s'}}></div>
                
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-lg" style={{fontFamily: 'Playfair Display, serif'}}>
                        Welcome to <span className="text-yellow-300">SecondBook</span>
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-bold text-white/90 mb-6">Your Preloved Bookstore</h2>
                    <p className="text-lg md:text-xl text-white/95 leading-relaxed mb-8 max-w-3xl">
                        🌟 Discover the magic of preloved books! Explore our curated collection of almost
                        <span className="font-extrabold text-yellow-300"> 40,000 used books</span>, from timeless classics to modern bestsellers.
                        Join us in promoting literacy and sustainability, one book at a time. ✨
                    </p>
                    <Link
                        to="/books"
                        className="inline-flex items-center bg-white text-purple-700 font-bold py-4 px-10 rounded-full text-lg hover:bg-yellow-300 hover:text-purple-900 transition-all duration-300 shadow-2xl transform hover:scale-105 hover:-translate-y-1"
                    >
                        🚀 Start Browsing Now
                    </Link>
                </div>
            </section>

            {/* 2. Top Banner/Promo Section (PNG Image) */}
            <section className="shadow-2xl rounded-3xl overflow-hidden border-4 border-white hover-glow transform transition-all duration-300 hover:scale-[1.02]">
                <Link to="/books">
                    <img
                        src={PROMO_BANNER_PATH}
                        alt="Promotional Banner"
                        className="w-full h-auto object-cover"
                    />
                </Link>
            </section>

            {/* 3. NEW ARRIVALS Section (Using mockBooks) */}
            <section className="bg-white/50 backdrop-blur-sm p-8 rounded-3xl shadow-xl">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600" style={{fontFamily: 'Playfair Display, serif'}}>NEW ARRIVALS</h2>
                        <div className="h-1 w-32 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mt-2"></div>
                    </div>
                    <Link to="/books" className="text-sm font-bold text-purple-600 hover:text-pink-600 transition-colors flex items-center gap-2 group">
                        SHOW ALL <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {newArrivals.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            </section>

            {/* 4. CUSTOMER REVIEWS Section */}
            <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 p-12 rounded-3xl shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-1/2 w-96 h-96 bg-gradient-to-br from-yellow-200/30 to-pink-200/30 rounded-full blur-3xl transform -translate-x-1/2"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl font-black text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600" style={{fontFamily: 'Playfair Display, serif'}}>✨ CUSTOMER REVIEWS ✨</h2>
                    <p className="text-center text-gray-600 mb-10 text-lg">See what our happy readers are saying!</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {mockReviews.map((review, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-gradient-to-b from-yellow-400 to-pink-500">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold mr-3 shadow-lg">
                                        {review.initials}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{review.name}</p>
                                        {renderStars(review.rating)}
                                    </div>
                                </div>
                                <p className="text-gray-700 italic mb-4 line-clamp-4 leading-relaxed">"{review.review}"</p>
                                <p className="text-xs text-gray-500 font-semibold">{review.date}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;