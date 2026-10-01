import React from 'react';
import { useApp } from '../../context/AppContext';
import { DollarSign, ShoppingCart, LayoutGrid, Clock, Users, ArrowUpRight, TrendingUp, ChefHat, Calendar } from 'lucide-react';

export const ManagerDashboard: React.FC = () => {
  const { setActiveTab, orders, tables, reservations } = useApp();

  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 38400);

  const activeKitchenOrders = orders.filter(o => o.status === 'new' || o.status === 'preparing');
  const occupiedTables = tables.filter(t => t.status === 'occupied').length;

  return (
    <div className="p-6 md:p-8 space-y-6 select-none">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
            Manager Operations 👤
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Today's Operational Summary
          </h1>
          <p className="text-xs text-slate-500 font-medium">Real-time floor oversight, kitchen velocity, table occupancy and guest reservations</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('tables')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            Floor Plan
          </button>
          <button
            onClick={() => setActiveTab('kds')}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            Kitchen KDS
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Today's Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">₹{totalRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Target 88% Achieved</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Live Kitchen Orders</span>
            <ChefHat className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{activeKitchenOrders.length}</div>
          <div className="text-[11px] text-orange-600 font-bold mt-1">Avg prep: 11 mins</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Table Occupancy</span>
            <LayoutGrid className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{occupiedTables} / {tables.length}</div>
          <div className="text-[11px] text-blue-600 font-bold mt-1">Floor 1 & 2 Active</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Reservations</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{reservations.length} Bookings</div>
          <div className="text-[11px] text-purple-600 font-bold mt-1">Next: 7:30 PM (T-05)</div>
        </div>
      </div>

      {/* Recent Orders & Table Live Status (Section 20 requirement) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders List */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Recent Orders</h3>
            <button
              onClick={() => setActiveTab('orders')}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {orders.slice(0, 5).map(ord => (
              <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>{ord.orderNumber}</span>
                    <span className="text-slate-400">• Table {ord.tableNumber}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {ord.items.map(i => `${i.name} (${i.quantity})`).join(', ')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-slate-900">₹{ord.total}</span>
                  <span className={`block text-[10px] font-bold uppercase mt-0.5 ${
                    ord.status === 'completed' ? 'text-emerald-600' : 'text-orange-600'
                  }`}>
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Table Status */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Live Table Status</h3>
            <button
              onClick={() => setActiveTab('tables')}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
            >
              Manage Seating
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            {tables.map(tbl => (
              <div
                key={tbl.id}
                className={`p-3 rounded-xl text-center border ${
                  tbl.status === 'occupied'
                    ? 'bg-orange-50 border-orange-200 text-orange-900'
                    : tbl.status === 'reserved'
                    ? 'bg-purple-50 border-purple-200 text-purple-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}
              >
                <div className="font-extrabold text-xs">T-{tbl.number}</div>
                <div className="text-[9px] font-bold uppercase mt-0.5">{tbl.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
