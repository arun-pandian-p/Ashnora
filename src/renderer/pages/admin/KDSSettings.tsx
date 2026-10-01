import React, { useState } from 'react';
import { ChefHat, Volume2, Bell, Sliders, CheckCircle2 } from 'lucide-react';

export const KDSSettings: React.FC = () => {
  const [stations, setStations] = useState([
    { id: 'st-1', name: 'Main Kitchen (Hot Kitchen)', active: true, categories: 'Main Course, Starters, Breads' },
    { id: 'st-2', name: 'Bar & Beverage Counter', active: true, categories: 'Drinks, Shakes, Mocktails' },
    { id: 'st-3', name: 'Dessert & Bakery Station', active: true, categories: 'Desserts, Ice Cream' },
    { id: 'st-4', name: 'Tandoor & Clay Oven Section', active: true, categories: 'Tandoori, Kebabs, Naan' }
  ]);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [prepWarningThreshold, setPrepWarningThreshold] = useState(12);

  const toggleStation = (id: string) => {
    setStations(prev =>
      prev.map(s => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 select-none space-y-6">
      <div className="pb-6 border-b border-slate-100">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">KDS Kitchen Stations & Routing</h2>
        <p className="text-xs text-slate-500 font-medium">Configure multi-station ticket routing, preparation timers, and audio kitchen bells</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Kitchen Prep Stations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stations.map(st => (
            <div
              key={st.id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between ${
                st.active ? 'bg-amber-50/40 border-amber-200 shadow-2xs' : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div>
                <h4 className="text-sm font-bold text-slate-900">{st.name}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  <strong>Routes:</strong> {st.categories}
                </p>
              </div>
              <button
                onClick={() => toggleStation(st.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  st.active ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {st.active ? 'ACTIVE' : 'OFF'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
            Urgent Ticket Alert Time (Minutes)
          </label>
          <input
            type="number"
            value={prepWarningThreshold}
            onChange={(e) => setPrepWarningThreshold(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
          />
          <p className="text-[11px] text-slate-400 mt-1">Tickets exceeding this duration turn bright red on the kitchen display.</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
            Audio Kitchen Bell Chime
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer ${
                soundEnabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{soundEnabled ? 'Kitchen Sound Enabled' : 'Muted'}</span>
            </button>
            <button
              onClick={() => {
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                audio.play().catch(() => {});
              }}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
            >
              Test Chime 🔔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
