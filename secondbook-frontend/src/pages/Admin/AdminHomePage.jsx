import React from 'react';
import mockBooks from '../../api/mockBooks.json';
import PROMO_BANNER_PATH from '../../assets/images/promo_banner.png';
import { BookOpen, Users, TrendingUp, Star, MoreVertical } from 'lucide-react';

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
    const stats = [
        { label: "Total Books", value: mockBooks.length, icon: <BookOpen />, color: "bg-cyan-500", increase: "+12%" },
        { label: "Total Earnings", value: "$22,520", icon: <TrendingUp />, color: "bg-green-500", increase: "+8.4%" },
        { label: "Active Users", value: "1,204", icon: <Users />, color: "bg-purple-500", increase: "+3%" },
        { label: "Pending Reviews", value: mockReviews.length, icon: <Star />, color: "bg-pink-500", increase: "+1" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10">
            {/* Title Section */}
            <div>
                <h1 className="text-2xl font-black text-gray-800" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Dashboard Overview
                </h1>
                <p className="text-gray-500 text-sm">Here's what's happening today.</p>
            </div>

            {/* A. STATS CARDS */}
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

            {/* B. MAIN TABLES/WIDGETS AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Column 1: Recent Listings */}
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

                {/* Column 2: Banners */}
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
    );
};

export default AdminHomePage;