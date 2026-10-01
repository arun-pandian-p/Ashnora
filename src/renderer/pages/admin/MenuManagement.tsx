import React, { useState } from 'react';
import { useApp, MenuItem } from '../../context/AppContext';
import { getDishImage, AVAILABLE_FOOD_PRESETS } from '../../assets/images';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  X,
  Check,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';

export const MenuManagement: React.FC = () => {
  const { menuItems, setMenuItems, restaurantProfile, addAuditLog } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const categories = ['All', 'Starters', 'Main Course', 'Breads', 'Drinks', 'Desserts'];

  // New Item State
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'Starters' | 'Main Course' | 'Breads' | 'Drinks' | 'Desserts'>('Main Course');
  const [newItemPrice, setNewItemPrice] = useState<number>(250);
  const [newItemPrepTime, setNewItemPrepTime] = useState<number>(10);
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemImage, setNewItemImage] = useState(AVAILABLE_FOOD_PRESETS[0].image);

  const filteredItems = menuItems.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleAvailability = (itemId: string) => {
    setMenuItems(prev =>
      prev.map(i => {
        if (i.id === itemId) {
          const nextVal = !i.isAvailable;
          addAuditLog('Menu Item Status', `${i.name} marked ${nextVal ? 'IN STOCK' : 'OUT OF STOCK'}`);
          return { ...i, isAvailable: nextVal };
        }
        return i;
      })
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemPrice) return;

    const item: MenuItem = {
      id: `m-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      price: Number(newItemPrice),
      image: newItemImage || getDishImage(newItemName),
      isAvailable: true,
      preparationTime: Number(newItemPrepTime) || 10,
      description: newItemDesc.trim() || 'Freshly prepared specialty dish.'
    };

    setMenuItems(prev => [item, ...prev]);
    addAuditLog('Product Added', `Added ${item.name} (${item.category}) for ${restaurantProfile.currencySymbol}${item.price}`);
    setIsAddModalOpen(false);
    setNewItemName('');
    setNewItemPrice(250);
    setNewItemDesc('');
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name.trim()) return;

    setMenuItems(prev =>
      prev.map(i => (i.id === editingItem.id ? editingItem : i))
    );
    addAuditLog('Product Updated', `Updated product details for ${editingItem.name}`);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name} from the menu?`)) {
      setMenuItems(prev => prev.filter(i => i.id !== itemId));
      addAuditLog('Product Deleted', `Removed ${name} from catalog.`);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 select-none space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-[#0B1F3A] tracking-tight">Menu & Products Catalog</h2>
          <p className="text-xs text-slate-500 font-medium">Configure dishes, modifiers, prices, categories and kitchen prep times</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Product</span>
          </button>
        </div>
      </div>

      {/* Main split layout: Categories on Left, Products on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Categories Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
            Categories
          </div>
          {categories.map((cat) => {
            const count = cat === 'All' ? menuItems.length : menuItems.filter(i => i.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B1F3A] text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Products Grid */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200/80 bg-slate-50 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          {/* Product Cards Grid with Realistic Food Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3 bg-slate-100">
                    <img
                      src={getDishImage(item.name || item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-md bg-white/95 backdrop-blur-xs text-slate-800 text-[10px] font-extrabold shadow-2xs">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-sm font-bold text-[#0B1F3A] leading-snug">{item.name}</h4>
                    <span className="text-sm font-extrabold text-[#F97316]">
                      {restaurantProfile.currencySymbol}{item.price}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {item.description || 'Freshly prepared specialty dish.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                        item.isAvailable
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                    </button>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />
                      {item.preparationTime}m
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="Edit Product"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id, item.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#0B1F3A] mb-1">Add Menu Product</h3>
            <p className="text-xs text-slate-500 mb-5 font-medium">Add a culinary dish to local catalog and cloud ordering</p>

            <form onSubmit={handleAddItem} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-500 uppercase tracking-wider mb-1">Dish Name</label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Mutton Dum Biryani"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Starters">Starters</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Breads">Breads</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 uppercase tracking-wider mb-1">Price ({restaurantProfile.currencySymbol})</label>
                  <input
                    type="number"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 uppercase tracking-wider mb-1">Select Realistic Photo Preset</label>
                <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                  {AVAILABLE_FOOD_PRESETS.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => setNewItemImage(preset.image)}
                      className={`relative rounded-lg overflow-hidden h-14 cursor-pointer border-2 transition-all ${
                        newItemImage === preset.image ? 'border-[#F97316] scale-95 shadow-xs' : 'border-transparent hover:opacity-80'
                      }`}
                    >
                      <img src={preset.image} alt={preset.name} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] truncate px-1 text-center">{preset.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-500 uppercase tracking-wider mb-1">Preparation Time (minutes)</label>
                <input
                  type="number"
                  value={newItemPrepTime}
                  onChange={(e) => setNewItemPrepTime(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="Ingredients and culinary notes..."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#F97316] hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-500/20"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingItem(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#0B1F3A] mb-1">Edit Menu Product</h3>
            <p className="text-xs text-slate-500 mb-5 font-medium">Update pricing, kitchen prep time, photo, or stock status</p>

            <form onSubmit={handleUpdateItem} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-500 uppercase tracking-wider mb-1">Dish Name</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Starters">Starters</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Breads">Breads</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 uppercase tracking-wider mb-1">Price ({restaurantProfile.currencySymbol})</label>
                  <input
                    type="number"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 uppercase tracking-wider mb-1">Choose Photo Preset</label>
                <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                  {AVAILABLE_FOOD_PRESETS.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => setEditingItem({ ...editingItem, image: preset.image })}
                      className={`relative rounded-lg overflow-hidden h-14 cursor-pointer border-2 transition-all ${
                        editingItem.image === preset.image ? 'border-[#F97316] scale-95 shadow-xs' : 'border-transparent hover:opacity-80'
                      }`}
                    >
                      <img src={preset.image} alt={preset.name} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] truncate px-1 text-center">{preset.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 uppercase tracking-wider mb-1">Prep Time (mins)</label>
                  <input
                    type="number"
                    value={editingItem.preparationTime}
                    onChange={(e) => setEditingItem({ ...editingItem, preparationTime: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 uppercase tracking-wider mb-1">Stock Status</label>
                  <select
                    value={editingItem.isAvailable ? 'true' : 'false'}
                    onChange={(e) => setEditingItem({ ...editingItem, isAvailable: e.target.value === 'true' })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="true">In Stock ✅</option>
                    <option value="false">Out of Stock ❌</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#F97316] hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-500/20"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
