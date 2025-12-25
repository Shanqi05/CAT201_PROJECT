import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, ArrowLeft } from 'lucide-react';
import mockBooks from '../../api/mockBooks.json';

const ManageBooks = () => {
    const [books, setBooks] = useState(mockBooks);
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = (id) => {
        if(window.confirm("Are you sure you want to remove this book?")) {
            setBooks(books.filter(book => book.id !== id));
        }
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page-container">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        to="/admin-dashboard"
                        className="flex items-center text-gray-600 hover:text-cyan-600 transition"
                    >
                        <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-black text-gray-900">Manage Inventory</h1>
                </div>
                <button className="bg-cyan-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-cyan-700 transition">
                    <Plus size={20} className="mr-2" /> Add New Book
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search books by title, author, or category..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="p-4 font-bold text-gray-600 uppercase text-xs">Book Details</th>
                        <th className="p-4 font-bold text-gray-600 uppercase text-xs">Category</th>
                        <th className="p-4 font-bold text-gray-600 uppercase text-xs">Price</th>
                        <th className="p-4 font-bold text-gray-600 uppercase text-xs">Stock</th>
                        <th className="p-4 font-bold text-gray-600 uppercase text-xs text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {filteredBooks.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="p-8 text-center text-gray-500">
                                No books found matching "{searchTerm}"
                            </td>
                        </tr>
                    ) : (
                        filteredBooks.map((book) => (
                        <tr key={book.id} className="hover:bg-gray-50 transition">
                            <td className="p-4">
                                <div className="flex items-center">
                                    <img src={book.imageUrl} alt={book.title} className="w-10 h-14 object-cover rounded mr-3 shadow-sm" />
                                    <div>
                                        <p className="font-bold text-gray-800">{book.title}</p>
                                        <p className="text-xs text-gray-500">{book.author}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4 text-sm text-gray-600">{book.category}</td>
                            <td className="p-4 font-bold text-cyan-600">${book.price.toFixed(2)}</td>
                            <td className="p-4">
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">In Stock</span>
                            </td>
                            <td className="p-4">
                                <div className="flex justify-center gap-2">
                                    <button className="p-2 text-blue-500 hover:bg-blue-50 rounded"><Edit size={18}/></button>
                                    <button
                                        onClick={() => handleDelete(book.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 size={18}/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 text-sm text-gray-500">
                Showing {filteredBooks.length} of {books.length} books
            </div>
        </div>
    );
};

export default ManageBooks;