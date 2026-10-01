import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  ShoppingCart,
  LayoutGrid,
  Users,
  Layers,
  CreditCard,
  Printer,
  ChevronRight,
  TrendingUp,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  Sliders,
  Calendar,
  Utensils
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { restaurantProfile, setActiveTab, orders, tables, menuItems, users } = useApp();

  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 48520);

  const completedOrders = orders.length;
  const occupiedTables = tables.filter(t => t.status === 'occupied').length;
  const totalTables = tables.length;

  const quickLinks = [
    { id: 'admin_users', title: 'Users & Roles', desc: 'Manage staff accounts, roles & permission toggles', icon: <Users className="w-5 h-5 text-purple-600" />, tab: 'admin_settings' },
    { id: 'admin_menu', title: 'Menu & Products', desc: 'Add dishes, update prices, categories & stock status', icon: <Layers className="w-5 h-5 text-orange-600" />, tab: 'admin_menu' },
    { id: 'admin_payments', title: 'Payments & Gateway', desc: 'Configure Cash, Card, UPI QR & billing rules', icon: <CreditCard className="w-5 h-5 text-blue-600" />, tab: 'admin_settings' },
    { id: 'admin_printers', title: 'Printers & Hardware', desc: 'Thermal receipts, Kitchen KOT, Cash drawers & serial ports', icon: <Printer className="w-5 h-5 text-emerald-600" />, tab: 'admin_settings' }
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 select-none">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              Admin & Owner Console 👑
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Welcome, Administrator
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage your restaurant profile, live floor operations, menu items, taxes and native hardware.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('pos')}
            className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm shadow-orange-500/20 flex items-center gap-2 cursor-pointer transition-all"
          >
            <CreditCard className="w-4 h-4" />
            <span>Open POS Counter</span>
          </button>
          <button
            onClick={() => setActiveTab('admin_settings')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer transition-all"
          >
            <Sliders className="w-4 h-4" />
            <span>Settings Hub</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (Exact from ASCII layout: Revenue ₹48,520 | Orders 86 | Tables 18/24) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            ₹{totalRevenue.toLocaleString()}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.8% vs yesterday</span>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Daily Orders</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            86
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Avg ticket time: 14 mins</span>
          </div>
        </div>

        {/* Table Occupancy Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Table Occupancy</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <LayoutGrid className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            18 / 24
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-orange-600 font-semibold">
            <span>75% Capacity In Use</span>
          </div>
        </div>
      </div>

      {/* Quick Management Section (Exact from Section 05 ASCII) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
            Quick Management
          </h2>
          <span className="text-xs text-slate-400 font-medium">Core Restaurant Configuration</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickLinks.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.tab)}
              className="p-4 rounded-2xl bg-slate-50/80 hover:bg-orange-50/60 border border-slate-200/80 hover:border-orange-200 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-white shadow-2xs border border-slate-200/60 group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </div>

      {/* Live Floor & Recent Activity Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Table summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Live Tables Snapshot</h3>
            <button
              onClick={() => setActiveTab('tables')}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Floor Plan</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {tables.slice(0, 6).map((tbl) => (
              <div
                key={tbl.id}
                onClick={() => setActiveTab('tables')}
                className={`p-3 rounded-2xl text-center border cursor-pointer transition-all ${
                  tbl.status === 'occupied'
                    ? 'bg-orange-50 border-orange-200 text-orange-950'
                    : tbl.status === 'reserved'
                    ? 'bg-purple-50 border-purple-200 text-purple-950'
                    : tbl.status === 'bill_requested'
                    ? 'bg-blue-50 border-blue-200 text-blue-950'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                }`}
              >
                <div className="text-xs font-extrabold">T-{tbl.number}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-80">
                  {tbl.status === 'occupied' ? `${tbl.currentGuests} Guests` : tbl.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff on Duty */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Staff Active</h3>
            <button
              onClick={() => setActiveTab('staff')}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
            >
              Manage
            </button>
          </div>
          <div className="space-y-3">
            {users.slice(0, 4).map((u) => (
              <div key={u.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-[10px]">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{u.name}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{u.role}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
