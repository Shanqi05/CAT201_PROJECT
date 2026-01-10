import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// 2. LAYOUT COMPONENTS
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import Toast from './components/Common/Toast';

// 3. AUTH PAGES
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

// 4. USER PAGES
import HomePage from './pages/User/HomePage';
import ProductListingPage from './pages/User/ProductListingPage';
import ProductDetailPage from './pages/User/ProductDetailPage';
import AccessoriesPage from './pages/User/AccessoriesPage';
import AboutUsPage from './pages/User/AboutUsPage';
import CartPage from './pages/User/CartPage';
import CheckoutPage from './pages/User/CheckoutPage';
import OrderSuccessPage from './pages/User/OrderSuccessPage';
import UserDashboardPage from './pages/User/UserDashboardPage';
import DonationPage from './pages/User/DonationPage';

// 5. ADMIN PAGES
import AdminLayout from './pages/Admin/AdminLayout';
import AdminHomePage from './pages/Admin/AdminHomePage'; // Main Admin Dashboard
import ManageBooks from './pages/Admin/ManageBooks';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageAccessories from './pages/Admin/ManageAccessories';
import ViewOrders from './pages/Admin/ViewOrders';
import Analytics from './pages/Admin/Analytics';
import ManageDonations from './pages/Admin/ManageDonations';

// 6. SECURITY GUARDS
import ProtectedRoute from './components/Common/ProtectedRoute';
import AdminProtectedRoute from './components/Common/AdminProtectedRoute';

function App() {
    const location = useLocation();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("✓ Added to cart successfully!");

    // Hide Header/Footer on Login, Register, and all Admin pages
    const hideHeaderFooter = ['/login', '/register'].includes(location.pathname) || location.pathname.startsWith('/admin');

    const isAdminRoute = location.pathname.startsWith('/admin');

    // Listen for cart added events
    useEffect(() => {
        const handleCartAdded = (event) => {
            setToastMessage("✓ Added to cart successfully!");
            setShowToast(true);
        };

        const handleCartAlreadyExists = (event) => {
            setToastMessage("Cannot added, already in your cart");
            setShowToast(true);
        };

        window.addEventListener('cartAdded', handleCartAdded);
        window.addEventListener('cartAlreadyExists', handleCartAlreadyExists);
        return () => {
            window.removeEventListener('cartAdded', handleCartAdded);
            window.removeEventListener('cartAlreadyExists', handleCartAlreadyExists);
        };
    }, []);

    // Scroll to top on location change
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [location.pathname]);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Global Toast Notification */}
            {showToast && <Toast message={toastMessage} type={toastMessage.includes("Cannot") ? "warning" : "success"} duration={3000} onClose={() => setShowToast(false)} />}

            {/* Header (Visible only on User pages) */}
            {!hideHeaderFooter && <Header />}

            <main className={`flex-grow ${isAdminRoute ? '' : 'bg-gray-50 pt-0 pb-8'}`}>
                <Routes>
                    {/* ROOT REDIRECT -> Go to Homepage */}
                    <Route path="/" element={<Navigate to="/home" replace />} />

                    {/* PUBLIC ROUTES */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/books" element={<ProductListingPage />} />
                    <Route path="/books/:id" element={<ProductDetailPage />} />
                    <Route path="/accessories" element={<AccessoriesPage />} />
                    <Route path="/about" element={<AboutUsPage />} />
                    <Route path="/donation" element={<DonationPage />} />

                    {/* PROTECTED USER ROUTES (Login Required) */}
                    <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                    <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><UserDashboardPage /></ProtectedRoute>} />
                    <Route path="/order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />

                    {/* --- ADMIN ROUTES SECTION --- */}
                    <Route path="/admin" element={
                        <AdminProtectedRoute>
                            <AdminLayout />
                        </AdminProtectedRoute>
                    }>
                        {/* 1. Default Redirect */}
                        <Route index element={<Navigate to="home" replace />} />

                        {/* 2. Admin Children Routes (【FIX】: Removed /admin prefix) */}
                        <Route path="home" element={<AdminHomePage />} />
                        <Route path="manage-books" element={<ManageBooks />} />
                        <Route path="manage-users" element={<ManageUsers />} />
                        <Route path="view-orders" element={<ViewOrders />} />
                        <Route path="donations" element={<ManageDonations />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="accessories" element={<ManageAccessories />} />
                    </Route>

                    {/* 404 FALLBACK -> Redirect to Login */}
                    <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
            </main>

            {/* Footer (Visible only on User pages) */}
            {!hideHeaderFooter && <Footer />}
        </div>
    );
}

export default App;