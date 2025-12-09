// secondbook-frontend/src/components/Common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center h-full min-h-[300px]">
            <div className="flex flex-col items-center">
                {/* The Spinner UI */}
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
                <p className="mt-4 text-lg text-gray-600 font-medium">Loading your next adventure...</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;