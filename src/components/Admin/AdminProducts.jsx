import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Filter, Download, Eye, EyeOff, Edit2, Trash2, Package, Plus } from 'lucide-react';
import getImageUrl from '../../utils/imageUrl';
import AdminCoupons from './AdminCoupons';
import config from '../../config';
import AddProduct from './AddProduct';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const itemsPerPage = 10;

  // API Base URL
  const API_BASE_URL = config.api.baseUrl;

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const apiUrl = API_BASE_URL ? `${API_BASE_URL} /api/products ? pageSize = 1000 & showHidden=true` : '/api/products?pageSize=1000&showHidden=true';
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} `);
      }
      const data = await response.json();
      const productList = Array.isArray(data) ? data : data.products || [];
      setProducts(productList);

      // Extract unique categories
      const allCategories = new Set();
      productList.forEach(p => {
        if (Array.isArray(p.category)) {
          p.category.forEach(cat => allCategories.add(cat));
        } else if (typeof p.category === 'string') {
          allCategories.add(p.category);
        }
      });
      setCategories(Array.from(allCategories).filter(Boolean).sort());
    } catch (error) {
      console.error('Error fetching products:', error);
      // alert('Failed to load products. Please ensure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [API_BASE_URL]);

  // Filter products based on search and category
  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(query) ||
        p.id?.toString().includes(query)
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(p =>
        (Array.isArray(p.category) && p.category.includes(selectedCategory)) ||
        p.category === selectedCategory
      );
    }

    // Price filter
    if (minPrice) {
      filtered = filtered.filter(p => (p.price || 0) >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(p => (p.price || 0) <= Number(maxPrice));
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, minPrice, maxPrice, products]);

  // Reset pagination only when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, minPrice, maxPrice]);

  // Calculate profit
  const calculateProfit = (product) => {
    const sellingPrice = product.price || 0;
    const purchasePrice = product.purchasePrice || 0;
    return sellingPrice - purchasePrice;
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Product ID', 'Product Name', 'Purchase Price', 'Selling Price', 'Profit', 'Category', 'Stock'];
    const rows = filteredProducts.map(p => [
      p.id,
      p.title,
      p.purchasePrice || 0,
      p.price || 0,
      calculateProfit(p),
      (Array.isArray(p.category) ? p.category.join('; ') : p.category),
      p.stock || 0
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${String(cell).replace(/" /g, '""')}"`).join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    window.URL.revokeObjectURL(url);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsAddModalOpen(true);
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.title}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/products/${product.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete product');
      }

      // Refresh list
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const handleToggleVisibility = async (product) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/products/${product.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isVisible: !product.isVisible })
      });

      if (!response.ok) throw new Error('Failed to update visibility');

      // Optimistic update or refetch
      const updated = await response.json();
      setProducts(prev => prev.map(p => p.id === product.id ? updated : p));
    } catch (error) {
      console.error('Error toggling visibility:', error);
      alert('Failed to update visibility');
    }
  };

  const handleProductAdded = (newProduct) => {
    // Optionally insert directly to avoid refetch, but refetching ensures consistency
    fetchProducts();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-playfair font-black text-white italic tracking-tight mb-2">Inventory Hub</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
              <Package size={16} className="text-emerald-400" />
              Resource Management & Control
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsAddModalOpen(true);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-[#020617] rounded-2xl hover:bg-emerald-50 transition-all text-sm font-black uppercase tracking-widest shadow-lg hover:shadow-emerald-500/10 hover:scale-[1.02] active:scale-95"
            >
              <Plus size={20} className="text-emerald-600" />
              <span>Add Source</span>
            </button>
            <button
              onClick={exportToCSV}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl hover:bg-emerald-500/20 transition-all text-sm font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95"
            >
              <Download size={20} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {/* Filters */}
      <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 p-8 shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
              <Search size={14} className="text-emerald-400" />
              Signal Search
            </label>
            <input
              type="text"
              placeholder="Search by title, ID, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3.5 bg-white/[0.02] border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-700 font-bold"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
              <Filter size={14} className="text-emerald-400" />
              Sector
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-5 py-3.5 bg-white/[0.02] border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold appearance-none cursor-pointer"
            >
              <option value="" className="bg-slate-900 text-white">All Sectors</option>
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-slate-900 text-white">{cat}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-2">Min</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/[0.02] border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-800 font-bold"
                placeholder="Min"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-2">Max</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/[0.02] border border-white/5 rounded-2xl text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-800 font-bold"
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        {/* Results info */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Visualizing <strong className="text-emerald-400">{paginatedProducts.length}</strong> of <strong className="text-white">{filteredProducts.length}</strong> Entities
          </span>
          {(selectedCategory || searchQuery || minPrice || maxPrice) && (
            <button
              onClick={() => {
                setSelectedCategory('');
                setSearchQuery('');
                setMinPrice('');
                setMaxPrice('');
              }}
              className="text-rose-400 hover:text-rose-300 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-all"
            >
              <span>✕ Clear All Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        {isLoading ? (
          <div className="p-20 text-center">
            <div className="inline-flex items-center justify-center relative">
              <div className="absolute inset-x-0 h-px bg-white/5 w-64"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500/10 border-t-emerald-500 z-10 shadow-[0_0_20px_rgba(16,185,129,0.2)]"></div>
            </div>
            <p className="mt-10 text-xl font-playfair font-black text-white italic tracking-tight">Syncing Inventory...</p>
            <p className="mt-2 text-[10px] text-slate-500 font-black uppercase tracking-widest italic">Fetching neural nodes</p>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="p-20 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Package size={44} className="text-slate-700" />
              </div>
              <p className="text-2xl font-black text-white italic mb-3">No Records Found</p>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Adjust filters to reveal inventory signals</p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/[0.02] border-b border-white/5">
                  <tr>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest px-8">Media</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Specifications</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">In Stock</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Net Value</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Market Value</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest px-8">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedProducts.map((product) => {
                    const profit = calculateProfit(product);
                    const isLowStock = product.stock < 10;
                    const isSoldOut = product.stock === 0;

                    return (
                      <tr key={product.id} className="hover:bg-white/[0.03] transition-colors group">
                        {/* Picture */}
                        <td className="px-8 py-6">
                          <div className="w-20 h-20 rounded-3xl overflow-hidden bg-slate-800 border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                            {product.image ? (
                              <div className="relative w-full h-full">
                                <Image
                                  src={getImageUrl(product.image)}
                                  alt={product.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <Package size={24} className="text-slate-600" />
                            )}
                          </div>
                        </td>

                        {/* Product Name */}
                        <td className="px-8 py-6">
                          <div className="max-w-xs">
                            <div className="flex items-center gap-3 mb-1">
                              <p className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors line-clamp-1">{product.title}</p>
                              {product.isVisible === false && (
                                <span className="bg-slate-800 text-slate-500 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border border-white/5">Stealth</span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 font-bold font-mono">ID: {product.id.slice(-8).toUpperCase()}</p>
                          </div>
                        </td>

                        {/* Stock */}
                        <td className="px-8 py-6 text-center">
                          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${isSoldOut
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : isLowStock
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}>
                            {product.stock || 0}
                          </span>
                        </td>

                        {/* Purchase Price */}
                        <td className="px-8 py-6">
                          <span className="text-sm font-bold text-slate-400">
                            Rs. {(product.purchasePrice || 0).toLocaleString()}
                          </span>
                        </td>

                        {/* Selling Price */}
                        <td className="px-8 py-6">
                          <div>
                            <p className="text-sm font-black text-white mb-1">Rs. {(product.price || 0).toLocaleString()}</p>
                            <div className={`text-[10px] font-bold ${profit > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {profit > 0 ? '+' : ''} Rs. {profit.toLocaleString()}
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-8 py-6 px-8">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              title={product.isVisible ? "Stealth Mode" : "Reveal Mode"}
                              onClick={() => handleToggleVisibility(product)}
                              className={`p-2.5 rounded-xl transition-all border ${product.isVisible ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-slate-500 bg-slate-800 border-white/5'}`}
                            >
                              {product.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                            <button
                              title="Edit Protocol"
                              onClick={() => handleEditProduct(product)}
                              className="p-2.5 text-white bg-slate-800 hover:bg-white hover:text-[#020617] rounded-xl border border-white/5 transition-all"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              title="Terminate Entry"
                              onClick={() => handleDeleteProduct(product)}
                              className="p-2.5 text-rose-400 bg-rose-500/5 hover:bg-rose-500 hover:text-white rounded-xl border border-rose-500/10 transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-4 bg-black/40">
              {paginatedProducts.map((product) => {
                const profit = calculateProfit(product);
                const isLowStock = product.stock < 10;
                const isSoldOut = product.stock === 0;

                return (
                  <div key={product.id} className="bg-slate-900/60 backdrop-blur-xl rounded-[2rem] border border-white/5 overflow-hidden shadow-xl group">
                    <div className="p-6">
                      <div className="flex gap-4">
                        {/* Picture */}
                        <div className="w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden bg-white/[0.02] border border-white/5 shadow-inner flex items-center justify-center">
                          {product.image ? (
                            <Image
                              src={getImageUrl(product.image, { width: 100, crop: 'fill' })}
                              alt={product.title}
                              width={100}
                              height={100}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <Package size={24} className="text-slate-700" />
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-white text-sm leading-tight line-clamp-2 mb-2 italic tracking-tight uppercase">{product.title}</h3>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3">ID: {product.id.slice(-8).toUpperCase()}</p>

                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${isSoldOut
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              : isLowStock
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                              }`}>
                              {product.stock || 0} In Field
                            </span>
                            {product.isVisible === false && (
                              <span className="bg-slate-800 text-slate-500 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border border-white/5">Stealth</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Price Section */}
                      <div className="mt-6 pt-6 border-t border-white/5">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Source</p>
                            <p className="font-bold text-xs text-slate-400 italic">Rs. {(product.purchasePrice || 0).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Export</p>
                            <p className="font-black text-xs text-white">Rs. {(product.price || 0).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${profit > 0 ? 'text-emerald-500' : profit < 0 ? 'text-rose-500' : 'text-slate-500'}`}>Yield</p>
                            <p className={`font-black text-xs ${profit > 0 ? 'text-emerald-400 shadow-emerald-500/20' : profit < 0 ? 'text-rose-400' : 'text-white'}`}>
                              {profit > 0 ? '+' : ''}Rs. {profit.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between gap-3">
                        <button
                          title={product.isVisible ? "Stealth Mode" : "Reveal Mode"}
                          onClick={() => handleToggleVisibility(product)}
                          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${product.isVisible ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-slate-500 bg-slate-800 border-white/5'}`}
                        >
                          {product.isVisible ? <><Eye size={16} /> Online</> : <><EyeOff size={16} /> Stealth</>}
                        </button>
                        <button
                          title="Edit Protocol"
                          onClick={() => handleEditProduct(product)}
                          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white/[0.05] text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                        >
                          <Edit2 size={16} />
                          Forge
                        </button>
                        <button
                          title="Terminate Entry"
                          onClick={() => handleDeleteProduct(product)}
                          className="w-12 h-12 flex items-center justify-center text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-2xl transition-all active:scale-95"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-8 py-6 border-t border-white/5 bg-slate-900/50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-full sm:w-auto px-8 py-3.5 bg-white/[0.02] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-white/[0.05] disabled:opacity-20 transition-all active:scale-95"
                  >
                    ← Temporal Shift Back
                  </button>

                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Node Segment <strong className="text-white bg-white/5 px-2 py-1 rounded-md ml-2">{currentPage}</strong> <span className="mx-2 text-slate-700">|</span> Total <strong className="text-white">{totalPages}</strong>
                    </span>
                  </div>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-full sm:w-auto px-8 py-3.5 bg-white/[0.02] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-white/[0.05] disabled:opacity-20 transition-all active:scale-95"
                  >
                    Forward Trajectory →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {
        isAddModalOpen && (
          <AddProduct
            onClose={() => {
              setIsAddModalOpen(false);
              setEditingProduct(null);
            }}
            onProductAdded={handleProductAdded}
            product={editingProduct}
            existingCategories={categories}
          />
        )
      }
    </div>
  );
}

export default AdminProducts;
