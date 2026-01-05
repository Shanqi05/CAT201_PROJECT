import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, X, Upload } from 'lucide-react';

const ManageBooks = () => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '', author: '', type: 'SELL', price: '', condition: 'Good', image: null
    });
    const [previewUrl, setPreviewUrl] = useState(null);

    const fetchBooks = async () => {
        try {
            const response = await fetch('http://localhost:8080/CAT201_project/getBooks', {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Data fetched:", data);
                setBooks(data);
            } else {
                console.error("Failed to fetch books");
            }
        } catch (error) {
            console.error("Error connecting to server:", error);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    // --- Handlers ---

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('title', formData.title);
        data.append('author', formData.author);
        data.append('type', formData.type);
        data.append('price', formData.price);
        data.append('condition', formData.condition);

        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            const response = await fetch('http://localhost:8080/CAT201_project/addBook', {
                method: 'POST',
                credentials: 'include',
                body: data,
            });

            if (response.ok) {
                alert("Book added successfully!");
                setShowModal(false);
                setBooks([...books, {
                    id: Date.now(),
                    ...formData,
                    imageUrl: previewUrl || "https://via.placeholder.com/150",
                    price: parseFloat(formData.price),
                    condition: formData.condition
                }]);
                setFormData({ title: '', author: '', type: 'SELL', condition: 'Good', price: '', image: null });
                setPreviewUrl(null);
            } else {
                alert("Failed to upload book. Server error.");
            }
        } catch (error) {
            console.error("Error uploading book:", error);
            alert("Error connecting to server.");
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Are you sure you want to remove this book?")) {
            try {
                const response = await fetch(`http://localhost:8080/CAT201_project/deleteBook?id=${id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });

                if (response.ok) {
                    setBooks(books.filter(book => book.id !== id));
                    alert("Book deleted successfully!");
                } else {
                    alert("Failed to delete book.");
                }
            } catch (error) {
                console.error("Error deleting book:", error);
                alert("Error connecting to server.");
            }
        }
    };

    const filteredBooks = books.filter(book =>
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (book.type || book.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto w-full relative">

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Manage Inventory
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        View, update, and organize your bookstore collection.
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg flex items-center transition-all shadow-lg hover:shadow-xl group"
                >
                    <Plus size={18} className="mr-2 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-sm">Add New Book</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search title, author, category..."
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none text-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center px-4 py-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 border border-gray-200 transition text-sm font-bold">
                    <Filter size={16} className="mr-2" /> Filters
                </button>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                                <th className="p-5">Book Details</th>
                                <th className="p-5">Type</th>
                                <th className="p-5">Condition</th>
                                <th className="p-5">Price</th>
                                <th className="p-5">Status</th>
                                <th className="p-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredBooks.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-gray-500">
                                        No books found matching "{searchTerm}"
                                    </td>
                                </tr>
                            ) : (
                                filteredBooks.map((book) => (
                                    <tr key={book.id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-16 flex-shrink-0 rounded-md overflow-hidden shadow-sm border border-gray-200">
                                                    <img
                                                        src={
                                                            book.imageUrl
                                                            ? book.imageUrl
                                                            : `http://localhost:8080/CAT201_project/uploads/${book.imagePath || book.image}`
                                                        }
                                                        alt={book.title}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {e.target.src = "https://via.placeholder.com/150"}}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 leading-tight">{book.title}</p>
                                                    <p className="text-xs text-gray-500 mt-1 font-medium">{book.author}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                                {book.type || book.category}
                                            </span>
                                        </td>
                                        {/* [UPDATE 4]: 显示 Condition */}
                                        <td className="p-5">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                                (book.condition === 'New' || book.condition === 'Like New')
                                                ? 'bg-purple-50 text-purple-700 border-purple-100'
                                                : 'bg-orange-50 text-orange-700 border-orange-100'
                                            }`}>
                                                {book.condition || 'Good'}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <span className="font-mono font-bold text-gray-900 text-sm">
                                                RM {parseFloat(book.price).toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                {book.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                {/* add update func here*/}
                                                <button className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"><Edit size={18}/></button>
                                                <button onClick={() => handleDelete(book.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- ADD BOOK MODAL --- */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-black text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Add New Book
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">

                            {/* Title & Author */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Book Title</label>
                                    <input
                                        type="text" name="title" required
                                        value={formData.title} onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none transition-all"
                                        placeholder="Enter title"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Author</label>
                                    <input
                                        type="text" name="author" required
                                        value={formData.author} onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none transition-all"
                                        placeholder="Author name"
                                    />
                                </div>
                            </div>

                            {/* [UPDATE 5]: Type 和 Condition 放一排 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                                    <select
                                        name="type"
                                        value={formData.type} onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none transition-all appearance-none"
                                    >
                                        <option value="SELL">Sell</option>
                                        <option value="DONATE">Donate</option>
                                        <option value="Fiction">Fiction</option>
                                        <option value="Non-Fiction">Non-Fiction</option>
                                        <option value="Children">Children</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Condition</label>
                                    <select
                                        name="condition"
                                        value={formData.condition} onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none transition-all appearance-none"
                                    >
                                        <option value="Brand new">Brand New</option>
                                        <option value="Like new">Like New</option>
                                        <option value="Acceptable">Acceptable</option>
                                        <option value="Old">Old</option>
                                    </select>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price (RM)</label>
                                <input
                                    type="number" name="price" step="0.01" required
                                    value={formData.price} onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none transition-all"
                                    placeholder="0.00"
                                />
                            </div>

                            {/* Image Upload Area */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Book Cover</label>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all hover:border-cyan-400 relative overflow-hidden group">
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-3 text-gray-400 group-hover:text-cyan-500 transition-colors" />
                                                <p className="text-sm text-gray-500"><span className="font-bold">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-gray-400">PNG, JPG (MAX. 2MB)</p>
                                            </div>
                                        )}
                                        <input type="file" name="image" className="hidden" accept="image/*" onChange={handleFileChange} required />
                                    </label>
                                </div>
                            </div>

                            {/* Modal Footer Actions */}
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-black text-cyan-400 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-cyan-500/20"
                                >
                                    Upload Book
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageBooks;