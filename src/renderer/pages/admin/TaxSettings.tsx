import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Percent, Plus, CheckCircle2, ShieldCheck } from 'lucide-react';

export const TaxSettings: React.FC = () => {
  const { restaurantProfile, updateRestaurantProfile } = useApp();
  const [taxes, setTaxes] = useState([
    { id: 'tax-1', name: 'CGST (Central GST)', rate: 2.5, type: 'Percentage', appliesTo: 'All F&B Items', status: 'active' },
    { id: 'tax-2', name: 'SGST (State GST)', rate: 2.5, type: 'Percentage', appliesTo: 'All F&B Items', status: 'active' },
    { id: 'tax-3', name: 'Service Tax (AC Dining)', rate: 5.0, type: 'Percentage', appliesTo: 'Dine-In Orders Only', status: 'inactive' }
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTax, setNewTax] = useState({ name: '', rate: 5, appliesTo: 'All Items' });

  const handleAddTax = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTax.name) return;
    setTaxes(prev => [
      ...prev,
      {
        id: `tax-${Date.now()}`,
        name: newTax.name,
        rate: Number(newTax.rate),
        type: 'Percentage',
        appliesTo: newTax.appliesTo,
        status: 'active'
      }
    ]);
    setIsAddOpen(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 select-none space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Tax Rates & GST Rules</h2>
          <p className="text-xs text-slate-500 font-medium">Configure Goods and Services Tax (GST), VAT and dining surcharges</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Tax Rule</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase">
              <th className="p-3.5 pl-4">Tax Name</th>
              <th className="p-3.5">Tax Rate (%)</th>
              <th className="p-3.5">Applicable Items</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 pr-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {taxes.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="p-3.5 pl-4 font-bold text-slate-900">{t.name}</td>
                <td className="p-3.5 font-extrabold text-orange-600">{t.rate}%</td>
                <td className="p-3.5 text-slate-500">{t.appliesTo}</td>
                <td className="p-3.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      t.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="p-3.5 pr-4 text-right">
                  <button
                    onClick={() => {
                      setTaxes(prev =>
                        prev.map(item => (item.id === t.id ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' } : item))
                      );
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-orange-600"
                  >
                    Toggle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Add Tax Surcharge</h3>
            <form onSubmit={handleAddTax} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tax Label</label>
                <input
                  type="text"
                  value={newTax.name}
                  onChange={(e) => setNewTax({ ...newTax, name: e.target.value })}
                  placeholder="e.g. Municipal Cess"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Percentage (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newTax.rate}
                  onChange={(e) => setNewTax({ ...newTax, rate: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  required
                />
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
                  className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold shadow-sm"
                >
                  Save Tax
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
