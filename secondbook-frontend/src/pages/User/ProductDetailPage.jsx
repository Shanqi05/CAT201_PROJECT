import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductImageGallery from '../../components/Products/ProductImageGallery';
import Toast from '../../components/Common/Toast';
import { Heart, Star, ShoppingCart, Check, ArrowLeft, Tag } from 'lucide-react';
import { addToCart } from '../../utils/cartUtils';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdded, setIsAdded] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/CAT201_project/getBook?id=${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setBook(data);
                } else {
                    console.error("Book not found");
                }
            } catch (error) {
                console.error("Error fetching book:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchBookDetails();
    }, [id]);

    const handleAddToCart = () => {
        if (!book) return;

        if (book.status === 'Sold') return;

        const API_BASE = "http://localhost:8080/CAT201_project/uploads/";
        const imageUrl = book.imagePath
            ? (book.imagePath.startsWith('http') ? book.imagePath : API_BASE + book.imagePath)
            : "https://via.placeholder.com/600x900?text=No+Cover";

        addToCart({ ...book, imageUrl }, 1, 'book');
        setShowToast(true);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!book) return <div className="text-center py-20">Product not found. <Link to="/books" className="text-blue-500 underline">Go back</Link></div>;

    const API_BASE = "http://localhost:8080/CAT201_project/uploads/";

    // Check if it's an external URL (Supabase) vs Local
    const imageUrl = book.imagePath
        ? (book.imagePath.startsWith('http') ? book.imagePath : API_BASE + book.imagePath)
        : "https://via.placeholder.com/600x900?text=No+Cover";

    const galleryImages = [imageUrl];

    const isSoldOut = book.status === 'Sold';

    return (
        <div className="page-container py-10 max-w-7xl mx-auto px-6">
            {showToast && <Toast message="Successfully added to cart!" type="success" onClose={() => setShowToast(false)} />}
            <Link to="/books" className="inline-flex items-center text-gray-500 hover:text-cyan-600 mb-6 transition-colors font-bold">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Browse
            </Link>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Image Section */}
                    <div className="lg:col-span-1">
                        <ProductImageGallery images={galleryImages} />
                        {isSoldOut && (
                            <div className="mt-4 text-center">
                                <span className="inline-block bg-black text-cyan-400 px-6 py-2 rounded-lg font-black text-sm uppercase tracking-widest shadow-lg">
                                    Item Sold Out
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight mb-2">{book.title}</h1>
                            <p className="text-xl text-gray-500 font-medium">by <span className="text-cyan-600">{book.author}</span></p>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 border-y border-gray-100 py-6">
                            <span className={`text-5xl font-black tracking-tighter ${isSoldOut ? 'text-gray-300 line-through' : 'text-gray-900'}`}>
                                RM {book.price?.toFixed(2)}
                            </span>

                            <button
                                onClick={handleAddToCart}
                                disabled={isSoldOut}
                                className={`flex items-center font-bold py-4 px-8 rounded-xl text-lg transition-all shadow-lg transform active:scale-95
                                    ${isSoldOut
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                    : (isAdded ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-gray-800')
                                }`}
                            >
                                {isSoldOut ? 'Sold Out' : (isAdded ? <><Check className="w-6 h-6 mr-2" /> Added</> : <><ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart</>)}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-gray-500 uppercase font-bold text-xs tracking-wider mb-1">Condition</p>
                                <p className="font-bold text-gray-900 text-lg">{book.condition || "Good"}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-gray-500 uppercase font-bold text-xs tracking-wider mb-1">Category</p>
                                <p className="font-bold text-gray-900 text-lg">{book.category || "General"}</p>
                            </div>

                            {/* Genres Display (Robust check for string or array) */}
                            {book.genres && (
                                <div className="col-span-1 md:col-span-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-gray-500 uppercase font-bold text-xs tracking-wider mb-3 flex items-center">
                                        <Tag size={14} className="mr-1"/> Genres
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {(() => {
                                            let gList = [];
                                            if (Array.isArray(book.genres)) gList = book.genres;
                                            else if (typeof book.genres === 'string') gList = book.genres.replace(/[{"}]/g, '').split(',');

                                            return gList.filter(g => g && g.trim() !== '').map((genre, index) => (
                                                <span key={index} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 shadow-sm">
                                                    {genre.trim()}
                                                </span>
                                            ));
                                        })()}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;