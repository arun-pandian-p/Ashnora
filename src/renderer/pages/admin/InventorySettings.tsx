import React, { useState } from 'react';
import { Box, AlertTriangle, Truck, Layers, Save, CheckCircle2 } from 'lucide-react';

export const InventorySettings: React.FC = () => {
  const [units, setUnits] = useState(['kg', 'grams', 'Liters', 'ml', 'pieces', 'packets', 'bottles']);
  const [lowStockNotification, setLowStockNotification] = useState(true);
  const [autoReorderEmail, setAutoReorderEmail] = useState('inventory@ashnora.com');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 select-none space-y-6">
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Inventory & Stock Configuration</h2>
          <p className="text-xs text-slate-500 font-medium">Measurement units, low-stock trigger rules, and automated purchase alerts</p>
        </div>
        {saved && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
            Active Stock Measurement Units
          </label>
          <div className="flex flex-wrap gap-2">
            {units.map((u, i) => (
              <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800">
                {u}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Supplier Reorder Alert Email
            </label>
            <input
              type="email"
              value={autoReorderEmail}
              onChange={(e) => setAutoReorderEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
            />
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={lowStockNotification}
                onChange={(e) => setLowStockNotification(e.target.checked)}
                className="w-4 h-4 rounded text-orange-500"
              />
              <span>Trigger popup badge when ingredient drops below threshold</span>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm"
          >
            Save Inventory Rules
          </button>
        </div>
      </form>
    </div>
  );
};
