// secondbook-frontend/src/pages/User/ProductDetailPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import ProductImageGallery from '../../components/Products/ProductImageGallery';
import { Heart, Star, ShoppingCart } from 'lucide-react';

const ProductDetailPage = () => {
    const { id } = useParams();

    // Placeholder Data
    const book = {
        title: "Where the Crawdads Sing (Preloved Edition)",
        author: "Delia Owens",
        price: 15.50,
        condition: "Good - Minor cover wear",
        description: "A beautiful coming-of-age story and a mystery, exploring the life of an abandoned girl who raises herself in the marshlands of North Carolina. This preloved copy is ready for a new reader.",
        id: id,
    };

    return (
        <div className="page-container">
            <div className="bg-white p-8 rounded-xl shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Column 1: Image Gallery */}
                    <div className="lg:col-span-1">
                        <ProductImageGallery />
                    </div>

                    {/* Column 2: Product Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <h1 className="text-4xl font-extrabold text-gray-900">{book.title}</h1>
                        <p className="text-2xl text-gray-600">by <span className="font-semibold">{book.author}</span></p>

                        {/* Price & Actions */}
                        <div className="flex items-center space-x-8 border-t pt-4">
                            <span className="text-5xl font-bold text-indigo-600">${book.price.toFixed(2)}</span>
                            <button className="flex items-center bg-green-500 text-white font-bold py-3 px-8 rounded-full text-xl hover:bg-green-600 transition shadow-lg">
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                Add to Cart
                            </button>
                            <button className="p-3 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition">
                                <Heart className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Condition and Rating */}
                        <div className="text-lg space-y-1">
                            <p className="text-gray-800">Condition: <span className="font-semibold text-green-700">{book.condition}</span></p>
                            <div className="flex items-center text-yellow-500">
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 text-gray-300" />
                                <span className="text-gray-600 ml-2 text-sm">(4.1/5 rating)</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="pt-4 border-t">
                            <h2 className="text-2xl font-bold mb-3 text-gray-800">Overview</h2>
                            <p className="text-gray-700 leading-relaxed">{book.description}</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;