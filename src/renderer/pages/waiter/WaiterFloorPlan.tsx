import React, { useState } from 'react';
import { useApp, TableInfo } from '../../context/AppContext';
import {
  LayoutGrid,
  Users,
  Plus,
  Calendar,
  UserCheck,
  CheckCircle2,
  Clock,
  Receipt,
  Utensils,
  ArrowRight
} from 'lucide-react';
import { WaiterTableOrder } from './WaiterTableOrder';

export const WaiterFloorPlan: React.FC = () => {
  const { tables, setActiveTab } = useApp();
  const [selectedFloor, setSelectedFloor] = useState('Floor 1');
  const [activeTableForOrder, setActiveTableForOrder] = useState<TableInfo | null>(null);

  const floors = ['Floor 1', 'Floor 2'];
  const filteredTables = tables.filter(t => t.floor === selectedFloor || (selectedFloor === 'Floor 1' && !t.floor));

  if (activeTableForOrder) {
    return (
      <WaiterTableOrder
        table={activeTableForOrder}
        onBack={() => setActiveTableForOrder(null)}
      />
    );
  }

  const getStatusColor = (status: TableInfo['status']) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-950';
      case 'occupied':
        return 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-950';
      case 'reserved':
        return 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-950';
      case 'waiting':
        return 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-950';
      case 'bill_requested':
        return 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-950';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-900';
    }
  };

  const getStatusBadge = (status: TableInfo['status']) => {
    switch (status) {
      case 'available':
        return <span className="text-[10px] font-bold text-emerald-700 uppercase">AVAILABLE</span>;
      case 'occupied':
        return <span className="text-[10px] font-bold text-orange-700 uppercase">OCCUPIED</span>;
      case 'reserved':
        return <span className="text-[10px] font-bold text-purple-700 uppercase">RESERVED</span>;
      case 'waiting':
        return <span className="text-[10px] font-bold text-amber-700 uppercase">WAITING</span>;
      case 'bill_requested':
        return <span className="text-[10px] font-bold text-blue-700 uppercase">BILL REQ</span>;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Waiter Floor Terminal 🪑
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Floor Seating & Tables
          </h1>
          <p className="text-xs text-slate-500 font-medium">Select any table to take guest orders, dispatch to kitchen, or check bill requests</p>
        </div>

        {/* Floor Dropdown / Tabs (Section 24 ASCII: Floor 1 ▼) */}
        <div className="flex items-center gap-2">
          {floors.map(floor => (
            <button
              key={floor}
              onClick={() => setSelectedFloor(floor)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedFloor === floor
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {floor}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-slate-200/80 text-xs font-semibold text-slate-600">
        <span className="text-slate-400 uppercase text-[10px] font-extrabold">Status Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-orange-500" />
          <span>Occupied</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-purple-500" />
          <span>Reserved</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Bill Requested</span>
        </div>
      </div>

      {/* Tables Grid (Section 24 ASCII) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredTables.map(tbl => (
          <div
            key={tbl.id}
            onClick={() => setActiveTableForOrder(tbl)}
            className={`p-5 rounded-3xl border ${getStatusColor(
              tbl.status
            )} shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group min-h-[140px]`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                  {tbl.floor}
                </span>
                {getStatusBadge(tbl.status)}
              </div>

              <div className="text-2xl font-black text-slate-900">
                TABLE {tbl.number}
              </div>

              <div className="text-xs font-bold text-slate-600 mt-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                {tbl.status === 'occupied' ? (
                  <span className="text-orange-700 font-extrabold">{tbl.currentGuests || tbl.capacity} Guests</span>
                ) : tbl.status === 'reserved' ? (
                  <span className="text-purple-700">{tbl.reservationTime || 'Booked'}</span>
                ) : (
                  <span>Capacity: {tbl.capacity}</span>
                )}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200/50 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-orange-600">
              <span>{tbl.status === 'occupied' ? 'Open Order' : 'Take Order'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Footer (Section 24 ASCII: [ + NEW ORDER ] [ RESERVATION ] [ CUSTOMER ]) */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
          Quick Actions
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTableForOrder(filteredTables[0] || tables[0])}
            className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm shadow-orange-500/20 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ NEW ORDER</span>
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer transition-all"
          >
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>RESERVATIONS</span>
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
          >
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>CUSTOMERS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
