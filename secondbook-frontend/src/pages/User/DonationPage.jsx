// secondbook-frontend/src/pages/User/DonationPage.jsx
import React from 'react';
import { Truck, Package, Heart } from 'lucide-react';
import ProductImageUpload from '../../components/Products/ProductImageUpload';

const DonationPage = () => {
    return (
        <div className="page-container">
            {/* Hero Section */}
            <div className="text-center bg-indigo-50 p-12 rounded-2xl shadow-inner mb-12">
                <Heart className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Give Your Books a Second Chapter</h1>
                <p className="text-xl text-gray-600">Your donation helps us promote literacy and sustainability.</p>
            </div>

            {/* --- How It Works Section --- */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">How to Donate in 3 Simple Steps</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Step 1 */}
                    <div className="text-center p-6 bg-white rounded-xl shadow-lg border-t-4 border-indigo-400">
                        <Package className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">1. List Your Books</h3>
                        <p className="text-gray-600">Fill out the form below with the book titles and a photo so we can assess condition and value.</p>
                    </div>

                    {/* Step 2 */}
                    <div className="text-center p-6 bg-white rounded-xl shadow-lg border-t-4 border-indigo-400">
                        <Truck className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">2. Confirm Pickup</h3>
                        <p className="text-gray-600">Once approved, we'll arrange a convenient, free collection time from your location.</p>
                    </div>

                    {/* Step 3 */}
                    <div className="text-center p-6 bg-white rounded-xl shadow-lg border-t-4 border-indigo-400">
                        <Heart className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">3. Make an Impact</h3>
                        <p className="text-gray-600">Your books are processed and listed, funding our charity partnerships.</p>
                    </div>
                </div>
            </section>

            {/* --- Donation Form & File Upload --- */}
            <section className="mb-16 bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Tell Us About Your Donation</h2>

                <form className="space-y-6">

                    {/* Contact Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Full Name</label>
                            <input type="text" id="name" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"/>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input type="email" id="email" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"/>
                        </div>
                    </div>

                    {/* Book List */}
                    <div>
                        <label htmlFor="booklist" className="block text-sm font-medium text-gray-700 mb-1">List of Books (Titles/Authors)</label>
                        <textarea id="booklist" rows="4" placeholder="e.g., The Secret Garden (Burnett), 1984 (Orwell), etc." required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                        <p className="text-xs text-gray-500 mt-1">Please list as many as possible for quicker processing.</p>
                    </div>

                    {/* File Upload Logic */}
                    <ProductImageUpload label="Upload a photo of your book pile (Handles file upload form logic)" />

                    {/* Submission */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg text-lg hover:bg-indigo-700 transition shadow-md"
                    >
                        Submit Donation Request
                    </button>
                </form>
            </section>

            {/* --- FAQ Section --- */}
            <section>
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Donation Guidelines</h2>
                <div className="space-y-4 max-w-3xl mx-auto">
                    <details className="bg-white p-5 rounded-lg shadow-md border-l-4 border-green-500">
                        <summary className="font-semibold text-lg cursor-pointer">What condition should the books be in?</summary>
                        <p className="mt-3 text-gray-700">We accept gently **used books** that are clean, have no missing pages, and are free from major damage, water damage, or mold. We generally cannot accept textbooks older than 5 years.</p>
                    </details>
                    <details className="bg-white p-5 rounded-lg shadow-md border-l-4 border-green-500">
                        <summary className="font-semibold text-lg cursor-pointer">Is there a minimum or maximum donation size?</summary>
                        <p className="mt-3 text-gray-700">For pickup requests, we prefer a minimum of 15 books to make the process efficient. There is no maximum limit!</p>
                    </details>
                </div>
            </section>
        </div>
    );
};

export default DonationPage;