import React from 'react';
import { useNavigate } from 'react-router-dom'; // <--- Import this

const Profile = () => {
    const navigate = useNavigate(); // <--- Activate the hook

    const handleLogout = () => {
        // 1. Remove the "sticky note"
        localStorage.removeItem("userToken");

        // 2. Alert the user
        alert("Logged out successfully!");

        // 3. Send them back to Login
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>

                    {/* LOGOUT BUTTON */}
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition"
                    >
                        Logout
                    </button>
                </div>

                <p className="text-gray-600 mb-6">
                    Welcome back! You are currently logged in.
                </p>

                {/* Task Card */}
                <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">My Status</h3>
                    <p>If you click Logout above, you will be kicked out of this page.</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;