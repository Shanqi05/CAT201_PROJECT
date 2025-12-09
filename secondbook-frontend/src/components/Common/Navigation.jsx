// secondbook-frontend/src/components/Common/Navigation.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = ({ links }) => {
    // Placeholder links for the primary navigation structure
    const defaultLinks = links || [
        { to: '/', label: 'Home' },
        { to: '/books', label: 'Browse Books' },
        { to: '/donate', label: 'Donate' },
    ];

    return (
        <nav className="text-lg">
            <ul className="flex space-x-8">
                {defaultLinks.map((link) => (
                    <li key={link.to}>
                        <NavLink
                            to={link.to}
                            className={({ isActive }) =>
                                `transition duration-150 font-medium ${
                                    isActive
                                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                                        : 'text-gray-600 hover:text-indigo-600'
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navigation;