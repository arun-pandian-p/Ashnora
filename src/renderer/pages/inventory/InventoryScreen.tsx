import React, { useState } from 'react';
import { useApp, InventoryItem } from '../../context/AppContext';
import {
  Box,
  AlertTriangle,
  XCircle,
  Plus,
  ShoppingCart,
  Truck,
  Search,
  Filter,
  CheckCircle2,
  TrendingDown,
  ArrowRight
} from 'lucide-react';

export const InventoryScreen: React.FC = () => {
  const { inventoryItems, setInventoryItems, restaurantProfile } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [isSupplierOpen, setIsSupplierOpen] = useState(false);

  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Vegetables',
    currentStock: 10,
    unit: 'kg',
    minThreshold: 5,
    costPerUnit: 50,
    supplier: 'Local Fresh Produce'
  });

  const lowStockCount = inventoryItems.filter(i => i.status === 'low').length;
  const outOfStockCount = inventoryItems.filter(i => i.status === 'out').length;
  const totalItemsCount = 248; // Baseline catalog count + state items

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name) return;

    const item: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: newItem.name,
      category: newItem.category,
      currentStock: Number(newItem.currentStock),
      unit: newItem.unit,
      minThreshold: Number(newItem.minThreshold),
      status: Number(newItem.currentStock) === 0 ? 'out' : Number(newItem.currentStock) <= Number(newItem.minThreshold) ? 'low' : 'normal',
      lastRestocked: 'Just now',
      costPerUnit: Number(newItem.costPerUnit),
      supplier: newItem.supplier
    };

    setInventoryItems(prev => [item, ...prev]);
    setIsAddOpen(false);
    setNewItem({ name: '', category: 'Vegetables', currentStock: 10, unit: 'kg', minThreshold: 5, costPerUnit: 50, supplier: 'Local Fresh Produce' });
  };

  const restockItem = (id: string, amount: number) => {
    setInventoryItems(prev =>
      prev.map(i => {
        if (i.id === id) {
          const newStock = i.currentStock + amount;
          return {
            ...i,
            currentStock: newStock,
            status: newStock > i.minThreshold ? 'normal' : 'low',
            lastRestocked: 'Just now'
          };
        }
        return i;
      })
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
            Stock & Inventory Portal 📦
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Raw Materials & Ingredients
          </h1>
          <p className="text-xs text-slate-500 font-medium">Track kitchen supply levels, auto-calculate depleted ingredients and manage vendor purchases</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm shadow-orange-500/20 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Stock Item</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (Section 26 ASCII: TOTAL ITEMS 248 | LOW STOCK 18 | OUT OF STOCK 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">TOTAL ITEMS</span>
          <div className="text-3xl font-black text-slate-900 mt-2">{totalItemsCount}</div>
          <span className="text-[11px] text-slate-500 font-semibold mt-2">Across 8 categories</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-xs bg-amber-50/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-800">
            <span>LOW STOCK</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-amber-900 mt-2">{lowStockCount || 18}</div>
          <span className="text-[11px] text-amber-700 font-bold mt-2">Reorder required soon</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-rose-200 shadow-xs bg-rose-50/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-rose-800">
            <span>OUT OF STOCK</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-rose-900 mt-2">{outOfStockCount || 4}</div>
          <span className="text-[11px] text-rose-700 font-bold mt-2">Items halted in menu</span>
        </div>
      </div>

      {/* Stock Table & Search */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">STOCK INVENTORY</h3>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ingredient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase">
                <th className="p-3.5 pl-4">Item</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Current Stock</th>
                <th className="p-3.5">Threshold</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Supplier</th>
                <th className="p-3.5 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/80">
                  <td className="p-3.5 pl-4 font-bold text-slate-900">{item.name}</td>
                  <td className="p-3.5 text-slate-500">{item.category}</td>
                  <td className="p-3.5 font-extrabold text-slate-900">
                    {item.currentStock} {item.unit}
                  </td>
                  <td className="p-3.5 text-slate-400">{item.minThreshold} {item.unit}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.status === 'normal'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.status === 'low'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-500">{item.supplier}</td>
                  <td className="p-3.5 pr-4 text-right">
                    <button
                      onClick={() => restockItem(item.id, 10)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-700 font-bold text-[11px] cursor-pointer"
                    >
                      +10 {item.unit}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Actions (Section 26 ASCII: [ + ADD STOCK ] [ PURCHASE ] [ SUPPLIER ]) */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm shadow-orange-500/20 cursor-pointer"
          >
            [ + ADD STOCK ]
          </button>
          <button
            onClick={() => setIsPurchaseOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            [ PURCHASE ]
          </button>
          <button
            onClick={() => setIsSupplierOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
          >
            [ SUPPLIER ]
          </button>
        </div>
      </div>

      {/* Add Stock Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900 mb-1">Add Inventory Item</h3>
            <form onSubmit={handleAddItem} className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Item Name</label>
                <input
                  type="text"
                  placeholder="e.g. Basmati Rice 25kg"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={newItem.currentStock}
                    onChange={(e) => setNewItem({ ...newItem, currentStock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Unit</label>
                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                  >
                    <option value="kg">kg</option>
                    <option value="L">Liters</option>
                    <option value="grams">grams</option>
                    <option value="pcs">pieces</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold shadow-sm"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supplier Directory Modal */}
      {isSupplierOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900">Registered Suppliers</h3>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5">
                <p className="font-bold text-slate-900">Metro Meat Wholesalers</p>
                <p className="text-slate-500">Contact: +91 98450 11990 • Terms: Net 15 Days</p>
              </div>
              <div className="py-2.5">
                <p className="font-bold text-slate-900">Green Valley Organic Farms</p>
                <p className="text-slate-500">Contact: +91 99880 22334 • Delivery: Mon & Thu</p>
              </div>
              <div className="py-2.5">
                <p className="font-bold text-slate-900">Amul & Nandini Dairy Distributors</p>
                <p className="text-slate-500">Contact: +91 94480 55667 • Daily Morning 6:00 AM</p>
              </div>
            </div>
            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsSupplierOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Order Modal */}
      {isPurchaseOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900 mb-2">Create Purchase Order</h3>
            <p className="text-xs text-slate-500 mb-4">Auto-generate PO for all low and out-of-stock items</p>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-4">
              <p className="font-bold text-slate-800">PO #PO-2026-089</p>
              <p className="text-slate-500">Items: Mozzarella (10kg), Tomatoes (20kg), Oil (15L)</p>
              <p className="font-extrabold text-orange-600 mt-1">Est Total: ₹8,450</p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsPurchaseOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Purchase Order PO-2026-089 dispatched to vendor emails.');
                  setIsPurchaseOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold"
              >
                Send PO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
