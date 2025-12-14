// secondbook-frontend/src/pages/User/AboutUsPage.jsx
import React from 'react';
import { BookOpen, Target, Users, Leaf, Lightbulb } from 'lucide-react';

// Assuming the image import path is confirmed to be working:
import MemberPhoto from '../../assets/images/member.png';

const AboutUsPage = () => {
    return (
        <div className="page-container space-y-16">

            {/* --- 1. Top Section: About SecondBook (The main header for the page) --- */}
            <section className="text-center bg-white p-16 rounded-3xl shadow-xl border-t-8 border-pink-400">
                <BookOpen className="w-16 h-16 text-pink-600 mx-auto mb-4" />
                <h1 className="text-5xl font-black text-gray-900 mb-3 tracking-tight border-b-4 border-teal-300 pb-2 inline-block">
                    About SecondBook
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 font-medium italic mt-4">
                    More than just a bookstore—we are a movement dedicated to literacy, sustainability, and shared discovery.
                </p>
            </section>

            {/* --- 2. How it Started Section (Separate Header) --- */}
            <section className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                    <Lightbulb className="w-7 h-7 text-pink-600" />
                    <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-pink-300 pb-1 inline-block">
                        How It Started
                    </h2>
                </div>

                <p className="text-gray-700 leading-loose text-lg">
                    SecondBook was born not in a boardroom, but in a cluttered university dorm room. Our small group of founders, all passionate readers and students, were frustrated by two glaring realities: the astronomical cost of textbooks and the sight of countless perfectly readable books being tossed into landfills after just one use. **We saw books as treasures, not disposable goods.**
                </p>
                <p className="text-gray-700 leading-loose text-lg mt-4">
                    We started with a simple experiment: collecting overlooked titles from campus libraries and friends, creating handwritten listings, and hoping someone, somewhere, would appreciate a book's second life. The response was overwhelming! Readers embraced the affordability, the sustainability, and the charming "preloved" history each book carried. That initial spark quickly ignited into SecondBook, a platform built on the belief that **knowledge must be accessible and sustainable.** Every purchase supports our mission to keep stories alive and affordable.
                </p>
            </section>

            {/* --- 3. Our Mission Section (Separate Header) --- */}
            <section className="bg-teal-50 p-8 rounded-xl shadow-inner border border-teal-200">
                <div className="flex items-center space-x-3 mb-6">
                    <Target className="w-7 h-7 text-teal-600" />
                    <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-teal-300 pb-1 inline-block">
                        Our Mission
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Mission Pillar 1: Sustainability */}
                    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
                        <Leaf className="w-6 h-6 text-green-600 mb-2" />
                        <h4 className="font-extrabold text-xl mb-2 text-gray-900">Planet-First Sustainability</h4>
                        <p className="text-gray-700 text-base">
                            We are fiercely committed to reducing our collective carbon footprint. Every time a book is purchased preloved, it saves energy, water, and trees required for new production. We maximize the life-cycle of every single page.
                        </p>
                    </div>

                    {/* Mission Pillar 2: Accessibility */}
                    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-cyan-500">
                        <BookOpen className="w-6 h-6 text-cyan-600 mb-2" />
                        <h4 className="font-extrabold text-xl mb-2 text-gray-900">Affordable Knowledge for All</h4>
                        <p className="text-gray-700 text-base">
                            High-quality reading shouldn't be a luxury. Our mission is to democratize knowledge by keeping prices low, ensuring that students, families, and lifelong learners can access the literature they need and crave.
                        </p>
                    </div>

                    {/* Mission Pillar 3: Community */}
                    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-pink-500">
                        <Users className="w-6 h-6 text-pink-600 mb-2" />
                        <h4 className="font-extrabold text-xl mb-2 text-gray-900">Building a Shared Love for Reading</h4>
                        <p className="text-gray-700 text-base">
                            We are cultivating a vibrant community where stories are shared, not just sold. Every donation and every purchase connects one reader to another, strengthening the bond we share through literature.
                        </p>
                    </div>
                </div>
            </section>

            {/* --- 4. Our Team Section (The Photo at the very end) --- */}
            <section className="text-center pt-8">
                <div className="flex items-center justify-center space-x-3 mb-8">
                    <Users className="w-7 h-7 text-pink-600" />
                    <h2 className="text-3xl font-bold text-gray-800">
                        Meet the Dedicated SecondBook Team
                    </h2>
                </div>

                <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-2xl border-t-8 border-pink-500 transform hover:scale-[1.02] transition-transform duration-300">
                    <img
                        src={MemberPhoto}
                        alt="Group Assignment Members"
                        className="w-full h-auto object-cover rounded-lg mb-6 shadow-xl border-4 border-gray-100"
                    />
                    <h3 className="text-2xl font-extrabold text-gray-900">
                        The Core Development Team
                    </h3>
                    <p className="text-lg text-gray-700 mt-2">
                        We are a group of passionate students from the **[Your Course Name Here]** assignment, united by a love for reading and technology.
                    </p>
                    <p className="text-sm text-pink-600 mt-4 font-semibold">
                        Thank you for joining our mission!
                    </p>
                </div>
            </section>
        </div>
    );
};

export default AboutUsPage;