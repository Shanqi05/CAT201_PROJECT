import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("userToken");
    const role = localStorage.getItem("userRole");

    // 1. If not logged in, send to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 2. If logged in but NOT an admin, send to homepage (or an "Unauthorized" page)
    if (role !== 'admin') {
        alert("Access Denied: Admin privileges required.");
        return <Navigate to="/" replace />;
    }

    // 3. If everything is correct, show the admin content
    return children;
};

export default AdminProtectedRoute;