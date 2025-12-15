import React from 'react';
import { Navigate } from 'react-router-dom';

// This component takes "children" (the page you want to see)
const ProtectedRoute = ({ children }) => {
    // 1. CHECK: Is there a user saved in the browser?
    // (Later, we will save the user token here after they click 'Login')
    const isAuthenticated = localStorage.getItem("userToken");

    // 2. LOGIC: If no user, kick them to the Login page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 3. SUCCESS: If user exists, show the page they wanted
    return children;
};

export default ProtectedRoute;