import React, { useState } from 'react';
import { Clock, CheckCircle2, Save } from 'lucide-react';

export const BusinessHours: React.FC = () => {
  const [days, setDays] = useState([
    { day: 'Monday', open: '11:00 AM', close: '11:30 PM', breakTime: '3:30 PM - 5:30 PM', isOpen: true },
    { day: 'Tuesday', open: '11:00 AM', close: '11:30 PM', breakTime: '3:30 PM - 5:30 PM', isOpen: true },
    { day: 'Wednesday', open: '11:00 AM', close: '11:30 PM', breakTime: '3:30 PM - 5:30 PM', isOpen: true },
    { day: 'Thursday', open: '11:00 AM', close: '11:30 PM', breakTime: '3:30 PM - 5:30 PM', isOpen: true },
    { day: 'Friday', open: '11:00 AM', close: '12:00 AM', breakTime: 'None', isOpen: true },
    { day: 'Saturday', open: '11:00 AM', close: '12:00 AM', breakTime: 'None', isOpen: true },
    { day: 'Sunday', open: '11:00 AM', close: '11:30 PM', breakTime: 'None', isOpen: true }
  ]);

  const [saved, setSaved] = useState(false);

  const toggleDay = (idx: number) => {
    setDays(prev =>
      prev.map((d, i) => (i === idx ? { ...d, isOpen: !d.isOpen } : d))
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 select-none space-y-6">
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Operating Business Hours</h2>
          <p className="text-xs text-slate-500 font-medium">Configure daily opening times, kitchen break hours, and holiday schedules</p>
        </div>
        {saved && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase">
                <th className="p-3.5 pl-4">Day</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Opening Time</th>
                <th className="p-3.5">Closing Time</th>
                <th className="p-3.5">Break / Prep Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {days.map((item, idx) => (
                <tr key={item.day} className={item.isOpen ? 'hover:bg-slate-50' : 'bg-slate-50/50 opacity-60'}>
                  <td className="p-3.5 pl-4 font-bold text-slate-900">{item.day}</td>
                  <td className="p-3.5">
                    <button
                      type="button"
                      onClick={() => toggleDay(idx)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer uppercase ${
                        item.isOpen ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {item.isOpen ? 'OPEN' : 'CLOSED'}
                    </button>
                  </td>
                  <td className="p-3.5">{item.open}</td>
                  <td className="p-3.5">{item.close}</td>
                  <td className="p-3.5 text-slate-500">{item.breakTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>SAVE HOURS</span>
          </button>
        </div>
      </form>
    </div>
  );
};
