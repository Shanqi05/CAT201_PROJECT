import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, BookOpen, Users, Settings,
    LogOut, ShoppingBag, ClipboardList, Heart, ExternalLink, BarChart2
} from 'lucide-react';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // [UPDATE] Added username to state
    const [currentUser, setCurrentUser] = useState({ name: 'Loading...', username: '...', role: '' });

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                const response = await fetch('http://localhost:8080/CAT201_project/getUserProfile', {
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setCurrentUser({
                        name: data.name || 'Admin',
                        username: data.username || 'admin', // Capture username
                        role: data.role
                    });
                } else if (response.status === 401) {
                    navigate('/login');
                }
            } catch (error) {
                console.error("Failed to load admin profile", error);
            }
        };

        fetchAdminProfile();
    }, [navigate]);

    const handleLogout = async () => {
        if (window.confirm("Log out of Admin Dashboard?")) {
            try { await fetch('http://localhost:8080/CAT201_project/logout', { credentials: 'include' }); } catch (e) {}
            localStorage.clear();
            navigate('/home');
        }
    };

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, link: '/admin/home' },
        { name: 'Book', icon: <BookOpen size={20} />, link: '/admin/manage-books' },
        { name: 'Accessories', icon: <ShoppingBag size={20} />, link: '/admin/accessories' },
        { name: 'Orders', icon: <ClipboardList size={20} />, link: '/admin/manage-orders' },
        { name: 'Donations', icon: <Heart size={20} />, link: '/admin/donations' },
        { name: 'Users', icon: <Users size={20} />, link: '/admin/manage-users' },
        { name: 'Settings', icon: <Settings size={20} />, link: '/admin/settings' },
        { name: 'Client View', icon: <ExternalLink size={20} />, link: '/home' },
    ];

    return (
        <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">

            {/* --- SIDEBAR --- */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-black shadow-xl transition-all duration-300 flex flex-col z-30 flex-shrink-0 text-white relative`}>

                {/* Logo Area */}
                <div className="flex flex-col items-center justify-center border-b border-gray-800 py-8">
                    <div className="flex items-center gap-2 overflow-hidden cursor-pointer" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-8 h-8 text-cyan-400" strokeWidth={2.5} />
                        </div>
                        {sidebarOpen && (
                            <span className="font-black text-2xl tracking-tight leading-none bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                                BookShelter
                            </span>
                        )}
                    </div>
                </div>

                {/* Admin User Info */}
                <div className={`text-center border-b border-gray-800 transition-all duration-300 ${sidebarOpen ? 'p-6' : 'p-2'}`}>
                    <div className={`transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                        <h3 className="font-bold text-gray-100 truncate px-2">{currentUser.name}</h3>

                        {/* [UPDATE] Showing @username instead of ID */}
                        <p className="text-[10px] text-cyan-400 font-bold mt-1 bg-gray-900 inline-block px-2 py-0.5 rounded border border-gray-700">
                            @{currentUser.username}
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
                    <ul className="space-y-1">
                        {menuItems.map((item, index) => {
                            const isActive = location.pathname === item.link;
                            return (
                                <li key={index}>
                                    <Link
                                        to={item.link}
                                        className={`flex items-center px-6 py-3 text-sm font-bold transition-all duration-200 border-l-4 ${
                                            isActive
                                                ? 'bg-gray-900 text-cyan-400 border-cyan-400 shadow-[inset_10px_0_20px_-10px_rgba(34,211,238,0.1)]'
                                                : 'text-gray-400 border-transparent hover:bg-gray-900 hover:text-white'
                                        }`}
                                    >
                                        <span className={isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-white'}>
                                            {item.icon}
                                        </span>
                                        {sidebarOpen && <span className="ml-3">{item.name}</span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center w-full rounded-lg transition-all duration-200 text-red-400 hover:bg-red-500/10 hover:text-red-300 ${sidebarOpen ? 'px-4 py-3 justify-start' : 'p-3 justify-center'}`}
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span className="ml-3 font-bold text-sm">Log Out</span>}
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <main className="flex-1 overflow-y-auto bg-gray-100 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;