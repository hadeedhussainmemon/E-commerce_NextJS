import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { X, Upload, Plus, Trash2, ArrowLeft, Loader2, Wand2, Check, AlertCircle, Save } from 'lucide-react';
import getImageUrl from '../../utils/imageUrl';
import config from '../../config';
import imageCompression from 'browser-image-compression';
import { triggerPremiumFeedback } from '../../utils/feedback';

const AddProduct = ({ onClose, onProductAdded, product = null, existingCategories = [] }) => {
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        purchasePrice: '0',
        description: '',
        material: '',
        stock: '',
        isCustomizable: false,
        isVisible: true,
        colors: ''
    });

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const isEditing = !!product;

    useEffect(() => {
        if (product) {
            setFormData({
                title: product.title || '',
                price: product.price || '',
                purchasePrice: product.purchasePrice || '0',
                description: product.description || '',
                material: product.material || '',
                stock: product.stock || '',
                isCustomizable: product.isCustomizable || false,
                isVisible: product.isVisible !== undefined ? product.isVisible : true,
                colors: Array.isArray(product.colors) ? product.colors.join(', ') : (product.colors || '')
            });

            if (Array.isArray(product.category)) {
                setSelectedCategories(product.category);
            } else if (typeof product.category === 'string') {
                setSelectedCategories(product.category.split(',').map(c => c.trim()).filter(Boolean));
            }

            if (product.image) {
                setImagePreview(getImageUrl(product.image));
            }
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCategoryToggle = (cat) => {
        setSelectedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1200, useWebWorker: true };
            try {
                const compressedFile = await imageCompression(file, options);
                setImageFile(compressedFile);
                const reader = new FileReader();
                reader.onloadend = () => setImagePreview(reader.result);
                reader.readAsDataURL(compressedFile);
            } catch (err) {
                setError('Signal processing failed');
            }
        }
    };

    const generateMagicDescription = () => {
        if (!formData.title) return;
        const templates = [
            `Exuding effortless grace, the ${formData.title} is an essential addition to the modern wardrobe. Crafted from premium ${formData.material || 'fabrics'}, this piece features a silhouette that celebrates minimalist form. An exclusive selection for the Petal + Pup collection.`,
            `A masterpiece of artisanal craftsmanship, the ${formData.title} balances structural integrity with ethereal flow. Utilizing high-density ${formData.material || 'textiles'}, it is designed for the discerning observer who values both substance and style.`,
            `The ${formData.title} resides at the intersection of contemporary design and timeless elegance. Forged from elite ${formData.material || 'components'}, it provides a tactile experience that is truly refined. A quintessential piece for your personal curate.`
        ];
        const random = templates[Math.floor(Math.random() * templates.length)];
        setFormData(prev => ({ ...prev, description: random }));
        triggerPremiumFeedback('success', 'dark');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const finalFormData = new FormData();
            const categoriesToSubmit = [...selectedCategories];
            if (newCategory.trim()) categoriesToSubmit.push(newCategory.trim());

            Object.keys(formData).forEach(key => finalFormData.append(key, formData[key]));
            finalFormData.append('category', JSON.stringify(categoriesToSubmit));
            if (imageFile) finalFormData.append('image', imageFile);

            const url = isEditing
                ? `${config.api.baseUrl}/products/${product.id}`
                : `${config.api.baseUrl}/products`;

            const method = isEditing ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                body: finalFormData,
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
            });

            if (!response.ok) throw new Error('Transmission interrupted');

            triggerPremiumFeedback('success', 'dark');
            onProductAdded();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden relative flex flex-col">
                {/* Tactical Accent */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between px-10 py-8 border-b border-white/5 bg-white/[0.02] relative z-10">
                    <div>
                        <h2 className="text-3xl font-fashion-serif font-black text-white italic tracking-tighter">{isEditing ? 'Refine Piece' : 'Curate New Piece'}</h2>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mt-1">Collection Management</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all transform hover:rotate-90"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar relative z-10">
                    {error && (
                        <div className="p-5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-3xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest animate-pulse">
                            <AlertCircle size={18} />
                            Critical Error: {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Visual Source (Image Upload) */}
                        <div className="lg:col-span-4 space-y-6">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 ml-2">Visual Source</label>
                            <div className="relative group aspect-square rounded-[2rem] overflow-hidden bg-black/40 border-2 border-dashed border-white/10 flex flex-col items-center justify-center transition-all hover:border-emerald-500/40 hover:bg-emerald-500/5">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                {imagePreview ? (
                                    <div className="relative w-full h-full">
                                        <Image src={imagePreview} alt="Target" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                                            <Upload size={32} className="text-emerald-400 mb-2" />
                                            <span className="text-white text-[10px] font-black uppercase tracking-widest">Update Stream</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center p-8">
                                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10 group-hover:scale-110 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 transition-all duration-500">
                                            <Upload className="h-6 w-6 text-emerald-500" />
                                        </div>
                                        <p className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Upload RAW Signal</p>
                                        <p className="text-slate-600 text-[8px] font-black uppercase tracking-widest mt-2 px-4">HQ PNG, JPG (Max 5MB)</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Core Parameters */}
                        <div className="lg:col-span-8 space-y-8">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Entity Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-slate-800 text-lg"
                                    placeholder="DESIGNATE ASSET NAME..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Export Velocity (Rs)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        required
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:border-emerald-500/50 outline-none transition-all"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Network Yield (Rs)</label>
                                    <input
                                        type="number"
                                        name="purchasePrice"
                                        value={formData.purchasePrice}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:border-emerald-500/50 outline-none transition-all"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Inventory Depth</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        required
                                        value={formData.stock}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:border-emerald-500/50 outline-none transition-all"
                                        placeholder="UNITS"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Classification Cluster</label>
                                    <div className="relative">
                                        <select
                                            multiple
                                            value={selectedCategories}
                                            onChange={(e) => setSelectedCategories(Array.from(e.target.selectedOptions, option => option.value))}
                                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] focus:border-emerald-500/50 outline-none transition-all h-32 custom-scrollbar appearance-none"
                                        >
                                            {existingCategories.map(cat => (
                                                <option key={cat} value={cat} className="bg-slate-900 py-2 px-4 hover:bg-emerald-500/20 cursor-pointer">{cat}</option>
                                            ))}
                                        </select>
                                        <div className="absolute bottom-4 right-4 text-[8px] font-black text-slate-600 uppercase tracking-widest pointer-events-none">Hold CMD/CTRL to multi-select</div>
                                    </div>
                                    <input
                                        type="text"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        className="w-full mt-3 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 focus:border-emerald-500/50 outline-none placeholder:text-slate-700"
                                        placeholder="+ INITIALIZE NEW CLUSTER"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Neural Narrative */}
                    <div className="relative group">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Neural Narrative</label>
                            <button
                                type="button"
                                onClick={generateMagicDescription}
                                className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-5 py-2.5 rounded-full border border-emerald-500/20 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-95 group"
                            >
                                <Wand2 size={14} className="group-hover:rotate-45 transition-transform duration-500" />
                                Initiate Magic Protocol
                            </button>
                        </div>
                        <textarea
                            name="description"
                            required
                            rows={6}
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-8 py-8 bg-white/5 border border-white/10 rounded-[2rem] text-white font-medium text-lg leading-relaxed focus:border-emerald-500/50 outline-none transition-all min-h-[200px] resize-none placeholder:text-slate-800"
                            placeholder="TRANSMIT ASSET SPECIFICATIONS..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 ml-4">Structural Analysis</label>
                            <div className="p-8 bg-black/20 border border-white/5 rounded-[2rem] space-y-6">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="isCustomizable" className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer">Dynamic Customization</label>
                                    <div className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            id="isCustomizable"
                                            name="isCustomizable"
                                            checked={formData.isCustomizable}
                                            onChange={handleChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-12 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 shadow-inner"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="isVisible" className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer">Network Visibility</label>
                                    <div className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            id="isVisible"
                                            name="isVisible"
                                            checked={formData.isVisible}
                                            onChange={handleChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-12 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 shadow-inner"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Material Composition</label>
                                <input
                                    type="text"
                                    name="material"
                                    value={formData.material}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-800"
                                    placeholder="DESIGNATE COMPOSITION..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2">Chroma Variants</label>
                                <input
                                    type="text"
                                    name="colors"
                                    value={formData.colors}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-800"
                                    placeholder="COMMA DELIMITED..."
                                />
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer Controls */}
                <div className="px-10 py-8 bg-black/40 border-t border-white/5 flex items-center justify-between relative z-10">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all"
                    >
                        [ Abort ]
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="group relative px-10 py-4 bg-emerald-600 text-white rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <span className="relative z-10 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em]">
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Synchronizing...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    {isEditing ? 'COMMIT CHANGES' : 'DEPLOY ASSET'}
                                </>
                            )}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
