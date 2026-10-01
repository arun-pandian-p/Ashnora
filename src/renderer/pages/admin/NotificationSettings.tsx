import React, { useState } from 'react';
import { Bell, Volume2, Smartphone, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const NotificationSettings: React.FC = () => {
  const [alerts, setAlerts] = useState([
    { id: 'n1', title: 'New Customer Order Alert', desc: 'Audio chime and desktop popup when a new order arrives', active: true },
    { id: 'n2', title: 'Kitchen Order Ready Ping', desc: 'Notify floor waiters when KDS ticket moves to READY state', active: true },
    { id: 'n3', title: 'Low Raw Material Stock Warning', desc: 'Daily morning notification for ingredients below minimum limit', active: true },
    { id: 'n4', title: 'Upcoming Reservation Reminder', desc: '15-minute advance alert for guest table bookings', active: true },
    { id: 'n5', title: 'Daily Revenue Settlement Summary', desc: 'Automatic end-of-day summary dispatch to owner email', active: true }
  ]);

  const toggleAlert = (id: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 select-none space-y-6">
      <div className="pb-6 border-b border-slate-100">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">System Alerts & Sound Notifications</h2>
        <p className="text-xs text-slate-500 font-medium">Configure desktop popup sounds, order chimes and staff notification triggers</p>
      </div>

      <div className="space-y-3">
        {alerts.map(a => (
          <div
            key={a.id}
            className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
              a.active ? 'bg-white border-slate-200/80 shadow-2xs' : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${a.active ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{a.title}</h4>
                <p className="text-[11px] text-slate-500">{a.desc}</p>
              </div>
            </div>

            <button
              onClick={() => toggleAlert(a.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                a.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {a.active ? 'ON' : 'OFF'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
