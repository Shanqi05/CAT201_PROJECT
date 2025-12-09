// secondbook-frontend/src/pages/User/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../../components/Common/BookCard';

const HomePage = () => {
    const featuredBooks = Array(4).fill(null); // Just for placeholder display

    return (
        <div className="page-container">
            {/* Hero Section */}
            <div className="bg-indigo-500 text-white rounded-2xl p-12 mb-12 shadow-2xl">
                <h1 className="text-5xl font-extrabold mb-4">Discover Your Next Read.</h1>
                <p className="text-xl mb-6 opacity-90">Preloved books, new adventures. Find amazing stories at great prices.</p>
                <Link
                    to="/books"
                    className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition shadow-lg"
                >
                    Browse Our Collection
                </Link>
            </div>

            {/* Featured Books Section */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Featured Books</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {featuredBooks.map((_, index) => (
                        <BookCard key={index} />
                    ))}
                </div>
            </section>

            {/* Donation Callout */}
            <section className="text-center bg-white rounded-xl p-10 shadow-lg border border-indigo-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Have Books to Share?</h2>
                <p className="text-lg text-gray-600 mb-6">Donate your preloved books and help support literacy programs.</p>
                <Link
                    to="/donate"
                    className="bg-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-600 transition"
                >
                    Learn About Donating
                </Link>
            </section>
        </div>
    );
};

export default HomePage;