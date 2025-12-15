// secondbook-frontend/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import ProtectedRoute from './components/Common/ProtectedRoute';
import CartPage from './pages/User/CartPage';


// Pages
import HomePage from './pages/User/HomePage';
import ProductListingPage from './pages/User/ProductListingPage';
import ProductDetailPage from './pages/User/ProductDetailPage';
import DonationPage from './pages/User/DonationPage';
import UserDashboardPage from './pages/User/UserDashboardPage';
import SearchResultsPage from './pages/User/SearchResultsPage';
import Profile from './pages/User/Profile';
import LoginPage from './pages/User/LoginPage';
import RegisterPage from './pages/User/RegisterPage';
import CheckoutPage from './pages/User/CheckoutPage';
import OrderSuccessPage from './pages/User/OrderSuccessPage';

function App() {
    return (
        <>
            <Header />
            <main className="min-h-[80vh] py-8">
                <Routes>
                    {/* --- PUBLIC ROUTES (Anyone can see these) --- */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search" element={<SearchResultsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* --- PROTECTED ROUTES (Must Login to see these) --- */}

                    {/* Browsing Books now requires login */}
                    <Route
                        path="/books"
                        element={
                            <ProtectedRoute>
                                <ProductListingPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Viewing Book Details requires login */}
                    <Route
                        path="/books/:id"
                        element={
                            <ProtectedRoute>
                                <ProductDetailPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Donating usually requires login */}
                    <Route
                        path="/donate"
                        element={
                            <ProtectedRoute>
                                <DonationPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Dashboard requires login */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <UserDashboardPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Your Profile requires login */}
                    <Route
                        path="/my-profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    {/* Cart Page */}
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
        </>
    );
}

export default App;