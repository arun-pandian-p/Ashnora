import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, TrendingUp, DollarSign, ShoppingCart, Users, ArrowUpRight, PieChart } from 'lucide-react';

export const AnalyticsScreen: React.FC = () => {
  const { restaurantProfile } = useApp();

  const hourlySales = [
    { hour: '12 PM', amount: 4800 },
    { hour: '1 PM', amount: 9200 },
    { hour: '2 PM', amount: 8400 },
    { hour: '3 PM', amount: 3100 },
    { hour: '7 PM', amount: 11500 },
    { hour: '8 PM', amount: 14800 },
    { hour: '9 PM', amount: 12600 },
    { hour: '10 PM', amount: 6400 }
  ];

  const topDishes = [
    { name: 'Chicken Biryani', count: 48, revenue: 16320, pct: '34%' },
    { name: 'Butter Chicken', count: 32, revenue: 10240, pct: '21%' },
    { name: 'Paneer Butter Masala', count: 24, revenue: 6720, pct: '14%' },
    { name: 'Chicken 65', count: 22, revenue: 5720, pct: '12%' },
    { name: 'Cold Coffee', count: 36, revenue: 4680, pct: '10%' }
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 select-none">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
          Executive Analytics 📊
        </span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
          Revenue & Sales Analytics
        </h1>
        <p className="text-xs text-slate-500 font-medium">Daily trends, average order value, popular menu items and hourly revenue distribution</p>
      </div>

      {/* KPI Cards (Section 30 ASCII) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold uppercase text-slate-400">Total Day Revenue</span>
          <div className="text-2xl font-black text-slate-900 mt-2">₹70,800</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">+18.2% vs last Thursday</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold uppercase text-slate-400">Total Orders Placed</span>
          <div className="text-2xl font-black text-slate-900 mt-2">124</div>
          <div className="text-[11px] text-blue-600 font-bold mt-1">88 Dine In • 36 Takeaway</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold uppercase text-slate-400">Average Order Value (AOV)</span>
          <div className="text-2xl font-black text-slate-900 mt-2">₹570.96</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">+5.4% increase</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold uppercase text-slate-400">Table Turnover Time</span>
          <div className="text-2xl font-black text-slate-900 mt-2">42 mins</div>
          <div className="text-[11px] text-orange-600 font-bold mt-1">Optimal dining pace</div>
        </div>
      </div>

      {/* Hourly Sales Bar Chart Simulator */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
          Hourly Sales Velocity (Today)
        </h3>

        <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-200">
          {hourlySales.map(slot => {
            const heightPct = (slot.amount / 15000) * 100;
            return (
              <div key={slot.hour} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  ₹{slot.amount}
                </div>
                <div
                  style={{ height: `${heightPct}%` }}
                  className="w-full bg-orange-500 group-hover:bg-orange-600 rounded-t-xl transition-all shadow-2xs"
                />
                <span className="text-[10px] font-bold text-slate-600 mt-1">{slot.hour}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top 5 Products Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
          Top Selling Dishes
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase">
                <th className="p-3.5 pl-6">Dish Name</th>
                <th className="p-3.5">Units Sold</th>
                <th className="p-3.5">Total Revenue</th>
                <th className="p-3.5 pr-6 text-right">Revenue Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {topDishes.map(dish => (
                <tr key={dish.name} className="hover:bg-slate-50">
                  <td className="p-3.5 pl-6 font-bold text-slate-900">{dish.name}</td>
                  <td className="p-3.5 font-bold text-slate-800">{dish.count} orders</td>
                  <td className="p-3.5 font-black text-slate-900">₹{dish.revenue.toLocaleString()}</td>
                  <td className="p-3.5 pr-6 text-right">
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 font-extrabold text-[10px]">
                      {dish.pct}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
