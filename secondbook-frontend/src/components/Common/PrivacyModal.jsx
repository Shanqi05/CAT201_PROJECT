import React from 'react';
import { X, Shield } from 'lucide-react';

const PrivacyModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                    >
                        <X size={28} />
                    </button>
                    <div className="flex items-center gap-3">
                        <Shield size={32} />
                        <h2 className="text-3xl font-black">Privacy Policy</h2>
                    </div>
                    <p className="text-purple-100 mt-2">Last Updated: December 18, 2025</p>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto flex-1 space-y-6">
                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h3>
                        <p className="text-gray-700 leading-relaxed mb-2">
                            We collect information that you provide directly to us, including:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                            <li>Name, email address, and contact information</li>
                            <li>Username and password for your account</li>
                            <li>Shipping and billing addresses</li>
                            <li>Payment information (processed securely through third-party providers)</li>
                            <li>Purchase history and browsing activity on our platform</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h3>
                        <p className="text-gray-700 leading-relaxed mb-2">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                            <li>Process and fulfill your orders</li>
                            <li>Communicate with you about your account and purchases</li>
                            <li>Send you promotional materials (with your consent)</li>
                            <li>Improve our services and user experience</li>
                            <li>Detect and prevent fraud or abuse</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">3. Information Sharing</h3>
                        <p className="text-gray-700 leading-relaxed">
                            We do not sell your personal information to third parties. We may share your information with:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mt-2">
                            <li>Service providers who help us operate our platform (payment processors, shipping companies)</li>
                            <li>Law enforcement or government agencies when required by law</li>
                            <li>Business partners with your explicit consent</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">4. Data Security</h3>
                        <p className="text-gray-700 leading-relaxed">
                            We implement industry-standard security measures to protect your personal information from 
                            unauthorized access, disclosure, alteration, or destruction. However, no method of transmission 
                            over the internet is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">5. Cookies and Tracking</h3>
                        <p className="text-gray-700 leading-relaxed">
                            We use cookies and similar tracking technologies to enhance your browsing experience, analyze 
                            site traffic, and understand user preferences. You can control cookie settings through your 
                            browser, but disabling cookies may limit some functionality of our platform.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">6. Your Rights</h3>
                        <p className="text-gray-700 leading-relaxed mb-2">
                            You have the right to:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                            <li>Access and review your personal information</li>
                            <li>Request correction of inaccurate data</li>
                            <li>Request deletion of your account and data</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Request a copy of your data in a portable format</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">7. Children's Privacy</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Our platform is not intended for children under 13 years of age. We do not knowingly collect 
                            personal information from children. If you believe we have collected information from a child, 
                            please contact us immediately.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">8. Data Retention</h3>
                        <p className="text-gray-700 leading-relaxed">
                            We retain your personal information for as long as necessary to fulfill the purposes outlined 
                            in this policy, unless a longer retention period is required by law. When data is no longer 
                            needed, we securely delete or anonymize it.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">9. Changes to Privacy Policy</h3>
                        <p className="text-gray-700 leading-relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of any material changes 
                            by posting the new policy on our platform and updating the "Last Updated" date. Your continued 
                            use of our services constitutes acceptance of the updated policy.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">10. Contact Us</h3>
                        <p className="text-gray-700 leading-relaxed">
                            If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
                            <br />
                            <span className="font-semibold">Email:</span> privacy@bookshelter.com
                            <br />
                            <span className="font-semibold">Phone:</span> +1 (555) 123-4567
                            <br />
                            <span className="font-semibold">Address:</span> 123 Book Street, Reading City, RC 12345
                        </p>
                    </section>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="w-full bg-purple-500 text-white font-bold py-3 rounded-xl hover:bg-purple-600 transition-all"
                    >
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrivacyModal;
