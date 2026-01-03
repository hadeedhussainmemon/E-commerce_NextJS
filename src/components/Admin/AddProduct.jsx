import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { X, Upload, Plus, Trash2, ArrowLeft, Loader2, Wand2, Check, AlertCircle, Save } from 'lucide-react';
import getImageUrl from '../../utils/imageUrl';
import config from '../../config';
import imageCompression from 'browser-image-compression';
import { triggerPremiumFeedback } from '../../utils/feedback';

const AddProduct = ({ onBack, onSuccess, initialData = null, existingCategories = [] }) => {
    const router = useRouter();
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

    // Category State
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const API_BASE_URL = config.api.baseUrl;
    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
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

            // Handle Categories
            if (Array.isArray(product.category)) {
                setSelectedCategories(product.category);
            } else if (typeof product.category === 'string') {
                setSelectedCategories(product.category.split(',').map(c => c.trim()).filter(Boolean));
            }

            // Handle existing image for preview
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
        setSelectedCategories(prev => {
            if (prev.includes(cat)) {
                return prev.filter(c => c !== cat);
            } else {
                return [...prev, cat];
            }
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Compress Image
            const options = {
                maxSizeMB: 0.5, // Max 500KB
                maxWidthOrHeight: 1200,
                useWebWorker: true,
            };

            try {
                const compressedFile = await imageCompression(file, options);
                setImageFile(compressedFile); // Use compressed file

                // Preview
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(compressedFile);

            } catch (error) {
                console.error("Image compression error:", error);
                setError('Failed to process image');
            }
        }
    };

    const generateMagicDescription = () => {
        if (!formData.title) return;
        const templates = [
            `Elevate your style with the ${formData.title}. Crafted from premium ${formData.material || 'materials'}, this piece embodies modern luxury and exceptional craftsmanship. Perfect for ${selectedCategories[0] || 'any occasion'}.`,
            `Introducing the ${formData.title}: where sophistication meets utility. Features high-quality ${formData.material || 'textures'} and a silhouette designed for the discerning individual. A standout addition to our ${selectedCategories[0] || 'exclusive'} range.`,
            `The ${formData.title} isn't just a product—it's a statement. Expertly made using ${formData.material || 'fine materials'}, it offers unparalleled durability and a sleek, contemporary aesthetic. Uniquely yours.`
        ];
        const random = templates[Math.floor(Math.random() * templates.length)];
        setFormData(prev => ({ ...prev, description: random }));
        triggerPremiumFeedback('success', 'light');
    };

    const product = initialData;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#020617] rounded-[2.5rem] border border-white/5 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative selection:bg-emerald-500/30">
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between p-8 border-b border-white/5 sticky top-0 bg-[#020617]/80 backdrop-blur-xl z-20">
                    <div>
                        <h2 className="text-2xl font-playfair font-black text-white italic tracking-tight">{isEditing ? 'Edit Masterpiece' : 'New Masterpiece'}</h2>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Product Configuration</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 text-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">Hero Image</label>
                                <div className="border border-white/5 bg-white/[0.02] rounded-3xl p-8 text-center hover:bg-white/[0.04] transition-all cursor-pointer relative group border-dashed">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    {imagePreview ? (
                                        <div className="relative aspect-square w-full max-w-[240px] mx-auto rounded-3xl overflow-hidden shadow-2xl">
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Upload size={24} className="text-white mb-2" />
                                                <span className="text-white text-[10px] font-black uppercase tracking-widest">Update</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-12">
                                            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                <Upload className="h-8 w-8 text-emerald-400" />
                                            </div>
                                            <p className="text-white text-sm font-bold">Upload Source</p>
                                            <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mt-2">RAW, PNG, JPG (HQ)</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold placeholder:text-slate-700"
                                    placeholder="e.g. Midnight Chronograph"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        required
                                        min="0"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
                                    <input
                                        type="number"
                                        name="purchasePrice"
                                        min="0"
                                        value={formData.purchasePrice}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        required
                                        min="0"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        placeholder="Qty"
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Classification</label>
                                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 max-h-48 overflow-y-auto space-y-3 mb-3">
                                            {existingCategories.map(cat => (
                                                <div key={cat} className="flex items-center gap-3 group">
                                                    <input
                                                        type="checkbox"
                                                        id={`cat-${cat}`}
                                                        checked={selectedCategories.includes(cat)}
                                                        onChange={() => handleCategoryToggle(cat)}
                                                        className="w-4 h-4 text-emerald-500 bg-slate-900 border-white/10 rounded focus:ring-emerald-500"
                                                    />
                                                    <label htmlFor={`cat-${cat}`} className="text-sm font-bold text-slate-400 group-hover:text-white cursor-pointer select-none transition-colors">
                                                        {cat}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        <input
                                            type="text"
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                            className="w-full px-5 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-sm font-bold text-white focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-700"
                                            placeholder="+ New Category"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="flex items-center justify-between mb-3 px-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                            <button
                                type="button"
                                onClick={generateMagicDescription}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/5 group"
                            >
                                <Wand2 size={12} className="group-hover:rotate-12 transition-transform" />
                                AI Magic Assist
                            </button>
                        </div>
                        <textarea
                            name="description"
                            required
                            rows={6}
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-6 py-5 bg-white/[0.02] border border-white/5 rounded-3xl text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all min-h-[160px] resize-y font-medium text-lg leading-relaxed placeholder:text-slate-700"
                            placeholder="Craft a compelling story about this masterpiece..."
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                            <input
                                type="text"
                                name="material"
                                value={formData.material}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                placeholder="e.g. Leather, Steel"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Colors (comma separated)</label>
                            <input
                                type="text"
                                name="colors"
                                value={formData.colors}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                placeholder="e.g. Red, Blue, Black"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isCustomizable"
                            name="isCustomizable"
                            checked={formData.isCustomizable}
                            onChange={handleChange}
                            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                        />
                        <label htmlFor="isCustomizable" className="text-sm font-medium text-gray-700">This product is customizable</label>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isVisible"
                            name="isVisible"
                            checked={formData.isVisible}
                            onChange={handleChange}
                            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                        />
                        <label htmlFor="isVisible" className="text-sm font-medium text-gray-700">Visible on Website</label>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    {isEditing ? 'Saving...' : 'Adding...'}
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    {isEditing ? 'Save Changes' : 'Add Product'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProduct;
