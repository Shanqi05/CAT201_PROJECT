// secondbook-frontend/src/pages/User/AboutUsPage.jsx
import React from 'react';
import { BookOpen, Target, Users, Leaf, Lightbulb, Sparkles } from 'lucide-react';
import M1 from '../../assets/images/m1.jpeg';
import M2 from '../../assets/images/m2.jpeg';
import M3 from '../../assets/images/m3.jpeg';
import M4 from '../../assets/images/m4.jpeg';

const teamMembers = [
    { name: 'Tan Shan Qi', role: 'Store Manager', desc: 'Driving the vision for sustainable reading.', photo: M2 },
    { name: 'Tan Xiang Huey', role: 'Service Manager', desc: 'Ensuring every book finds its way home affordably.', photo: M3 },
    { name: 'Choo Xuan', role: 'Sales Manager', desc: 'Crafting the perfect library experience.', photo: M1 },
    { name: 'Ng Xin Yuan', role: 'Officer Manager', desc: 'Championing our community of readers.', photo: M4 },
];

const AboutUsPage = () => {
    return (
        <div className="w-full bg-[#fdfdfd] pb-20">
            {/* 1. Hero Section - 增加了强力遮罩确保文字可见 */}
            <div className="relative h-[500px] w-full flex items-center justify-center overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000" 
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Team collaboration"
                />
                
                {/* 核心修正：叠加一层深色半透明遮罩 (Overlay) */}
                <div className="absolute inset-0 bg-black/50 z-[1]" />
                
                {/* 底部白色渐变过渡，让内容区更自然 */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#fdfdfd] via-transparent to-transparent z-[2]" />
                
                <div className="relative z-10 text-center px-6">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <Sparkles className="text-yellow-400 w-6 h-6 animate-pulse" />
                        <span className="text-white font-bold tracking-[0.4em] text-sm uppercase drop-shadow-md">
                            Our Journey, Your Stories
                        </span>
                    </div>
                    
                    {/* 给标题加了深色阴影 (drop-shadow) 保证可见度 */}
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]" style={{ fontFamily: 'Playfair Display, serif' }}>
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 italic">Us.</span>
                    </h1>
                    
                    <p className="mt-8 text-white text-lg md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                        "More than just a bookstore—we are a movement dedicated to literacy, sustainability, and shared discovery."
                    </p>
                </div>
            </div>

            {/* 下方内容保持不变 */}
            <div className="max-w-7xl mx-auto px-6 space-y-24 mt-20">
                
                {/* 2. How it Started Section */}
                <section className="bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="p-4 bg-purple-100 rounded-2xl">
                            <Lightbulb className="w-8 h-8 text-purple-600" />
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                            How It Started
                        </h2>
                    </div>

                    <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-6">
                        <p className="text-lg">
                            SecondBook was born not in a boardroom, but in a cluttered university dorm room. Our small group of founders, all passionate readers and students, were frustrated by two glaring realities: the astronomical cost of textbooks and the sight of countless perfectly readable books being tossed into landfills after just one use. <strong className="text-gray-900">We saw books as treasures, not disposable goods.</strong>
                        </p>
                        <p className="text-lg">
                            We started with a simple experiment: collecting overlooked titles from campus libraries and friends, creating handwritten listings, and hoping someone, somewhere, would appreciate a book's second life. The response was overwhelming! Readers embraced the affordability, the sustainability, and the charming "preloved" history each book carried. That initial spark quickly ignited into SecondBook, a platform built on the belief that <strong className="text-purple-600 italic text-xl">knowledge must be accessible and sustainable.</strong>
                        </p>
                    </div>
                </section>

                {/* 3. Our Mission Section */}
                <section className="bg-gradient-to-br from-indigo-50 to-white p-12 rounded-[3rem] border border-indigo-100 shadow-inner">
                    <div className="flex items-center space-x-4 mb-12">
                        <div className="p-4 bg-indigo-100 rounded-2xl">
                            <Target className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Our Mission
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="bg-white p-8 rounded-3xl shadow-md border-b-8 border-green-500 transform hover:-translate-y-2 transition-all duration-300">
                            <Leaf className="w-8 h-8 text-green-600 mb-4" />
                            <h4 className="font-black text-xl mb-3 text-gray-900">Planet-First Sustainability</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                We are fiercely committed to reducing our collective carbon footprint. Every time a book is purchased preloved, it saves energy, water, and trees required for new production.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-sm border-b-8 border-cyan-500 transform hover:-translate-y-2 transition-all duration-300">
                            <BookOpen className="w-8 h-8 text-cyan-600 mb-4" />
                            <h4 className="font-black text-xl mb-3 text-gray-900">Affordable Knowledge</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                High-quality reading shouldn't be a luxury. Our mission is to democratize knowledge by keeping prices low, ensuring that learners can access the literature they crave.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-sm border-b-8 border-purple-500 transform hover:-translate-y-2 transition-all duration-300">
                            <Users className="w-8 h-8 text-purple-600 mb-4" />
                            <h4 className="font-black text-xl mb-3 text-gray-900">Shared Love for Reading</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                We are cultivating a vibrant community where stories are shared, not just sold. Every purchase connects one reader to another, strengthening the bond through literature.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 4. Team Section - 一行四个 */}
                <section className="pt-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                            The Leadership Team
                        </h2>
                        <div className="h-1.5 w-24 bg-purple-600 mx-auto mt-4 rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="flex flex-col items-center group">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-purple-600 rounded-[2.5rem] rotate-3 group-hover:rotate-6 transition-transform opacity-10" />
                                    <img
                                        src={member.photo}
                                        alt={member.role}
                                        className="relative w-48 h-56 object-cover rounded-[2.5rem] shadow-xl border-4 border-white"
                                    />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-1">{member.name}</h3>
                                <div className="bg-purple-100 text-purple-700 text-[10px] font-black tracking-widest uppercase px-4 py-1 rounded-full mb-3">
                                    {member.role}
                                </div>
                                <p className="text-gray-500 text-center text-xs font-medium italic max-w-[200px]">
                                    "{member.desc}"
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutUsPage;