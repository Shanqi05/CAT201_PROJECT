import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, BookOpen, Users, Settings, Search,
    Bell, Mail, LogOut, ShoppingBag, Menu, Info, User,
    ChevronDown, BarChart2, ClipboardList, Heart
} from 'lucide-react';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // 状态：保存当前登录的用户信息
    const [currentUser, setCurrentUser] = useState({ name: 'Admin', id: 'N/A', role: '' });

    const navigate = useNavigate();
    const location = useLocation();

    // 1. 读取 LocalStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setCurrentUser({
                    name: parsed.username || 'Administrator',
                    id: parsed.id || 'N/A',
                    role: parsed.role || 'Admin'
                });
            } catch (error) {
                console.error("Failed to parse user data", error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, link: '/admin/home' },
        { name: 'Book', icon: <BookOpen size={20} />, link: '/admin/manage-books' },
        { name: 'Accessories', icon: <ShoppingBag size={20} />, link: '/admin/accessories' },
        { name: 'Orders', icon: <ClipboardList size={20} />, link: '/admin/view-orders' },
        { name: 'Donations', icon: <Heart size={20} />, link: '/admin/donations' },
        { name: 'Users', icon: <Users size={20} />, link: '/admin/manage-users' },
        { name: 'Analytics', icon: <BarChart2 size={20} />, link: '/admin/analytics' },
        { name: 'Settings', icon: <Settings size={20} />, link: '/admin/settings' },
        { name: 'About Us', icon: <Info size={20} />, link: '/admin/about-content' },
    ];

    return (
        <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">

            {/* --- SIDEBAR --- */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-black shadow-xl transition-all duration-300 flex flex-col z-30 flex-shrink-0 text-white`}>
                <div className="h-20 flex items-center justify-center border-b border-gray-800">
                    <Link to="/admin/home" className="flex items-center gap-2 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-8 h-8 text-cyan-400" strokeWidth={2.5} />
                        </div>
                        {sidebarOpen && (
                            <span className="font-black text-2xl tracking-tight leading-none bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent" style={{ fontFamily: 'Playfair Display, serif' }}>
                                SecondBook
                            </span>
                        )}
                    </Link>
                </div>

                {/* [UPDATE 1]: Sidebar User Info (显示 ID) */}
                <div className={`text-center border-b border-gray-800 transition-all duration-300 ${sidebarOpen ? 'p-6' : 'p-4'}`}>
                    <div className={`mx-auto rounded-full mb-3 overflow-hidden border-[3px] border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all duration-300 ${sidebarOpen ? 'w-16 h-16' : 'w-10 h-10'}`}>
                        <div className="w-full h-full bg-gray-800 text-white flex items-center justify-center font-bold text-xl">
                            {currentUser.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div className={`transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                        <h3 className="font-bold text-gray-100 truncate px-2">{currentUser.name}</h3>
                        {/* 这里显示 ID */}
                        <p className="text-[10px] text-gray-400 font-mono mt-1 bg-gray-900 inline-block px-2 py-0.5 rounded border border-gray-700">
                            ID: {currentUser.id}
                        </p>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1">
                        {menuItems.map((item, index) => {
                            const isActive = location.pathname === item.link;
                            return (
                                <li key={index}>
                                    <Link
                                        to={item.link}
                                        className={`flex items-center px-6 py-3 text-sm font-bold transition-all duration-200 ${
                                            isActive
                                            ? 'bg-gray-900 text-cyan-400 border-r-4 border-cyan-400 shadow-[inset_10px_0_20px_-10px_rgba(34,211,238,0.1)]'
                                            : 'text-gray-400 hover:bg-gray-900 hover:text-white'
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
            </aside>

            {/* --- RIGHT COLUMN --- */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* HEADER */}
                <header className="h-20 bg-black shadow-md flex items-center justify-between px-8 z-20 flex-shrink-0 border-b border-gray-800">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white transition-colors">
                            <Menu size={24} />
                        </button>
                        <div className="relative hidden md:block w-96">
                            <input type="text" placeholder="Search..." className="w-full bg-gray-900 border border-gray-700 text-gray-200 rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-gray-500" />
                            <Search className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 border-r border-gray-700 pr-6">
                            <div className="relative cursor-pointer group">
                                <Mail className="text-gray-400 w-5 h-5 group-hover:text-white transition-colors" />
                                <span className="absolute -top-1.5 -right-1.5 bg-cyan-500 text-white text-[10px] font-bold px-1 rounded-full">5</span>
                            </div>
                            <div className="relative cursor-pointer group">
                                <Bell className="text-gray-400 w-5 h-5 group-hover:text-white transition-colors" />
                                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
                            </div>
                        </div>

                        {/* [UPDATE 2]: Header User Info (显示 ID) */}
                        <div className="relative">
                            <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-3 hover:bg-gray-900 p-2 rounded-lg transition-colors focus:outline-none">
                                <div className="w-9 h-9 bg-gray-800 text-cyan-400 rounded-full flex items-center justify-center shadow-md border border-gray-700">
                                    <span className="font-bold text-sm">
                                        {currentUser.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-xs font-bold text-gray-200 leading-none">{currentUser.name}</p>

                                    {/* 这里改成了显示 ID */}
                                    <p className="text-[10px] text-gray-500 font-mono">
                                        ID: {currentUser.id}
                                    </p>
                                </div>
                                <ChevronDown size={14} className={`text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                    <div className="px-4 py-2 border-b border-gray-800 mb-2">
                                        <p className="text-xs text-gray-500">Signed in as</p>
                                        <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                                    </div>
                                    <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-800">
                                        <LogOut size={14} className="mr-2" /> Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-gray-100 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;