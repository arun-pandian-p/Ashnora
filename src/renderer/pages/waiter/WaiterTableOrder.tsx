import React, { useState } from 'react';
import { useApp, TableInfo, MenuItem, OrderItem } from '../../context/AppContext';
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  ChefHat,
  Save,
  CreditCard,
  CheckCircle2,
  Utensils,
  Search
} from 'lucide-react';

interface WaiterTableOrderProps {
  table: TableInfo;
  onBack: () => void;
}

export const WaiterTableOrder: React.FC<WaiterTableOrderProps> = ({ table, onBack }) => {
  const { menuItems, restaurantProfile, createOrder, setActiveTab, orders } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [guestCount, setGuestCount] = useState(table.currentGuests || table.capacity);

  // Initialize cart with existing order items if table already occupied
  const existingOrder = orders.find(o => o.id === table.activeOrderId);
  const [cart, setCart] = useState<OrderItem[]>(
    existingOrder
      ? existingOrder.items
      : [
          { menuItemId: 'm-1', name: 'Chicken Biryani', price: 340, quantity: 2 },
          { menuItemId: 'm-8', name: 'Cold Coffee', price: 130, quantity: 2 }
        ]
  );
  const [isSent, setIsSent] = useState(false);

  const categories = ['All', 'Starters', 'Main Course', 'Breads', 'Drinks', 'Desserts'];

  const filteredItems = menuItems.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch && item.isAvailable;
  });

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItemId === item.id);
      if (existing) {
        return prev.map(i => (i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(i => {
          if (i.menuItemId === itemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * (restaurantProfile.taxRate / 100));
  const total = subtotal + tax;

  const handleSendToKitchen = () => {
    if (cart.length === 0) return;

    createOrder({
      tableNumber: table.number,
      orderType: 'dine_in',
      guestCount,
      items: cart,
      subtotal,
      tax,
      total,
      status: 'new'
    });

    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      onBack();
    }, 1200);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row select-none bg-slate-100 overflow-hidden">
      {/* Left Menu Selection (Section 25 ASCII) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden p-4 md:p-6 space-y-4">
        {/* Top bar */}
        <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-orange-500" />
            <span>← Tables</span>
          </button>

          <div className="text-center">
            <h2 className="text-base font-black text-slate-900">TABLE {table.number}</h2>
            <span className="text-xs font-semibold text-slate-500">{guestCount} Guests • {table.floor}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500">Guests:</span>
            <input
              type="number"
              min={1}
              max={20}
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="w-12 px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold text-center bg-slate-50"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 pb-6">
            {filteredItems.map(item => (
              <div
                key={item.id}
                onClick={() => addToCart(item)}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-orange-300 p-3 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="relative w-full h-28 rounded-xl overflow-hidden mb-2 bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLElement).src = '/food/chicken-biryani.jpg';
                      }}
                    />
                    <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                      {restaurantProfile.currencySymbol}{item.price}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">{item.name}</h4>
                  <p className="text-[10px] text-slate-400 capitalize">{item.category}</p>
                </div>

                <button
                  type="button"
                  className="mt-3 w-full py-1.5 rounded-lg bg-emerald-50 group-hover:bg-emerald-500 text-emerald-700 group-hover:text-white text-xs font-extrabold flex items-center justify-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>[ + ADD ]</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Table Order Ticket (Section 25 ASCII) */}
      <div className="w-full lg:w-96 bg-white border-l border-slate-200 flex flex-col h-full shadow-lg flex-shrink-0">
        <div className="p-4 border-b border-slate-100">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
            Waiter Tableside Ticket
          </span>
          <h3 className="text-sm font-black text-slate-900">
            Table {table.number} • {guestCount} Guests
          </h3>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
          {cart.map(item => (
            <div key={item.menuItemId} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex-1 pr-2">
                <p className="font-bold text-slate-900">{item.name}</p>
                <p className="text-[11px] text-slate-500">{restaurantProfile.currencySymbol}{item.price} each</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <button
                    onClick={() => updateQuantity(item.menuItemId, -1)}
                    className="p-1 hover:bg-slate-200 text-slate-600"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-2 text-xs font-bold text-slate-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.menuItemId, 1)}
                    className="p-1 hover:bg-slate-200 text-slate-600"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <span className="w-14 text-right font-black text-slate-900">
                  {restaurantProfile.currencySymbol}{item.price * item.quantity}
                </span>
              </div>
            </div>
          ))}

          {cart.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <p className="text-xs">No items added to this table yet.</p>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-3">
          <div className="space-y-1 text-xs text-slate-600 font-medium">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-bold text-slate-800">{restaurantProfile.currencySymbol}{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax ({restaurantProfile.taxRate}%):</span>
              <span className="font-bold text-slate-800">{restaurantProfile.currencySymbol}{tax}</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-1 border-t border-slate-200">
              <span>Total:</span>
              <span className="text-orange-600">{restaurantProfile.currencySymbol}{total}</span>
            </div>
          </div>

          {isSent ? (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Sent to Kitchen KDS!</span>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={handleSendToKitchen}
                disabled={cart.length === 0}
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <ChefHat className="w-4 h-4" />
                <span>[ SEND TO KITCHEN ]</span>
              </button>

              <button
                onClick={onBack}
                className="w-full py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
              >
                [ SAVE ORDER ]
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
