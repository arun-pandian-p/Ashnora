import React, { useState } from 'react';
import { Calendar, Clock, Users, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const ReservationSettings: React.FC = () => {
  const [slotDuration, setSlotDuration] = useState(90);
  const [advanceDays, setAdvanceDays] = useState(14);
  const [autoConfirm, setAutoConfirm] = useState(true);
  const [gracePeriod, setGracePeriod] = useState(15);
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
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Reservation & Booking Rules</h2>
          <p className="text-xs text-slate-500 font-medium">Configure table holding duration, booking lead time and cancellation policies</p>
        </div>
        {saved && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            Default Dining Duration (Minutes)
          </label>
          <input
            type="number"
            value={slotDuration}
            onChange={(e) => setSlotDuration(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            Max Advance Booking Window (Days)
          </label>
          <input
            type="number"
            value={advanceDays}
            onChange={(e) => setAdvanceDays(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            Grace Period Before No-Show Release (Minutes)
          </label>
          <input
            type="number"
            value={gracePeriod}
            onChange={(e) => setGracePeriod(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
          />
        </div>

        <div className="flex items-center pt-6">
          <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={autoConfirm}
              onChange={(e) => setAutoConfirm(e.target.checked)}
              className="w-4 h-4 rounded text-orange-500"
            />
            <span>Auto-confirm reservations when tables are free</span>
          </label>
        </div>

        <div className="md:col-span-2 pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm"
          >
            Save Reservation Rules
          </button>
        </div>
      </form>
    </div>
  );
};
