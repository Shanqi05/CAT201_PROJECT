// secondbook-frontend/src/pages/User/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../../components/Common/BookCard';
import { Star } from 'lucide-react';
import mockBooks from '../../api/mockBooks.json';

// Import the image correctly
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

            {/* 1. Welcome Message (New attractive design - Blue/Cyan Themed) */}
            <section className="bg-gradient-to-br from-cyan-50 to-indigo-100 p-10 md:p-16 rounded-3xl shadow-xl border-t-8 border-cyan-400">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                    Welcome to <span className="text-cyan-600">SecondBook</span>, Your Preloved Bookstore
                </h1>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    We specialize in giving **preloved books** a vibrant second life. Explore our collection of almost
                    <span className="font-extrabold text-indigo-700"> 40,000 used books</span>, from rare classics to recent bestsellers.
                    By choosing preloved, you support literacy and sustainability. Happy reading!
                </p>
                <Link
                    to="/books"
                    className="inline-flex items-center bg-cyan-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-cyan-700 transition duration-300 shadow-lg transform hover:scale-[1.02]"
                >
                    Start Browsing Now
                </Link>
            </section>

            {/* 2. Top Banner/Promo Section (PNG Image) */}
            <section className="shadow-2xl rounded-xl overflow-hidden">
                <Link to="/books">
                    <img
                        src={PROMO_BANNER_PATH}
                        alt="Promotional Banner"
                        className="w-full h-auto object-cover"
                    />
                </Link>
            </section>

            {/* 3. NEW ARRIVALS Section (Using mockBooks) */}
            <section>
                <div className="flex justify-between items-end mb-8 border-b-2 border-gray-200 pb-1">
                    <h2 className="text-3xl font-extrabold text-gray-800">NEW ARRIVALS</h2>
                    <Link to="/books" className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 transition">
                        SHOW ALL →
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {newArrivals.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            </section>

            {/* 4. CUSTOMER REVIEWS Section */}
            <section className="bg-gray-50 p-12 rounded-xl shadow-inner">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">WHAT OUR CUSTOMERS HAVE TO SAY</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {mockReviews.map((review, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500 hover:shadow-xl transition duration-300">
                            <div className="flex items-center mb-3">
                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-800 font-bold mr-3">
                                    {review.initials}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{review.name}</p>
                                    {renderStars(review.rating)}
                                </div>
                            </div>
                            <p className="text-gray-700 italic mb-3 line-clamp-4">"{review.review}"</p>
                            <p className="text-xs text-gray-500 font-medium">{review.date}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;