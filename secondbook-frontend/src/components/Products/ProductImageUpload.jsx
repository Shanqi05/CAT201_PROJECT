// secondbook-frontend/src/components/Products/ProductImageUpload.jsx
import React, { useState } from 'react';
import { Upload, Image } from 'lucide-react';

const ProductImageUpload = ({ label = "Product Image Upload" }) => {
    const [fileName, setFileName] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            // **[HANDLE FILE UPLOAD LOGIC HERE]**
            // Use FileReader to preview the image, or FormData to prepare for API submission.
            console.log("File selected:", file);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-400 transition cursor-pointer">
                <label htmlFor="file-upload" className="relative cursor-pointer">
                    <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <div className="flex flex-col items-center">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
              <span className="font-medium text-indigo-600 hover:text-indigo-500">
                Click to upload
              </span>
                            {' or drag and drop'}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        {fileName && (
                            <p className="mt-2 text-sm font-semibold text-green-600 flex items-center">
                                <Image className="w-4 h-4 mr-1"/> File ready: {fileName}
                            </p>
                        )}
                    </div>
                </label>
            </div>
        </div>
    );
};

export default ProductImageUpload;