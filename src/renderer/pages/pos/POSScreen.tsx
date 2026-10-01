import React, { useState } from 'react';
import { useApp, MenuItem, Order, OrderItem } from '../../context/AppContext';
import { getDishImage } from '../../assets/images';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  CreditCard,
  DollarSign,
  QrCode,
  Tag,
  Clock,
  CheckCircle2,
  Utensils,
  PauseCircle,
  Barcode
} from 'lucide-react';
import { PaymentModal } from './PaymentModal';

export const POSScreen: React.FC = () => {
  const { menuItems, restaurantProfile, createOrder, tables, printReceipt } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTable, setCurrentTable] = useState('12');
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway' | 'delivery'>('dine_in');
  const [cart, setCart] = useState<OrderItem[]>([
    { menuItemId: 'm-1', name: 'Chicken Biryani', price: 340, quantity: 2 },
    { menuItemId: 'm-8', name: 'Cold Coffee', price: 130, quantity: 2 },
    { menuItemId: 'm-7', name: 'Garlic Bread', price: 150, quantity: 1 }
  ]);
  const [discount, setDiscount] = useState(0);
  const [activePaymentOrder, setActivePaymentOrder] = useState<Order | null>(null);

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

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.menuItemId !== itemId));
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * (restaurantProfile.taxRate / 100));
  const total = Math.max(0, subtotal + tax - discount);

  const handleCheckout = (preferredMethod?: 'cash' | 'card' | 'upi') => {
    if (cart.length === 0) return;

    const newOrder = createOrder({
      tableNumber: orderType === 'dine_in' ? currentTable : 'Takeaway',
      orderType,
      items: cart,
      subtotal,
      tax,
      discount,
      total,
      paymentMethod: preferredMethod
    });

    setActivePaymentOrder(newOrder);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-hidden select-none bg-slate-100">
      {/* Left / Center Product Catalog & Search (Section 21 ASCII) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden p-4 md:p-6 space-y-4">
        {/* Search Bar & Order Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search product (or scan barcode)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setOrderType('dine_in')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                orderType === 'dine_in' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Dine In
            </button>
            <button
              onClick={() => setOrderType('takeaway')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                orderType === 'takeaway' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Takeaway
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
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

        {/* Products Grid */}
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
                      src={getDishImage(item.name || item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                  className="mt-3 w-full py-1.5 rounded-lg bg-orange-50 group-hover:bg-orange-500 text-orange-700 group-hover:text-white text-xs font-extrabold flex items-center justify-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ ADD</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Current Order Ticket (Section 21 ASCII) */}
      <div className="w-full lg:w-96 bg-white border-l border-slate-200 flex flex-col h-full shadow-lg flex-shrink-0">
        {/* Ticket Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600">Current Order</span>
            <h3 className="text-sm font-black text-slate-900">
              {orderType === 'dine_in' ? `Table ${currentTable} • Dine In` : 'Takeaway Counter Order'}
            </h3>
          </div>

          {orderType === 'dine_in' && (
            <select
              value={currentTable}
              onChange={(e) => setCurrentTable(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold bg-slate-50 text-slate-800"
            >
              {tables.map(t => (
                <option key={t.id} value={t.number}>Table {t.number}</option>
              ))}
            </select>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
          {cart.map(item => (
            <div key={item.menuItemId} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex-1 pr-2">
                <p className="font-bold text-slate-900 leading-snug">{item.name}</p>
                <p className="text-[11px] text-slate-500">{restaurantProfile.currencySymbol}{item.price} each</p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <button
                    onClick={() => updateQuantity(item.menuItemId, -1)}
                    className="p-1 hover:bg-slate-200 text-slate-600 cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-2 text-xs font-bold text-slate-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.menuItemId, 1)}
                    className="p-1 hover:bg-slate-200 text-slate-600 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <span className="w-14 text-right font-black text-slate-900">
                  {restaurantProfile.currencySymbol}{item.price * item.quantity}
                </span>

                <button
                  onClick={() => removeFromCart(item.menuItemId)}
                  className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {cart.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <Utensils className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs font-medium">Cart is empty. Select items to add.</p>
            </div>
          )}
        </div>

        {/* Bill Summary & Payment Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-3">
          <div className="space-y-1.5 text-xs text-slate-600 font-medium">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-bold text-slate-800">{restaurantProfile.currencySymbol}{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>GST ({restaurantProfile.taxRate}%):</span>
              <span className="font-bold text-slate-800">{restaurantProfile.currencySymbol}{tax}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount:</span>
                <span>-{restaurantProfile.currencySymbol}{discount}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Total:</span>
              <span className="text-orange-600">{restaurantProfile.currencySymbol}{total}</span>
            </div>
          </div>

          {/* Quick Pay Buttons [ CASH ] [ CARD ] [ UPI ] */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => handleCheckout('cash')}
              disabled={cart.length === 0}
              className="py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center gap-1 shadow-2xs cursor-pointer disabled:opacity-40"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>CASH</span>
            </button>
            <button
              onClick={() => handleCheckout('card')}
              disabled={cart.length === 0}
              className="py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center gap-1 shadow-2xs cursor-pointer disabled:opacity-40"
            >
              <CreditCard className="w-3.5 h-3.5 text-blue-600" />
              <span>CARD</span>
            </button>
            <button
              onClick={() => handleCheckout('upi')}
              disabled={cart.length === 0}
              className="py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center gap-1 shadow-2xs cursor-pointer disabled:opacity-40"
            >
              <QrCode className="w-3.5 h-3.5 text-purple-600" />
              <span>UPI</span>
            </button>
          </div>

          {/* Primary Action */}
          <button
            onClick={() => handleCheckout()}
            disabled={cart.length === 0}
            className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>COMPLETE PAYMENT</span>
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {activePaymentOrder && (
        <PaymentModal
          order={activePaymentOrder}
          onClose={() => setActivePaymentOrder(null)}
          onPaymentSuccess={() => {
            setActivePaymentOrder(null);
            clearCart();
          }}
        />
      )}
    </div>
  );
};
