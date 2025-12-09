// secondbook-frontend/src/pages/User/UserDashboardPage.jsx
import React, { useState } from 'react';
import DashboardSidebar from '../../components/Dashboard/DashboardSidebar';
import { User, BookOpen, Settings } from 'lucide-react';

const UserDashboardPage = () => {
    const [activeTab, setActiveTab] = useState('profile');

    // Define sidebar links and their corresponding content components
    const dashboardItems = [
        { key: 'profile', icon: User, label: 'My Profile' },
        { key: 'orders', icon: BookOpen, label: 'My Orders (Placeholder)' },
        { key: 'settings', icon: Settings, label: 'Account Settings' },
    ];

    // Placeholder content for the active section
    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="p-6 bg-white rounded-xl shadow-lg">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome, Customer Name!</h2>
                        <p className="text-gray-600">This is your personal dashboard. View and manage your profile details.</p>
                        <div className="mt-6 space-y-4">
                            <p>Email: <span className="font-medium">customer@example.com</span></p>
                            <p>Member Since: <span className="font-medium">January 2024</span></p>
                        </div>
                    </div>
                );
            case 'orders':
                return (
                    <div className="p-6 bg-white rounded-xl shadow-lg">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Order History</h2>
                        <p className="text-gray-500">Your past orders will appear here once implemented.</p>
                    </div>
                );
            case 'settings':
                return (
                    <div className="p-6 bg-white rounded-xl shadow-lg">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Account Settings</h2>
                        <p className="text-gray-500">Manage your password and notification preferences.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="page-container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Left: Dashboard Sidebar */}
                <div className="md:col-span-1">
                    <DashboardSidebar items={dashboardItems} active={activeTab} setActive={setActiveTab} />
                </div>

                {/* Right: Content Area */}
                <div className="md:col-span-3">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default UserDashboardPage;