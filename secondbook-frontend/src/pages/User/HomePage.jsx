// secondbook-frontend/src/pages/User/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../../components/Common/BookCard';

const HomePage = () => {
    const featuredBooks = Array(4).fill(null);

    return (
        <div className="page-container">
            {/* Hero Section - Colorful Gradient */}
            <div className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-3xl p-16 mb-16 shadow-2xl">
                <h1 className="text-6xl font-black mb-4 tracking-tight">Discover Your Next Read.</h1>
                <p className="text-2xl mb-8 font-light">Thousands of preloved books, waiting for a vibrant second life.</p>
                <Link
                    to="/books"
                    // CTA button color changed from pink to orange
                    className="bg-orange-500 text-white font-bold py-4 px-10 rounded-full text-xl hover:bg-orange-600 transition shadow-xl"
                >
                    Browse Collection →
                </Link>
            </div>

            {/* Featured Books Section */}
            <section className="mb-16">
                <h2 className="text-4xl font-extrabold text-gray-800 mb-8 border-b-4 border-orange-300 inline-block pb-1">Featured Adventures</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {featuredBooks.map((_, index) => (
                        <BookCard key={index} />
                    ))}
                </div>
            </section>

            {/* Donation Callout */}
            <section className="text-center bg-yellow-50 rounded-xl p-12 shadow-inner border border-yellow-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Have Books to Share? 💖</h2>
                <p className="text-lg text-gray-600 mb-6">Donate your preloved books and ignite new stories!</p>
                <Link
                    to="/donate"
                    className="bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-orange-600 transition shadow-lg"
                >
                    Learn About Donating
                </Link>
            </section>
        </div>
    );
};

export default HomePage;