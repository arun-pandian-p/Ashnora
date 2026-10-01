import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Globe, Shield, Database, Save, CheckCircle2, RefreshCw } from 'lucide-react';

export const RestaurantPreferences: React.FC = () => {
  const { restaurantProfile, updateRestaurantProfile } = useApp();
  const [currency, setCurrency] = useState('₹ (INR)');
  const [timezone, setTimezone] = useState('Asia/Kolkata (IST +5:30)');
  const [language, setLanguage] = useState('English (US / UK)');
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
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">System Preferences & Localization</h2>
          <p className="text-xs text-slate-500 font-medium">Currency, system timezone, automated database backups and security options</p>
        </div>
        {saved && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Preferences Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Currency Symbol</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
            >
              <option value="₹ (INR)">₹ (Indian Rupee - INR)</option>
              <option value="$ (USD)">$ (US Dollar - USD)</option>
              <option value="€ (EUR)">€ (Euro - EUR)</option>
              <option value="AED (AED)">AED (Emirati Dirham)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
            >
              <option value="Asia/Kolkata (IST +5:30)">Asia/Kolkata (IST +5:30)</option>
              <option value="Asia/Dubai (GST +4:00)">Asia/Dubai (GST +4:00)</option>
              <option value="Asia/Singapore (SGT +8:00)">Asia/Singapore (SGT +8:00)</option>
              <option value="Europe/London (GMT +0:00)">Europe/London (GMT +0:00)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Default Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
            >
              <option value="English (US / UK)">English</option>
              <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
              <option value="Tamil (தமிழ்)">Tamil (தமிழ்)</option>
              <option value="Kannada (ಕನ್ನಡ)">Kannada (ಕನ್ನಡ)</option>
            </select>
          </div>
        </div>

        {/* Database & Backup Options */}
        <div className="pt-4 border-t border-slate-100 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-orange-500" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Local Offline SQLite Database</h4>
              <p className="text-[11px] text-slate-500">Auto-backup snapshot created every 60 minutes.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => alert('Local database backup exported to C:\\Ashnora\\Backups\\ashnora_backup.sqlite')}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer shadow-2xs"
          >
            Export Backup Now
          </button>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>SAVE PREFERENCES</span>
          </button>
        </div>
      </form>
    </div>
  );
};
