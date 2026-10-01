import React, { useState } from 'react';
import { useApp, Customer } from '../../context/AppContext';
import { UserCheck, Search, Phone, Mail, Heart, Award, Plus, DollarSign, Calendar } from 'lucide-react';

export const CustomersScreen: React.FC = () => {
  const { customers, setCustomers, restaurantProfile } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCust, setNewCust] = useState({ name: '', phone: '', email: '', favoriteDish: '', notes: '' });

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCust.name || !newCust.phone) return;

    const cust: Customer = {
      id: `cust-${Date.now()}`,
      name: newCust.name,
      phone: newCust.phone,
      email: newCust.email,
      totalVisits: 1,
      totalSpend: 0,
      lastVisit: 'Today',
      favoriteDish: newCust.favoriteDish || 'Biryani',
      notes: newCust.notes
    };

    setCustomers(prev => [cust, ...prev]);
    setIsAddOpen(false);
    setNewCust({ name: '', phone: '', email: '', favoriteDish: '', notes: '' });
  };

  return (
    <div className="p-6 md:p-8 space-y-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            Guest CRM & Loyalty Directory 👤
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Customer Profiles & History
          </h1>
          <p className="text-xs text-slate-500 font-medium">Guest dining records, lifetime spend, dietary allergies and loyalty preferences</p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm shadow-orange-500/20 flex items-center gap-2 cursor-pointer transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Customer</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by customer name or mobile number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-2xs"
        />
      </div>

      {/* Customer Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCustomers.map(cust => (
          <div
            key={cust.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">{cust.name}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{cust.phone}</p>
                </div>
                <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                  <Award className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Visits</span>
                  <span className="font-black text-slate-900">{cust.totalVisits} times</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Lifetime Spend</span>
                  <span className="font-black text-emerald-600">₹{cust.totalSpend.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-3 text-xs space-y-1 text-slate-600">
                <div className="flex items-center gap-1.5 font-medium">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>Favorite: <strong>{cust.favoriteDish}</strong></span>
                </div>
                {cust.notes && (
                  <p className="text-[11px] text-purple-700 font-semibold bg-purple-50 p-2 rounded-xl border border-purple-100 mt-2">
                    {cust.notes}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span>Last visited: {cust.lastVisit}</span>
              <span className="font-bold text-orange-600">VIP Profile</span>
            </div>
          </div>
        ))}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900 mb-1">Add Customer Record</h3>
            <form onSubmit={handleAdd} className="space-y-3 mt-4">
              <input
                type="text"
                placeholder="Full Name"
                value={newCust.name}
                onChange={(e) => setNewCust({ ...newCust, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                required
              />
              <input
                type="text"
                placeholder="Mobile Phone"
                value={newCust.phone}
                onChange={(e) => setNewCust({ ...newCust, phone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                required
              />
              <input
                type="text"
                placeholder="Favorite Dish"
                value={newCust.favoriteDish}
                onChange={(e) => setNewCust({ ...newCust, favoriteDish: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              />
              <textarea
                rows={2}
                placeholder="Guest preferences, allergies, VIP notes..."
                value={newCust.notes}
                onChange={(e) => setNewCust({ ...newCust, notes: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              />
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
