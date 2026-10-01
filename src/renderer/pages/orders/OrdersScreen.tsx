import React, { useState } from 'react';
import { useApp, Order } from '../../context/AppContext';
import { ShoppingCart, Search, Printer, CheckCircle2, Clock, Filter, Utensils } from 'lucide-react';
import { PaymentModal } from '../pos/PaymentModal';

export const OrdersScreen: React.FC = () => {
  const { orders, restaurantProfile, printReceipt } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<Order | null>(null);

  const filteredOrders = orders.filter(o => {
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.tableNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
            Order Lifecycle & KOT 🛒
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Active & Past Orders
          </h1>
          <p className="text-xs text-slate-500 font-medium">Real-time status tracking, receipt reprints, settle bills and kitchen coordination</p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto w-full sm:w-auto">
          {['all', 'new', 'preparing', 'ready', 'completed'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order # or table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map(order => (
          <div
            key={order.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900">{order.orderNumber}</h3>
                  <span className="text-xs font-bold text-orange-600">
                    {order.tableNumber === 'Takeaway' ? '🥡 Takeaway' : `Table ${order.tableNumber}`}
                  </span>
                </div>

                <div className="text-right">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      order.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : order.status === 'ready'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : order.status === 'preparing'
                        ? 'bg-orange-50 text-orange-700 border border-orange-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-medium mt-0.5">{order.createdAt}</span>
                </div>
              </div>

              {/* Items */}
              <div className="py-3 space-y-1.5 text-xs text-slate-700">
                {order.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between font-medium">
                    <span>{i.name} x{i.quantity}</span>
                    <span className="font-bold">{restaurantProfile.currencySymbol}{i.price * i.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Grand Total</span>
                <span className="text-base font-black text-slate-900">
                  {restaurantProfile.currencySymbol}{order.total}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => printReceipt(order)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  title="Print Thermal Receipt"
                >
                  <Printer className="w-4 h-4" />
                </button>

                {order.paymentStatus === 'pending' && (
                  <button
                    onClick={() => setSelectedOrderForPayment(order)}
                    className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Settle Bill
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedOrderForPayment && (
        <PaymentModal
          order={selectedOrderForPayment}
          onClose={() => setSelectedOrderForPayment(null)}
          onPaymentSuccess={() => setSelectedOrderForPayment(null)}
        />
      )}
    </div>
  );
};
