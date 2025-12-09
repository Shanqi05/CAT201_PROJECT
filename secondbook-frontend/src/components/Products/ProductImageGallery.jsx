// secondbook-frontend/src/components/Products/ProductImageGallery.jsx
import React, { useState } from 'react';

const ProductImageGallery = ({ images }) => {
    // Placeholder images for visual structure
    const placeholderImages = images || [
        'https://via.placeholder.com/600x900?text=Main+Cover',
        'https://via.placeholder.com/150x225?text=Spine',
        'https://via.placeholder.com/150x225?text=Back+Cover',
        'https://via.placeholder.com/150x225?text=Detail+Page',
    ];

    const [mainImage, setMainImage] = useState(placeholderImages[0]);

    return (
        <div className="flex flex-col md:flex-row gap-4">
            {/* Thumbnail Gallery (Left/Top) */}
            <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-3 overflow-x-auto md:overflow-hidden p-1">
                {placeholderImages.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className={`w-16 h-24 object-cover rounded-lg cursor-pointer transition-all duration-200 shadow-md 
                        ${img === mainImage ? 'ring-4 ring-indigo-500 scale-105' : 'opacity-70 hover:opacity-100'}`}
                        onClick={() => setMainImage(img)}
                    />
                ))}
            </div>

            {/* Main Image View (Right/Bottom) */}
            <div className="flex-1 bg-white rounded-xl shadow-2xl overflow-hidden aspect-[2/3]">
                <img
                    src={mainImage}
                    alt="Main product view"
                    className="w-full h-full object-contain"
                />
            </div>
        </div>
    );
};

export default ProductImageGallery;