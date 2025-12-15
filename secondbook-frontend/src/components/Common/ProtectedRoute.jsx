import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("userToken");

    // If no token, kick them to Login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If token exists, let them see the page
    return children;
};

export default ProtectedRoute;