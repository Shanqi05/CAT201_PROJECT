// secondbook-frontend/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';

// Pages
import HomePage from './pages/User/HomePage';
import ProductListingPage from './pages/User/ProductListingPage';
import ProductDetailPage from './pages/User/ProductDetailPage';
import DonationPage from './pages/User/DonationPage';
import UserDashboardPage from './pages/User/UserDashboardPage';
import SearchResultsPage from './pages/User/SearchResultsPage';

function App() {
    return (
        <>
            <Header />
            <main className="min-h-[80vh] py-8">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/books" element={<ProductListingPage />} />
                    {/* Example Route with a parameter */}
                    <Route path="/books/:id" element={<ProductDetailPage />} />
                    <Route path="/search" element={<SearchResultsPage />} />
                    <Route path="/donate" element={<DonationPage />} />
                    <Route path="/dashboard" element={<UserDashboardPage />} />
                    {/* Add a 404 page route here later */}
                </Routes>
            </main>
            <Footer />
        </>
    );
}

export default App;