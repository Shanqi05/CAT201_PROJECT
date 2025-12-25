import React from 'react';
// 1. CRITICAL: Import these from react-router-dom
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// 2. LAYOUT COMPONENTS
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';

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

// 5. ADMIN PAGES
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminHomePage from './pages/Admin/AdminHomePage';
import ManageBooks from './pages/Admin/ManageBooks';
import ManageUsers from './pages/Admin/ManageUsers';
import ViewOrders from './pages/Admin/ViewOrders';
import Analytics from './pages/Admin/Analytics';
import AdminLayout from './pages/Admin/AdminLayout';
import AdminLayout from './pages/Admin/AdminLayout';
// 6. SECURITY GUARDS
import ProtectedRoute from './components/Common/ProtectedRoute';
import AdminProtectedRoute from './components/Common/AdminProtectedRoute';

function App() {
    const location = useLocation();
    
    // Hide Header and Footer on login and register pages
    const hideHeaderFooter = ['/login', '/register'].includes(location.pathname) || location.pathname.startsWith('/admin');

    const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/admin-dashboard';

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header only shows after login */}
            {!hideHeaderFooter && <Header />}

            <main className={`flex-grow ${isAdminRoute ? '' : 'bg-gray-50 py-8'}`}>
                <Routes>
                    {/* ROOT REDIRECT */}
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* PUBLIC ROUTES */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/books" element={<ProductListingPage />} />
                    <Route path="/books/:id" element={<ProductDetailPage />} />
                    <Route path="/accessories" element={<AccessoriesPage />} />
                    <Route path="/about" element={<AboutUsPage />} />

                    {/* PROTECTED USER ROUTES */}
                    <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                    <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><UserDashboardPage /></ProtectedRoute>} />
                    <Route path="/order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />

                    {/* ADMIN ONLY ROUTES */}
                    <Route
                        path="/admin/home"
                        element={
                            <AdminProtectedRoute>
                                <AdminHomePage />
                            </AdminProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin-dashboard"
                        element={
                            <AdminProtectedRoute>
                                <AdminDashboard />
                            </AdminProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/manage-books"
                        element={
                            <AdminProtectedRoute>
                                <ManageBooks />
                            </AdminProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/manage-users"
                        element={
                            <AdminProtectedRoute>
                                <ManageUsers />
                            </AdminProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/view-orders"
                        element={
                            <AdminProtectedRoute>
                                <ViewOrders />
                            </AdminProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/analytics"
                        element={
                            <AdminProtectedRoute>
                                <Analytics />
                            </AdminProtectedRoute>
                        }
                    />

                    {/* 404 FALLBACK */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </main>

            {/* Footer only shows after login */}
            {!hideHeaderFooter && <Footer />}
        </div>
    );
}

export default App;