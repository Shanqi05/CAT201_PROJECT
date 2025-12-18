// secondbook-frontend/src/components/Common/Footer.jsx
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white mt-auto">
            <div className="page-container py-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Section 1 */}
                    <div>
                        <h4 className="font-bold text-lg mb-4">SecondBook</h4>
                        <p className="text-gray-400 text-sm">Giving preloved books a second life.</p>
                    </div>
                    {/* Section 2 */}
                    <div>
                        <h4 className="font-bold text-lg mb-4">Explore</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><a href="/books" className="hover:text-indigo-400">All Books</a></li>
                            <li><a href="/dashboard" className="hover:text-indigo-400">My Dashboard</a></li>
                        </ul>
                    </div>
                    {/* Section 3 */}
                    <div>
                        <h4 className="font-bold text-lg mb-4">Contact</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>Email: info@secondbook.com</li>
                            <li>Phone: +1 (555) 123-4567</li>
                        </ul>
                    </div>
                    {/* Section 4 */}
                    <div>
                        <h4 className="font-bold text-lg mb-4">Legal</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} SecondBook. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;