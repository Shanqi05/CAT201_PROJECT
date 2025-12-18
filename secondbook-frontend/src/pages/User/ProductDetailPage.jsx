import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductImageGallery from '../../components/Products/ProductImageGallery';
import { Heart, Star, ShoppingCart, Check } from 'lucide-react';

// 1. IMPORT YOUR UTILS
import { addToCart } from '../../utils/cartUtils';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [isAdded, setIsAdded] = useState(false); // For button animation

    // 2. YOUR PLACEHOLDER DATA
    const book = {
        id: id || "1",
        title: "Where the Crawdads Sing (Preloved Edition)",
        author: "Delia Owens",
        price: 15.50, // Ensure this is a number, not a string
        condition: "Good - Minor cover wear",
        description: "A beautiful coming-of-age story and a mystery...",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
        // Added stock just in case your utils check for it (optional)
        stock: 5
    };

    // 3. HANDLE ADD TO CART
    const handleAddToCart = () => {
        // Use the function from your utils file
        addToCart(book, 1);

        // Visual feedback (Button turns green)
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
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

                            {/* --- THE CONNECTED BUTTON --- */}
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdded}
                                className={`flex items-center font-bold py-3 px-8 rounded-full text-xl transition shadow-lg transform active:scale-95
                                    ${isAdded ? 'bg-green-600 text-white' : 'bg-green-500 text-white hover:bg-green-600'}
                                `}
                            >
                                {isAdded ? (
                                    <><Check className="w-6 h-6 mr-2" /> Added!</>
                                ) : (
                                    <><ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart</>
                                )}
                            </button>
                            {/* --------------------------- */}

                            <button className="p-3 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition">
                                <Heart className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Details... */}
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