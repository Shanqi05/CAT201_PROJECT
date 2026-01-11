import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient'; // [NEW] Import
import { Plus, Edit, Trash2, Search, Filter, X, Upload, ShoppingBag, Package } from 'lucide-react';

const ManageAccessories = () => {
    const [accessories, setAccessories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        title: '', category: 'Bookmark', price: '', stock: 10, image: null
    });

    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        fetchAccessories();
    }, []);

    const fetchAccessories = async () => {
        try {
            const response = await fetch('http://localhost:8080/CAT201_project/getAccessories', { method: 'GET' });
            if (response.ok) {
                const data = await response.json();
                setAccessories(data);
            }
        } catch (error) { console.error("Error fetching accessories:", error); }
    };

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

    const handleEditClick = (item) => {
        setIsEditing(true);
        setEditId(item.accessoryId);
        setFormData({
            title: item.title,
            category: item.category,
            price: item.price,
            stock: item.stock,
            image: null
        });

        if (item.imagePath) {
            // Check if it's a Supabase URL or local
            const imgUrl = item.imagePath.startsWith('http')
                ? item.imagePath
                : `http://localhost:8080/CAT201_project/uploads/${encodeURIComponent(item.imagePath)}`;
            setPreviewUrl(imgUrl);
        } else {
            setPreviewUrl(null);
        }
        setShowModal(true);
    };

    const handleAddClick = () => {
        setIsEditing(false);
        setEditId(null);
        setFormData({ title: '', category: 'Bookmark', price: '', stock: 10, image: null });
        setPreviewUrl(null);
        setShowModal(true);
    };

    // [UPDATED] Submit Handler with Supabase Upload
    const handleSubmit = async (e) => {
        e.preventDefault();

        let uploadedImageUrl = null;

        // 1. Upload to Supabase if a NEW file is selected
        if (formData.image instanceof File) {
            try {
                const file = formData.image;
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

                // Upload to 'Accessories' folder
                const filePath = `Accessories/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('ProductImage')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from('ProductImage')
                    .getPublicUrl(filePath);

                uploadedImageUrl = data.publicUrl;

            } catch (error) {
                console.error("Upload error:", error);
                alert("Image upload failed: " + error.message);
                return;
            }
        }

        // 2. Prepare Data
        const data = new FormData();
        data.append('title', formData.title);
        data.append('category', formData.category);
        data.append('price', formData.price);
        data.append('stock', formData.stock);

        // [IMPORTANT] Send URL string
        if (uploadedImageUrl) {
            data.append('imagePath', uploadedImageUrl);
        }

        const endpoint = isEditing
            ? 'http://localhost:8080/CAT201_project/updateAccessory'
            : 'http://localhost:8080/CAT201_project/addAccessory';

        if (isEditing) data.append('id', editId);

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                credentials: 'include',
                body: data,
            });

            if (response.ok) {
                alert(isEditing ? "Accessory updated!" : "Accessory added!");
                setShowModal(false);
                fetchAccessories();
                setFormData({ title: '', category: 'Bookmark', price: '', stock: 10, image: null });
                setPreviewUrl(null);
            } else {
                alert("Operation failed. Server error.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error connecting to server.");
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Remove item?")) {
            try {
                const response = await fetch(`http://localhost:8080/CAT201_project/deleteAccessory?id=${id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                if (response.ok) {
                    setAccessories(accessories.filter(item => item.accessoryId !== id));
                    alert("Item deleted!");
                }
            } catch (error) { console.error(error); }
        }
    };

    const filteredItems = accessories.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto w-full relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Manage Accessories
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Curate your collection.</p>
                </div>
                <button onClick={handleAddClick} className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg flex items-center transition-all shadow-lg hover:shadow-xl group">
                    <Plus size={18} className="mr-2 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-sm">Add Accessory</span>
                </button>
            </div>

            {/* ... Search Bar ... */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Search accessories..." className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 outline-none text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                            <th className="p-5">Product Details</th>
                            <th className="p-5">Category</th>
                            <th className="p-5">Price</th>
                            <th className="p-5">Stock</th>
                            <th className="p-5">Status</th>
                            <th className="p-5 text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {filteredItems.map((item) => (
                            <tr key={item.accessoryId} className="hover:bg-gray-50/80 transition-colors group">
                                <td className="p-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-16 flex-shrink-0 rounded-md overflow-hidden shadow-sm border border-gray-200 bg-gray-100 flex items-center justify-center relative">
                                            {item.imagePath ? (
                                                <img
                                                    // Handle both Supabase URL and legacy local paths
                                                    src={item.imagePath.startsWith('http') || item.imagePath.startsWith('blob')
                                                        ? item.imagePath
                                                        : `http://localhost:8080/CAT201_project/uploads/${encodeURIComponent(item.imagePath)}`}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='block'}}
                                                />
                                            ) : null}
                                            <ShoppingBag className="text-gray-300 absolute" size={24} style={{display: item.imagePath ? 'none' : 'block'}} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 leading-tight">{item.title}</p>
                                            <p className="text-xs text-gray-500 mt-1 font-medium">ID: #{item.accessoryId}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-5"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">{item.category}</span></td>
                                <td className="p-5 font-mono font-bold text-gray-900 text-sm">RM {parseFloat(item.price).toFixed(2)}</td>
                                <td className="p-5 font-mono text-sm text-gray-600">{item.stock}</td>
                                <td className="p-5">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${item.stock > 0 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${item.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            {item.stock > 0 ? 'Active' : 'Sold Out'}
                                        </span>
                                </td>
                                <td className="p-5 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEditClick(item)} className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"><Edit size={18}/></button>
                                        <button onClick={() => handleDelete(item.accessoryId)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18}/></button>
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
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-black text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                                {isEditing ? 'Edit Accessory' : 'Add Accessory'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Name</label>
                                <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none transition-all" placeholder="e.g., Metal Bookmark" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none transition-all appearance-none">
                                        <option value="Stickers">Stickers</option>
                                        <option value="Bookmark">Bookmark</option>
                                        <option value="Book Stand">Book Stand</option>
                                        <option value="Bag">Bag</option>
                                        <option value="Stationery">Stationery</option>
                                        <option value="Light">Reading Light</option>
                                        <option value="Other">Others</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price (RM)</label>
                                    <input type="number" name="price" step="0.01" required value={formData.price} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none transition-all" placeholder="0.00" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                    <Package size={12} /> Stock Quantity
                                </label>
                                <input type="number" name="stock" required min="0" value={formData.stock} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none transition-all" placeholder="10" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Image {isEditing && "(Optional)"}</label>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all hover:border-cyan-400 relative overflow-hidden group">
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-3 text-gray-400 group-hover:text-cyan-500 transition-colors" />
                                                <p className="text-sm text-gray-500">Upload Image</p>
                                            </div>
                                        )}
                                        <input type="file" name="image" className="hidden" accept="image/*" onChange={handleFileChange} required={!isEditing} />
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-black text-cyan-400 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-cyan-500/20">{isEditing ? 'Update Item' : 'Add Item'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAccessories;