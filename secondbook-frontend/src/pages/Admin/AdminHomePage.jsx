// src/pages/Admin/AdminHomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import mockBooks from '../../api/mockBooks.json';
import PROMO_BANNER_PATH from '../../assets/images/promo_banner.png';
import {
    LayoutDashboard, BookOpen, Users, Settings, Search,
    Bell, Mail, LogOut, MoreVertical, TrendingUp, Star,
    ShoppingBag, Menu, Info, User, ChevronDown, BarChart2
} from 'lucide-react';

const mockReviews = [
    { name: 'Seaw Kim Tan', initials: 'SK', rating: 5, review: 'Books were securely wrapped...' },
    { name: 'Lee Fui San', initials: 'LF', rating: 4, review: 'Received on time. Good!' },
    { name: 'Rose', initials: 'RO', rating: 5, review: 'Wonderful! The album seems to be in great condition.' },
];

const heroContent = [
    { title: "SecondBook", subtitle: "PRELOVED", status: "Active", img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000" },
    { title: "Essentials", subtitle: "ACCESSORIES", status: "Scheduled", img: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&q=80&w=2000" },
    { title: "Our Story", subtitle: "ABOUT US", status: "Inactive", img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=2000" }
];

const AdminHomePage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState({ name: '', id: null, role: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setCurrentUser({
                    name: parsed.username || parsed.name || 'Admin',
                    id: parsed.id,
                    role: parsed.role
                });
            } catch (error) {
                console.error("Failed to parse user data", error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, link: '/admin/home', active: true },
        { name: 'Book', icon: <BookOpen size={20} />, link: '/admin/manage-books' },
        { name: 'Accessories', icon: <ShoppingBag size={20} />, link: '/admin/accessories' },
        { name: 'Users', icon: <Users size={20} />, link: '/admin/manage-users' },
        { name: 'Analytics', icon: <BarChart2 size={20} />, link: '/admin/analytics' },

        { name: 'Settings', icon: <Settings size={20} />, link: '/admin/settings' },
        { name: 'About Us', icon: <Info size={20} />, link: '/admin/about-content' },
    ];

    const stats = [
        { label: "Total Books", value: mockBooks.length, icon: <BookOpen />, color: "bg-cyan-500", increase: "+12%" },
        { label: "Total Earnings", value: "$22,520", icon: <TrendingUp />, color: "bg-green-500", increase: "+8.4%" },
        { label: "Active Users", value: "1,204", icon: <Users />, color: "bg-purple-500", increase: "+3%" },
        { label: "Pending Reviews", value: mockReviews.length, icon: <Star />, color: "bg-pink-500", increase: "+1" },
    ];

    return (
        <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">

            {/* --- SIDEBAR (BLACK THEME) --- */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-black shadow-xl transition-all duration-300 flex flex-col z-30 flex-shrink-0 text-white`}>

                {/* 1. Header Logo Area */}
                <div className="h-20 flex items-center justify-center border-b border-gray-800">
                    <Link to="/admin/home" className="flex items-center gap-2 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-8 h-8 text-cyan-400" strokeWidth={2.5} />
                        </div>
                        {sidebarOpen && (
                            <span
                                className="font-black text-2xl tracking-tight leading-none bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent"
                                style={{ fontFamily: 'Playfair Display, serif' }}
                            >
                                SecondBook
                            </span>
                        )}
                    </Link>
                </div>

                {/* 2. User Profile -  */}
                <div className={`text-center border-b border-gray-800 transition-all duration-300 ${sidebarOpen ? 'p-6' : 'p-4'}`}>

                    {/* 头像容器：添加了动态宽度判断 (w-16 vs w-10) */}
                    <div className={`mx-auto rounded-full mb-3 overflow-hidden border-[3px] border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all duration-300 ${sidebarOpen ? 'w-16 h-16' : 'w-10 h-10'}`}>
                        <div className="w-full h-full bg-gray-800 text-white flex items-center justify-center">
                            {/* 图标也稍微动态调整大小 */}
                            <User size={sidebarOpen ? 30 : 20} />
                        </div>
                    </div>

                    {/* 文字信息：只有展开时显示，避免收起时溢出 */}
                    <div className={`transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                        <h3 className="font-bold text-gray-100 truncate px-2">{currentUser.name || 'Loading...'}</h3>
                        {currentUser.id && (
                            <p className="text-[10px] text-gray-400 font-mono mt-1 bg-gray-900 inline-block px-2 py-0.5 rounded border border-gray-700">
                                ID: {currentUser.id}
                            </p>
                        )}
                    </div>
                </div>

                {/* 3. Menu Items */}
                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <Link
                                    to={item.link}
                                    className={`flex items-center px-6 py-3 text-sm font-bold transition-all duration-200 ${
                                        item.active
                                        ? 'bg-gray-900 text-cyan-400 border-r-4 border-cyan-400 shadow-[inset_10px_0_20px_-10px_rgba(34,211,238,0.1)]'
                                        : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                                    }`}
                                >
                                    <span className={item.active ? 'text-cyan-400' : 'text-gray-500 group-hover:text-white'}>
                                        {item.icon}
                                    </span>
                                    {sidebarOpen && <span className="ml-3">{item.name}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>


            {/* --- RIGHT COLUMN (Main Content) --- */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">

                {/* 4. HEADER (BLACK THEME) */}
                <header className="h-20 bg-black shadow-md flex items-center justify-between px-8 z-20 flex-shrink-0 border-b border-gray-800">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white transition-colors">
                            <Menu size={24} />
                        </button>
                        <div className="relative hidden md:block w-96">
                            <input
                                type="text"
                                placeholder="Search inventory, orders, users..."
                                className="w-full bg-gray-900 border border-gray-700 text-gray-200 rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-gray-500"
                            />
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

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-3 hover:bg-gray-900 p-2 rounded-lg transition-colors focus:outline-none"
                            >
                                <div className="w-9 h-9 bg-gray-800 text-cyan-400 rounded-full flex items-center justify-center shadow-md border border-gray-700">
                                    <span className="font-bold text-sm">
                                        {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
                                    </span>
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-xs font-bold text-gray-200 leading-none">{currentUser.name}</p>
                                    <p className="text-[10px] text-gray-500">Administrator</p>
                                </div>
                                <ChevronDown size={14} className={`text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                    <div className="px-4 py-2 border-b border-gray-800 mb-2">
                                        <p className="text-xs text-gray-500">Signed in as</p>
                                        <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                                    </div>
                                    <Link to="/admin/settings" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">
                                        <Settings size={14} className="mr-2" /> Settings
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-800"
                                    >
                                        <LogOut size={14} className="mr-2" /> Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-gray-100 p-8">
                    <div className="max-w-7xl mx-auto space-y-8 pb-10">

                        <div>
                            <h1 className="text-2xl font-black text-gray-800" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Dashboard Overview
                            </h1>
                            <p className="text-gray-500 text-sm">Welcome back, {currentUser.name || 'Admin'}. Here's what's happening today.</p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                                    <div>
                                        <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-lg mb-2`}>
                                            {stat.icon}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
                                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
                                        <p className="text-xs text-green-600 font-bold mt-1 bg-green-50 inline-block px-2 py-0.5 rounded-full">
                                            {stat.increase}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Listings & Banners */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">Recent Listings</h3>
                                        <p className="text-xs text-gray-500">Latest books added to inventory</p>
                                    </div>
                                    <button className="p-2 hover:bg-gray-100 rounded-full"><MoreVertical size={18} /></button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold text-xs">
                                            <tr>
                                                <th className="px-6 py-4">Book Title</th>
                                                <th className="px-6 py-4">Price</th>
                                                <th className="px-6 py-4">Condition</th>
                                                <th className="px-6 py-4">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {mockBooks.slice(0, 5).map((book) => (
                                                <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-3">
                                                        <div className="w-8 h-10 flex-shrink-0 border border-gray-200 rounded overflow-hidden">
                                                             <img src={book.coverImage} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                        <span className="line-clamp-1">{book.title}</span>
                                                    </td>
                                                    <td className="px-6 py-4 font-mono text-gray-600">${book.price}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full font-bold border border-blue-100">
                                                            {book.condition}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-[10px] px-2 py-1 bg-green-100 text-green-800 rounded uppercase font-bold tracking-wider">
                                                            Active
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-gray-800">Homepage Banners</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {heroContent.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-2 rounded-lg border border-gray-100 hover:border-cyan-400 transition-all bg-gray-50 group">
                                                <img src={item.img} alt="Banner" className="w-12 h-8 object-cover rounded shadow-sm" />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-xs font-bold text-gray-900 truncate">{item.title}</h4>
                                                    <p className="text-[10px] text-gray-500">{item.subtitle}</p>
                                                </div>
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4">
                                        <div className="relative h-20 rounded-lg overflow-hidden group cursor-pointer border border-gray-200">
                                            <img src={PROMO_BANNER_PATH} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="bg-black/70 text-white text-[10px] uppercase font-bold px-2 py-1 rounded backdrop-blur-sm">Edit Promo</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminHomePage;