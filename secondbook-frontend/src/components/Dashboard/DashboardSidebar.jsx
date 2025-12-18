// secondbook-frontend/src/components/Dashboard/DashboardSidebar.jsx
import React from 'react';
import { LogOut } from 'lucide-react';

const DashboardSidebar = ({ items, active, setActive }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg sticky top-24 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">My Account</h3>

            {items.map((item) => {
                const isActive = item.key === active;
                return (
                    <button
                        key={item.key}
                        onClick={() => setActive(item.key)}
                        className={`w-full flex items-center p-3 rounded-lg transition text-left
                        ${isActive
                            ? 'bg-indigo-100 text-indigo-700 font-semibold'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.label}
                    </button>
                );
            })}
        </div>
    );
};

export default DashboardSidebar;