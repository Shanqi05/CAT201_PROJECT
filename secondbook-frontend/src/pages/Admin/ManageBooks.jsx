import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, Upload, Package, ChevronDown, ChevronUp } from 'lucide-react';

const ManageBooks = () => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // Toggle state for Genre list
    const [showGenres, setShowGenres] = useState(false);

    const [formData, setFormData] = useState({
        title: '', author: '', category: 'Fiction', price: '', condition: 'Brand new', image: null, genres: [], status: 'Available'
    });
    const [previewUrl, setPreviewUrl] = useState(null);

    // Genre Options
    const genreOptions = [
        "Action/Adventure", "Art/Photography", "Biography/Memoir", "Business/Finance",
        "Children's", "Comics/Graphic Novels", "Cookbooks/Food", "Crime", "Dystopian",
        "Fantasy", "Fiction", "Health/Fitness", "History", "Historical Fiction", "Horror", "Music",
        "Mystery", "Non-Fiction", "Politics", "Religion/Spirituality", "Romance",
        "Science", "Sci-Fi", "Self-Help", "Technology", "Thriller", "Travel", "Young Adult"
    ];

    const fetchBooks = async () => {
        try {
            const response = await fetch('http://localhost:8080/CAT201_project/getBooks');
            if (response.ok) {
                const data = await response.json();
                setBooks(data);
            }
        } catch (error) {
            console.error("Error connecting to server:", error);
        }
    };

    useEffect(() => { fetchBooks(); }, []);

    // --- Handlers ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenreChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            if (checked) return { ...prev, genres: [...prev.genres, value] };
            else return { ...prev, genres: prev.genres.filter(g => g !== value) };
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // Open Modal for Editing
    const handleEditClick = (book) => {
        setIsEditing(true);
        setEditId(book.bookId);
        setShowGenres(false); // Reset genre toggle

        // Robust genre parsing
        let currentGenres = [];
        if (Array.isArray(book.genres)) {
            currentGenres = book.genres;
        } else if (typeof book.genres === 'string') {
            // Remove curly braces {} if they come from Postgres array string format
            const cleanStr = book.genres.replace(/[{"}]/g, '');
            currentGenres = cleanStr.split(',').map(g => g.trim()).filter(g => g !== '');
        }

        setFormData({
            title: book.title,
            author: book.author,
            category: book.category,
            price: book.price,
            condition: book.condition,
            status: book.status || 'Available',
            genres: currentGenres,
            image: null
        });

        if (book.imagePath) {
            const imgUrl = book.imagePath.startsWith('http')
                ? book.imagePath
                : `http://localhost:8080/CAT201_project/uploads/${book.imagePath}`;
            setPreviewUrl(imgUrl);
        } else {
            setPreviewUrl(null);
        }
        setShowModal(true);
    };

    // Open Modal for Adding
    const handleAddClick = () => {
        setIsEditing(false);
        setEditId(null);
        setShowGenres(false); // Reset genre toggle
        setFormData({ title: '', author: '', category: 'Fiction', price: '', condition: 'Brand new', image: null, genres: [], status: 'Available' });
        setPreviewUrl(null);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('author', formData.author);
        data.append('category', formData.category);
        data.append('price', formData.price);
        data.append('condition', formData.condition);
        data.append('status', formData.status);

        // Append Genres
        formData.genres.forEach(g => data.append('genres', g));

        if (formData.image) data.append('image', formData.image);

        // Switch endpoint based on mode
        const endpoint = isEditing
            ? 'http://localhost:8080/CAT201_project/updateBook'
            : 'http://localhost:8080/CAT201_project/addBook';

        if (isEditing) data.append('id', editId);

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                credentials: 'include',
                body: data,
            });

            if (response.ok) {
                alert(isEditing ? "Book updated!" : "Book added successfully!");
                setShowModal(false);
                fetchBooks();
                // Reset Form
                setFormData({ title: '', author: '', category: 'Fiction', condition: 'Brand new', price: '', image: null, genres: [], status: 'Available' });
                setPreviewUrl(null);
            } else {
                alert("Operation failed. Server error.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Delete this book?")) {
            try {
                const response = await fetch(`http://localhost:8080/CAT201_project/deleteBook?id=${id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                if (response.ok) {
                    setBooks(books.filter(b => b.bookId !== id));
                    alert("Book deleted!");
                }
            } catch (error) { console.error(error); }
        }
    };

    const filteredBooks = books.filter(book =>
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto w-full relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Manage Inventory</h1>
                    <p className="text-gray-500 text-sm mt-1">Curate your library collection.</p>
                </div>
                <button onClick={handleAddClick} className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg flex items-center transition-all shadow-lg hover:shadow-xl group">
                    <Plus size={18} className="mr-2 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-sm">Add New Book</span>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Search title, author..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 outline-none text-sm" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold">
                        <tr>
                            <th className="p-5">Book Details</th>
                            <th className="p-5">Category</th>
                            <th className="p-5">Condition</th>
                            <th className="p-5">Price</th>
                            <th className="p-5">Status</th>
                            <th className="p-5 text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {filteredBooks.map((book) => (
                            <tr key={book.bookId} className="hover:bg-gray-50/80 transition-colors group">
                                <td className="p-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-14 flex-shrink-0 rounded shadow-sm border border-gray-200 bg-gray-100 overflow-hidden">
                                            {/* Image with fallback */}
                                            {book.imagePath ? (
                                                <img
                                                    src={book.imagePath.startsWith('http') ? book.imagePath : `http://localhost:8080/CAT201_project/uploads/${book.imagePath}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => e.target.style.display='none'}
                                                    alt=""
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300"><Package size={20}/></div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm leading-tight">{book.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{book.author}</p>

                                            {/* Robust Genre Display */}
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {(() => {
                                                    if (!book.genres) return null;
                                                    // Handle String (from DB dump) vs Array (from JSON)
                                                    let gList = [];
                                                    if (Array.isArray(book.genres)) gList = book.genres;
                                                    else if (typeof book.genres === 'string') gList = book.genres.replace(/[{"}]/g, '').split(',');

                                                    return gList.filter(g => g && g.trim() !== '').slice(0, 3).map((g, i) => (
                                                        <span key={i} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 rounded border border-gray-200">{g.trim()}</span>
                                                    ));
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-5 text-sm font-medium text-gray-600">{book.category}</td>
                                <td className="p-5 text-sm font-bold text-gray-600">{book.condition}</td>
                                <td className="p-5 font-mono font-bold text-gray-900 text-sm">RM {parseFloat(book.price).toFixed(2)}</td>

                                {/* Status Badge */}
                                <td className="p-5">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                                        book.status === 'Sold' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'
                                    }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${book.status === 'Sold' ? 'bg-red-500' : 'bg-green-500'}`}></span>
                                        {book.status || 'Available'}
                                    </span>
                                </td>

                                <td className="p-5 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEditClick(book)} className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"><Edit size={18}/></button>
                                        <button onClick={() => handleDelete(book.bookId)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-black text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                                {isEditing ? 'Edit Book' : 'Add New Book'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Title</label>
                                    <input name="title" required value={formData.title} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none transition-all" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Author</label>
                                    <input name="author" required value={formData.author} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none transition-all" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none transition-all">
                                        <option value="Fiction">Fiction</option>
                                        <option value="Non-Fiction">Non-Fiction</option>
                                        <option value="Children">Children</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Condition</label>
                                    <select name="condition" value={formData.condition} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none transition-all">
                                        <option value="Brand new">Brand New</option>
                                        <option value="Like new">Like New</option>
                                        <option value="Acceptable">Acceptable</option>
                                        <option value="Old">Old</option>
                                    </select>
                                </div>
                            </div>

                            {/* Status and Price Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price (RM)</label>
                                    <input type="number" name="price" step="0.01" required value={formData.price} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none transition-all" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
                                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none transition-all">
                                        <option value="Available">Available</option>
                                        <option value="Sold">Sold</option>
                                    </select>
                                </div>
                            </div>

                            {/* [UPDATE] Collapsible Genre Section */}
                            <div className="border border-gray-200 rounded-lg p-1 bg-gray-50">
                                <button
                                    type="button"
                                    onClick={() => setShowGenres(!showGenres)}
                                    className="w-full flex justify-between items-center p-2 text-left hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-gray-500 uppercase">Genres</span>
                                        {formData.genres.length > 0 && (
                                            <span className="bg-cyan-100 text-cyan-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                {formData.genres.length} Selected
                                            </span>
                                        )}
                                    </div>
                                    {showGenres ? <ChevronUp size={16} className="text-gray-400"/> : <ChevronDown size={16} className="text-gray-400"/>}
                                </button>

                                {showGenres && (
                                    <div className="p-2 border-t border-gray-200 mt-1 max-h-60 overflow-y-auto bg-white rounded-b-lg">
                                        <div className="flex flex-wrap gap-2">
                                            {genreOptions.map(genre => (
                                                <label key={genre} className={`flex items-center space-x-1 cursor-pointer px-3 py-1 rounded-full border transition-all ${formData.genres.includes(genre) ? 'bg-cyan-50 border-cyan-200 text-cyan-700' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                                                    <input type="checkbox" value={genre} checked={formData.genres.includes(genre)} onChange={handleGenreChange} className="accent-cyan-600 rounded w-3 h-3" />
                                                    <span className="text-xs font-bold">{genre}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all hover:border-cyan-400 relative overflow-hidden group">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-3 text-gray-400 group-hover:text-cyan-500 transition-colors" />
                                        <p className="text-sm text-gray-500">Upload Cover</p>
                                    </div>
                                )}
                                <input type="file" name="image" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>

                            <button type="submit" className="w-full py-3 bg-black text-cyan-400 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-cyan-500/20">
                                {isEditing ? 'Update Book' : 'Add Book'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ManageBooks;