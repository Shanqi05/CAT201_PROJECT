import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
    const location = useLocation();

    // 1. Get Token and Role from LocalStorage
    // Checks both 'userToken' and 'user' keys to ensure compatibility
    const token = localStorage.getItem("userToken") || localStorage.getItem("user");
    const role = localStorage.getItem("userRole");

    // [DEBUG]: Open browser console (F12) to check these values
    console.log("--- Admin Route Check ---");
    console.log("Current Path:", location.pathname);
    console.log("Token found:", !!token);
    console.log("Role found:", role);

    // 2. If not logged in (No Token found)
    if (!token) {
        console.warn("No token found, redirecting to login.");
        return <Navigate to="/login" state={{
            from: location.pathname
        }} replace />;
    }

    // 3. Check if Role is valid and equals 'admin' (Case-insensitive)
    // E.g. Database might store "ADMIN" or "Admin", this handles all cases
    if (!role || role.toLowerCase() !== 'admin') {
        console.warn(`Access Denied. User role is: ${role}`);
        // alert("Access Denied: Admin privileges required."); // Alert commented out for better UX
        return <Navigate to="/home" replace />; // Redirect to Customer Home instead of Login
    }

    // 4. All checks passed, render the admin page
    return children;
};

export default AdminProtectedRoute;