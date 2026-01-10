import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, X, Upload } from 'lucide-react';

const ManageBooks = () => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '', author: '', category: 'Fiction', price: '', condition: 'Brand new', image: null, genres: []
    });
    const [previewUrl, setPreviewUrl] = useState(null);

    // Genre Options
    const genreOptions = ["Fiction", "Non-Fiction", "Mystery", "Sci-Fi", "Romance", "Horror", "Self-Help", "Business", "Children"];

    const fetchBooks = async () => {
        try {
            const response = await fetch('http://localhost:8080/CAT201_project/getBooks');
            if (response.ok) {
                const data = await response.json();
                console.log("Books loaded:", data);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('author', formData.author);
        data.append('category', formData.category);
        data.append('price', formData.price);
        data.append('condition', formData.condition);

        formData.genres.forEach(g => data.append('genres', g));
        if (formData.image) data.append('image', formData.image);

        try {
            const response = await fetch('http://localhost:8080/CAT201_project/addBook', {
                method: 'POST',
                credentials: 'include',
                body: data,
            });

            if (response.ok) {
                alert("Book added successfully!");
                setShowModal(false);
                fetchBooks(); // Reload list
                setFormData({ title: '', author: '', category: 'Fiction', condition: 'Brand new', price: '', image: null, genres: [] });
                setPreviewUrl(null);
            } else {
                alert("Failed to upload book. Server error.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Delete this book?")) {
            try {
                // [CHANGE] URL uses 'id' parameter, but we pass book.bookId to it
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
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Manage Inventory</h1>
                <button onClick={() => setShowModal(true)} className="bg-black text-white px-6 py-2.5 rounded-lg flex items-center font-bold shadow-lg">
                    <Plus size={18} className="mr-2" /> Add New Book
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Search title, author..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-11 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold">
                    <tr>
                        <th className="p-5">Book Details</th>
                        <th className="p-5">Category</th>
                        <th className="p-5">Genres</th>
                        <th className="p-5">Condition</th>
                        <th className="p-5">Price</th>
                        <th className="p-5 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                    {filteredBooks.map((book) => (
                        // [CHANGE] Use book.bookId
                        <tr key={book.bookId} className="hover:bg-gray-50/80">
                            <td className="p-5">
                                <div className="flex items-center gap-4">
                                    <img src={`http://localhost:8080/CAT201_project/uploads/${book.imagePath}`} className="w-10 h-14 object-cover rounded shadow-sm" onError={(e) => e.target.src="https://via.placeholder.com/150"} />
                                    <div>
                                        <p className="font-bold text-gray-900">{book.title}</p>
                                        <p className="text-xs text-gray-500">{book.author}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-5 text-sm">{book.category}</td>
                            <td className="p-5 text-xs text-gray-500">{book.genres ? book.genres.join(", ") : "-"}</td>
                            <td className="p-5 text-sm font-bold text-gray-600">{book.condition}</td>
                            <td className="p-5 font-bold">RM {book.price.toFixed(2)}</td>
                            <td className="p-5 text-right">
                                {/* [CHANGE] Pass book.bookId */}
                                <button onClick={() => handleDelete(book.bookId)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-black">Add New Book</h2>
                            <button onClick={() => setShowModal(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input name="title" required placeholder="Title" value={formData.title} onChange={handleInputChange} className="border p-2 rounded w-full" />
                                <input name="author" required placeholder="Author" value={formData.author} onChange={handleInputChange} className="border p-2 rounded w-full" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <select name="category" value={formData.category} onChange={handleInputChange} className="border p-2 rounded w-full">
                                    <option value="Fiction">Fiction</option>
                                    <option value="Non-Fiction">Non-Fiction</option>
                                    <option value="Children">Children</option>
                                    <option value="Others">Others</option>
                                </select>
                                <select name="condition" value={formData.condition} onChange={handleInputChange} className="border p-2 rounded w-full">
                                    <option value="Brand new">Brand New</option>
                                    <option value="Like new">Like New</option>
                                    <option value="Acceptable">Acceptable</option>
                                    <option value="Old">Old</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Genres</label>
                                <div className="flex flex-wrap gap-2">
                                    {genreOptions.map(genre => (
                                        <label key={genre} className="flex items-center space-x-1 cursor-pointer bg-gray-50 px-3 py-1 rounded-full border">
                                            <input type="checkbox" value={genre} checked={formData.genres.includes(genre)} onChange={handleGenreChange} className="rounded text-cyan-600" />
                                            <span className="text-sm">{genre}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <input type="number" name="price" step="0.01" required placeholder="Price" value={formData.price} onChange={handleInputChange} className="border p-2 rounded w-full" />
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                                {previewUrl ? <img src={previewUrl} className="h-full object-contain" /> : <span className="text-gray-500">Click to upload cover</span>}
                                <input type="file" name="image" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                            <button type="submit" className="w-full py-3 bg-black text-white rounded-xl font-bold">Upload Book</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ManageBooks;