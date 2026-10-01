import React, { useState } from 'react';
import { useApp, Reservation } from '../../context/AppContext';
import { Calendar, Plus, Users, Clock, Phone, CheckCircle2, XCircle, Search, ChevronRight } from 'lucide-react';

export const ReservationsScreen: React.FC = () => {
  const { reservations, setReservations, tables } = useApp();
  const [selectedDate, setSelectedDate] = useState('Today');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newRes, setNewRes] = useState({
    customerName: '',
    phone: '',
    guestCount: 2,
    tableNumber: '01',
    time: '8:00 PM',
    notes: ''
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRes.customerName || !newRes.phone) return;

    const res: Reservation = {
      id: `res-${Date.now()}`,
      customerName: newRes.customerName,
      phone: newRes.phone,
      guestCount: Number(newRes.guestCount),
      tableNumber: newRes.tableNumber,
      time: newRes.time,
      date: 'Today',
      status: 'confirmed',
      notes: newRes.notes
    };

    setReservations(prev => [res, ...prev]);
    setIsAddOpen(false);
    setNewRes({ customerName: '', phone: '', guestCount: 2, tableNumber: '01', time: '8:00 PM', notes: '' });
  };

  const updateStatus = (id: string, status: Reservation['status']) => {
    setReservations(prev =>
      prev.map(r => (r.id === id ? { ...r, status } : r))
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
            Table Bookings & Calendar 📅
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Guest Reservations
          </h1>
          <p className="text-xs text-slate-500 font-medium">Manage upcoming table reservations, party sizes, special guest requests and seating</p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm shadow-orange-500/20 flex items-center gap-2 cursor-pointer transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Reservation</span>
        </button>
      </div>

      {/* Date Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {['Today', 'Tomorrow', 'This Weekend', 'All Bookings'].map(date => (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedDate === date
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {date}
          </button>
        ))}
      </div>

      {/* Reservations Table (Section 28 ASCII) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase">
                <th className="p-3.5 pl-6">Guest Name</th>
                <th className="p-3.5">Contact</th>
                <th className="p-3.5">Table</th>
                <th className="p-3.5">Party Size</th>
                <th className="p-3.5">Booking Time</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {reservations.map(res => (
                <tr key={res.id} className="hover:bg-slate-50/80">
                  <td className="p-3.5 pl-6">
                    <p className="font-bold text-slate-900">{res.customerName}</p>
                    {res.notes && (
                      <p className="text-[10px] text-purple-700 font-semibold mt-0.5">{res.notes}</p>
                    )}
                  </td>
                  <td className="p-3.5 text-slate-500 font-mono">{res.phone}</td>
                  <td className="p-3.5 font-black text-slate-900">Table {res.tableNumber}</td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {res.guestCount} Guests
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-orange-600">{res.time}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        res.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : res.status === 'seated'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {res.status}
                    </span>
                  </td>
                  <td className="p-3.5 pr-6 text-right space-x-2">
                    {res.status !== 'seated' && (
                      <button
                        onClick={() => updateStatus(res.id, 'seated')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] cursor-pointer"
                      >
                        Seat Guest
                      </button>
                    )}
                    <button
                      onClick={() => updateStatus(res.id, 'cancelled')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 font-bold text-[11px] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900 mb-1">New Table Reservation</h3>
            <form onSubmit={handleAdd} className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Guest Name</label>
                <input
                  type="text"
                  placeholder="e.g. Vikram Malhotra"
                  value={newRes.customerName}
                  onChange={(e) => setNewRes({ ...newRes, customerName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98765 00000"
                    value={newRes.phone}
                    onChange={(e) => setNewRes({ ...newRes, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Guests</label>
                  <input
                    type="number"
                    value={newRes.guestCount}
                    onChange={(e) => setNewRes({ ...newRes, guestCount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Table</label>
                  <select
                    value={newRes.tableNumber}
                    onChange={(e) => setNewRes({ ...newRes, tableNumber: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                  >
                    {tables.map(t => (
                      <option key={t.id} value={t.number}>Table {t.number}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Time</label>
                  <input
                    type="text"
                    value={newRes.time}
                    onChange={(e) => setNewRes({ ...newRes, time: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Special Notes</label>
                <textarea
                  rows={2}
                  placeholder="Anniversary setup, dietary allergy..."
                  value={newRes.notes}
                  onChange={(e) => setNewRes({ ...newRes, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
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
                  className="px-5 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold shadow-sm"
                >
                  Book Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
