// secondbook-frontend/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';

// Pages
import HomePage from './pages/User/HomePage';
import ProductListingPage from './pages/User/ProductListingPage';
import ProductDetailPage from './pages/User/ProductDetailPage';
import AccessoriesPage from './pages/User/AccessoriesPage';
import AboutUsPage from './pages/User/AboutUsPage'; // Imported
import UserDashboardPage from './pages/User/UserDashboardPage';
import SearchResultsPage from './pages/User/SearchResultsPage';

// You should also import NotFoundPage for good practice
// import NotFoundPage from './pages/NotFoundPage';

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

                    <Route path="/accessories" element={<AccessoriesPage />} />

                    {/* 👇 MISSING ROUTE ADDED HERE 👇 */}
                    <Route path="/about" element={<AboutUsPage />} />

                    <Route path="/dashboard" element={<UserDashboardPage />} />

                    {/* Add a 404 page route here later (e.g., <Route path="*" element={<NotFoundPage />} />) */}
                </Routes>
            </main>
            <Footer />
        </>
    );
}

export default App;