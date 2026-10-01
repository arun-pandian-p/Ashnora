import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Receipt, Percent, Save, CheckCircle2, Eye } from 'lucide-react';

export const BillingSettings: React.FC = () => {
  const { restaurantProfile, updateRestaurantProfile } = useApp();
  const [formData, setFormData] = useState({
    taxRate: restaurantProfile.taxRate,
    serviceChargeRate: restaurantProfile.serviceChargeRate,
    receiptFooter: restaurantProfile.receiptFooter,
    invoicePrefix: 'INV-2026-',
    enableRounding: true,
    showGstinOnBill: true
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurantProfile({
      taxRate: formData.taxRate,
      serviceChargeRate: formData.serviceChargeRate,
      receiptFooter: formData.receiptFooter
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 select-none space-y-6">
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Billing & Thermal Receipt Layout</h2>
          <p className="text-xs text-slate-500 font-medium">Configure invoice numbering, service charges, rounding rules, and live receipt template</p>
        </div>
        {saved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Updated</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Invoice Prefix</label>
            <input
              type="text"
              value={formData.invoicePrefix}
              onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">GST / Tax Rate (%)</label>
              <input
                type="number"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Service Charge (%)</label>
              <input
                type="number"
                value={formData.serviceChargeRate}
                onChange={(e) => setFormData({ ...formData, serviceChargeRate: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Receipt Footer Note</label>
            <textarea
              rows={2}
              value={formData.receiptFooter}
              onChange={(e) => setFormData({ ...formData, receiptFooter: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
            />
          </div>

          <div className="pt-2 space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enableRounding}
                onChange={(e) => setFormData({ ...formData, enableRounding: e.target.checked })}
                className="rounded text-orange-500"
              />
              <span>Automatically round off grand total to nearest ₹1</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showGstinOnBill}
                onChange={(e) => setFormData({ ...formData, showGstinOnBill: e.target.checked })}
                className="rounded text-orange-500"
              />
              <span>Print FSSAI & GSTIN numbers on thermal customer receipt</span>
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>SAVE BILLING RULES</span>
            </button>
          </div>
        </form>

        {/* Right Live Thermal Receipt Preview (Section 11 ASCII requirement) */}
        <div className="bg-slate-100 p-6 rounded-3xl border border-slate-200 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Eye className="w-4 h-4 text-orange-500" />
            <span>Live 80mm Receipt Preview</span>
          </div>

          <div className="w-full max-w-[280px] bg-white p-5 rounded-2xl shadow-md border border-slate-200 font-mono text-[11px] text-slate-800 leading-tight">
            <div className="text-center pb-2 border-b border-dashed border-slate-300">
              <p className="font-extrabold text-xs">{restaurantProfile.name}</p>
              <p className="text-[10px] text-slate-500">{restaurantProfile.branch}</p>
              <p className="text-[9px] text-slate-400">{restaurantProfile.address}</p>
              {formData.showGstinOnBill && (
                <p className="text-[9px] text-slate-500 mt-1 font-bold">GSTIN: {restaurantProfile.gstin}</p>
              )}
            </div>

            <div className="py-2 border-b border-dashed border-slate-300 flex justify-between text-[10px]">
              <span>Order: #102</span>
              <span>Table 04 • Dine-In</span>
            </div>

            <div className="py-2 border-b border-dashed border-slate-300 space-y-1">
              <div className="flex justify-between">
                <span>Chicken Biryani x2</span>
                <span className="font-bold">₹680</span>
              </div>
              <div className="flex justify-between">
                <span>Fresh Lime Soda x2</span>
                <span className="font-bold">₹160</span>
              </div>
            </div>

            <div className="py-2 border-b border-dashed border-slate-300 space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹840.00</span>
              </div>
              <div className="flex justify-between">
                <span>GST ({formData.taxRate}%):</span>
                <span>₹{(840 * formData.taxRate) / 100}</span>
              </div>
              {formData.serviceChargeRate > 0 && (
                <div className="flex justify-between">
                  <span>Service Charge ({formData.serviceChargeRate}%):</span>
                  <span>₹{(840 * formData.serviceChargeRate) / 100}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-xs pt-1 border-t border-slate-200">
                <span>TOTAL:</span>
                <span>₹{840 + (840 * formData.taxRate) / 100}</span>
              </div>
            </div>

            <div className="text-center pt-3 text-[9px] text-slate-500">
              <p>{formData.receiptFooter}</p>
              <p className="mt-1 text-[8px] text-slate-400">Powered by Ashnora Restaurant OS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
