import React from 'react';
import { X, FileText } from 'lucide-react';

const TermsModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                    >
                        <X size={28} />
                    </button>
                    <div className="flex items-center gap-3">
                        <FileText size={32} />
                        <h2 className="text-3xl font-black">Terms and Conditions</h2>
                    </div>
                    <p className="text-cyan-100 mt-2">Last Updated: December 18, 2025</p>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto flex-1 space-y-6">
                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h3>
                        <p className="text-gray-700 leading-relaxed">
                            By accessing and using SecondBook's services, you agree to be bound by these Terms and Conditions. 
                            If you do not agree to these terms, please do not use our platform.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">2. Use of Service</h3>
                        <p className="text-gray-700 leading-relaxed mb-2">
                            SecondBook provides a platform for buying and selling preloved books. By using our service, you agree to:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                            <li>Provide accurate and complete information during registration</li>
                            <li>Maintain the security of your account credentials</li>
                            <li>Not use the platform for any illegal or unauthorized purposes</li>
                            <li>Not attempt to interfere with the proper functioning of the platform</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">3. Book Conditions</h3>
                        <p className="text-gray-700 leading-relaxed">
                            All books are preloved and sold in their current condition. While we strive to accurately describe 
                            each book's condition, minor imperfections may not be listed. All sales are final unless the item 
                            is significantly not as described.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">4. Pricing and Payment</h3>
                        <p className="text-gray-700 leading-relaxed">
                            All prices are listed in RM (Malaysian Ringgit). Payment must be made in full at the time of purchase. We accept 
                            various payment methods as indicated during checkout. Prices are subject to change without notice.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">5. Shipping and Delivery</h3>
                        <p className="text-gray-700 leading-relaxed">
                            We aim to ship all orders within 1-3 business days. Delivery times may vary depending on your 
                            location. SecondBook is not responsible for delays caused by shipping carriers or customs.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">6. Returns and Refunds</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Returns are accepted within 14 days of delivery if the item is significantly not as described. 
                            The book must be returned in the same condition as received. Refunds will be processed within 
                            5-7 business days after receiving the returned item.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">7. Intellectual Property</h3>
                        <p className="text-gray-700 leading-relaxed">
                            All content on SecondBook, including text, graphics, logos, and images, is the property of 
                            SecondBook and protected by copyright laws. You may not reproduce, distribute, or create 
                            derivative works without our express written permission.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">8. Limitation of Liability</h3>
                        <p className="text-gray-700 leading-relaxed">
                            SecondBook shall not be liable for any indirect, incidental, special, or consequential damages 
                            arising from your use of our platform or purchase of products. Our total liability shall not 
                            exceed the amount paid for the specific product in question.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">9. Changes to Terms</h3>
                        <p className="text-gray-700 leading-relaxed">
                            We reserve the right to modify these Terms and Conditions at any time. Changes will be effective 
                            immediately upon posting. Your continued use of the platform constitutes acceptance of the modified terms.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">10. Contact Information</h3>
                        <p className="text-gray-700 leading-relaxed">
                            If you have any questions about these Terms and Conditions, please contact us at:
                            <br />
                            <span className="font-semibold">Email:</span> support@secondbook.com
                            <br />
                            <span className="font-semibold">Phone:</span> +1 (555) 123-4567
                        </p>
                    </section>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="w-full bg-cyan-500 text-white font-bold py-3 rounded-xl hover:bg-cyan-600 transition-all"
                    >
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsModal;
