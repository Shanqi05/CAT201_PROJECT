import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccessPage = () => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <div className="bg-green-100 p-6 rounded-full mb-6">
                <CheckCircle className="w-16 h-16 text-green-600" />
            </div>

            <h1 className="text-4xl font-bold text-gray-800 mb-4">Thank You!</h1>
            <p className="text-xl text-gray-600 mb-8">
                Your order has been placed successfully.
            </p>

            <div className="space-x-4">
                <Link to="/books" className="px-6 py-3 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition">
                    Continue Shopping
                </Link>
                <Link to="/dashboard" className="px-6 py-3 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition">
                    View Order History
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccessPage;