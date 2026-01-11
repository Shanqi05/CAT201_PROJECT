import React, { useState } from 'react';
import { supabase } from '../../utils/supabaseClient'; // [NEW] Import
import { Heart, BookOpen, Users, Gift, CheckCircle, Package, Sparkles, Upload, ChevronDown, ChevronUp } from 'lucide-react';

const DonationPage = () => {
    const [formData, setFormData] = useState({
        donorName: '', donorEmail: '', donorPhone: '',
        bookTitle: '', author: '', bookCondition: 'Like New', category: '',
        houseNo: '', street: '', postcode: '', city: '', state: '', message: '',
        image: null,
        genres: []
    });

    const [previewUrl, setPreviewUrl] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showGenres, setShowGenres] = useState(false);

    // ... [Keep arrays for bookConditions, categories, states, genreOptions] ...
    const bookConditions = ['Brand new', 'Like New', 'Acceptable', 'Old'];
    const categories = ['Fiction', 'Non-Fiction', 'Children & Young Adults', 'Others'];
    const states = ['Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Perak', 'Perlis', 'Pulau Pinang', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu', 'Kuala Lumpur', 'Labuan', 'Putrajaya'];
    const genreOptions = ["Action/Adventure", "Art/Photography", "Biography/Memoir", "Business/Finance", "Children's", "Comics/Graphic Novels", "Cookbooks/Food", "Crime", "Dystopian", "Fantasy", "Fiction", "Health/Fitness", "History", "Historical Fiction", "Horror", "Music", "Mystery", "Non-Fiction", "Politics", "Religion/Spirituality", "Romance", "Science", "Sci-Fi", "Self-Help", "Technology", "Thriller", "Travel", "Young Adult"];

    const validateForm = () => {
        let newErrors = {};
        if (!formData.donorName.trim()) newErrors.donorName = "Full name is required";
        if (!/^\d{3}-\d{7,8}$/.test(formData.donorPhone)) newErrors.donorPhone = "Format: XXX-XXXXXXX";
        if (!formData.bookTitle.trim()) newErrors.bookTitle = "Required";
        if (!formData.category) newErrors.category = "Required";
        if (!formData.houseNo.trim()) newErrors.houseNo = "Required";
        if (!formData.street.trim()) newErrors.street = "Required";
        if (!formData.postcode.trim()) newErrors.postcode = "Required";
        if (!formData.city.trim()) newErrors.city = "Required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'donorPhone') {
            const clean = value.replace(/\D/g, '');
            let masked = clean;
            if (clean.length > 3) masked = `${clean.slice(0, 3)}-${clean.slice(3, 11)}`;
            setFormData(prev => ({ ...prev, [name]: masked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
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
        if (!validateForm()) return;
        setIsSubmitting(true);

        try {
            let uploadedImageUrl = null;

            // 1. Upload to Supabase (Folder: BookCover, since these are books)
            if (formData.image instanceof File) {
                const file = formData.image;
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `BookCover/${fileName}`;

                const { error: uploadError } = await supabase.storage.from('ProductImage').upload(filePath, file);
                if (uploadError) throw uploadError;

                const { data } = supabase.storage.from('ProductImage').getPublicUrl(filePath);
                uploadedImageUrl = data.publicUrl;
            }

            // 2. Prepare Data
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'genres') {
                    formData.genres.forEach(g => data.append('genres', g));
                } else if (key !== 'image') {
                    data.append(key, formData[key]);
                }
            });

            // Pass URL
            if (uploadedImageUrl) {
                data.append('imagePath', uploadedImageUrl);
            }

            const response = await fetch('http://localhost:8080/CAT201_project/addDonatedBook', {
                method: 'POST',
                credentials: 'include',
                body: data
            });

            const result = await response.json();
            if (result.success) {
                setIsSubmitted(true);
                setTimeout(() => {
                    setIsSubmitted(false);
                    setFormData({
                        donorName: '', donorEmail: '', donorPhone: '',
                        bookTitle: '', author: '', bookCondition: 'Like New', category: '',
                        houseNo: '', street: '', postcode: '', city: '', state: '', message: '',
                        image: null, genres: []
                    });
                    setPreviewUrl(null);
                }, 3000);
            } else {
                alert('Failed to submit: ' + result.message);
            }
        } catch (error) { console.error('Error:', error); alert('Submission failed'); } finally { setIsSubmitting(false); }
    };

    const inputClass = (name) => `w-full px-4 py-3 border-2 rounded-xl focus:border-purple-500 outline-none transition-all ${errors[name] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-20">
            {/* Hero */}
            <div className="relative h-[400px] w-full flex items-center justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=2000" className="absolute inset-0 w-full h-full object-cover" alt="Books donation" />
                <div className="absolute inset-0 bg-black/50 z-[1]" />
                <div className="relative z-10 text-center px-6">
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Donate Your Books</h1>
                    <p className="text-white text-lg max-w-2xl mx-auto">Give your pre-loved books a new home.</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-12 -mt-20 relative z-20">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
                        <h2 className="text-2xl font-black">Donation Form</h2>
                        <p className="text-purple-100 text-sm">Please fill in the details below</p>
                    </div>

                    {isSubmitted ? (
                        <div className="p-12 text-center"><div className="inline-block p-4 bg-green-100 rounded-full mb-4"><CheckCircle className="w-16 h-16 text-green-600" /></div><h3 className="text-3xl font-black text-gray-800 mb-2">Thank You!</h3><p className="text-lg text-gray-600">Your donation has been submitted.</p></div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            <div><h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><Users className="w-5 h-5 mr-2 text-purple-600"/> Your Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label><input name="donorName" value={formData.donorName} onChange={handleChange} className={inputClass('donorName')} /></div>
                                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label><input type="email" name="donorEmail" value={formData.donorEmail} onChange={handleChange} className={inputClass('donorEmail')} /></div>
                                    <div className="md:col-span-2"><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label><input name="donorPhone" value={formData.donorPhone} onChange={handleChange} className={inputClass('donorPhone')} placeholder="XXX-XXXXXXX" /></div>
                                </div>
                            </div>
                            <div><h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><Package className="w-5 h-5 mr-2 text-purple-600"/> Pickup Address</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">House No / Taman</label><input name="houseNo" value={formData.houseNo} onChange={handleChange} className={inputClass('houseNo')} /></div>
                                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Street (Jalan)</label><input name="street" value={formData.street} onChange={handleChange} className={inputClass('street')} /></div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Postcode</label><input name="postcode" value={formData.postcode} onChange={handleChange} className={inputClass('postcode')} maxLength="5" /></div>
                                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">City</label><input name="city" value={formData.city} onChange={handleChange} className={inputClass('city')} /></div>
                                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">State</label><select name="state" value={formData.state} onChange={handleChange} className={inputClass('state')}><option value="">Select State</option>{states.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                                </div>
                            </div>
                            <div><h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><BookOpen className="w-5 h-5 mr-2 text-purple-600"/> Book Details</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Book Title</label><input name="bookTitle" value={formData.bookTitle} onChange={handleChange} className={inputClass('bookTitle')} /></div>
                                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Author</label><input name="author" value={formData.author} onChange={handleChange} className={inputClass('author')} /></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Condition</label><select name="bookCondition" value={formData.bookCondition} onChange={handleChange} className={inputClass('bookCondition')}>{bookConditions.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label><select name="category" value={formData.category} onChange={handleChange} className={inputClass('category')}><option value="">Select category</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                                    </div>
                                    <div className="border-2 border-gray-300 rounded-xl p-1 bg-white">
                                        <button type="button" onClick={() => setShowGenres(!showGenres)} className="w-full flex justify-between items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"><div className="flex items-center gap-2"><span className="font-bold text-gray-500 uppercase text-xs">Select Genres</span>{formData.genres.length > 0 && (<span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{formData.genres.length} Selected</span>)}</div>{showGenres ? <ChevronUp size={16} className="text-gray-400"/> : <ChevronDown size={16} className="text-gray-400"/>}</button>
                                        {showGenres && (<div className="p-3 border-t-2 border-gray-100 mt-1 max-h-60 overflow-y-auto bg-gray-50 rounded-b-lg"><div className="flex flex-wrap gap-2">{genreOptions.map(genre => (<label key={genre} className={`flex items-center space-x-1 cursor-pointer px-3 py-1 rounded-full border transition-all ${formData.genres.includes(genre) ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-white border-gray-200 hover:border-gray-300'}`}><input type="checkbox" value={genre} checked={formData.genres.includes(genre)} onChange={handleGenreChange} className="hidden" /><span className="text-xs font-bold">{genre}</span></label>))}</div></div>)}
                                    </div>
                                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Book Photo (Optional)</label><label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all hover:border-purple-400 relative overflow-hidden group">{previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : <div className="text-center"><Upload className="mx-auto text-gray-400 mb-1"/><span className="text-sm text-gray-500">Upload Photo</span></div>}<input type="file" name="image" className="hidden" accept="image/*" onChange={handleFileChange} /></label></div>
                                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Message</label><textarea name="message" value={formData.message} onChange={handleChange} rows="3" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 outline-none resize-none" placeholder="Any details..." /></div>
                                </div>
                            </div>
                            <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black py-4 rounded-xl hover:shadow-2xl transition-all">{isSubmitting ? 'Submitting...' : 'Donate Book'}</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
export default DonationPage;