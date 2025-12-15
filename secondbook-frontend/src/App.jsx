import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';

// --- 1. YOUR FRIEND'S PAGES ---
import HomePage from './pages/User/HomePage';
import ProductListingPage from './pages/User/ProductListingPage';
import ProductDetailPage from './pages/User/ProductDetailPage';
import AccessoriesPage from './pages/User/AccessoriesPage';
import AboutUsPage from './pages/User/AboutUsPage';
import SearchResultsPage from './pages/User/SearchResultsPage';

// --- 2. YOUR NEW PAGES (Login, Cart, Checkout) ---
import LoginPage from './pages/User/LoginPage';
import RegisterPage from './pages/User/RegisterPage';
import UserDashboardPage from './pages/User/UserDashboardPage';
import CartPage from './pages/User/CartPage';
import CheckoutPage from './pages/User/CheckoutPage';
import OrderSuccessPage from './pages/User/OrderSuccessPage';

// --- 3. SECURITY WRAPPER ---
import ProtectedRoute from './components/Common/ProtectedRoute';

function App() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow bg-gray-50 min-h-[80vh] py-8">
                <Routes>
                    {/* === PUBLIC ROUTES (Everyone can see) === */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/books" element={<ProductListingPage />} />
                    <Route path="/books/:id" element={<ProductDetailPage />} />

                    {/* Friend's New Routes */}
                    <Route path="/search" element={<SearchResultsPage />} />
                    <Route path="/accessories" element={<AccessoriesPage />} />
                    <Route path="/about" element={<AboutUsPage />} />

                    {/* Authentication */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* === PROTECTED ROUTES (Must be logged in) === */}

                    {/* Dashboard */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <UserDashboardPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Cart & Checkout Flow */}
                    <Route
                        path="/cart"
                        element={
                            <ProtectedRoute>
                                <CartPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/checkout"
                        element={
                            <ProtectedRoute>
                                <CheckoutPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/order-success"
                        element={
                            <ProtectedRoute>
                                <OrderSuccessPage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </main>

            <Footer />
        </div>
    );
}

export default App;