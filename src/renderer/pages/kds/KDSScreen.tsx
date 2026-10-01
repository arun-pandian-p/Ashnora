import React, { useState } from 'react';
import { useApp, Order } from '../../context/AppContext';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  Play,
  Bell,
  Utensils,
  Filter,
  Volume2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const KDSScreen: React.FC = () => {
  const { orders, updateOrderStatus, restaurantProfile } = useApp();
  const [stationFilter, setStationFilter] = useState<string>('All');

  const stations = ['All', 'Main Kitchen', 'Bar', 'Grill'];

  const filteredOrders = orders.filter(o => {
    if (stationFilter === 'All') return true;
    return o.kitchenStation === stationFilter || (!o.kitchenStation && stationFilter === 'Main Kitchen');
  });

  const newOrders = filteredOrders.filter(o => o.status === 'new');
  const preparingOrders = filteredOrders.filter(o => o.status === 'preparing');
  const readyOrders = filteredOrders.filter(o => o.status === 'ready');
  const completedOrders = filteredOrders.filter(o => o.status === 'completed' || o.status === 'served');

  const playKitchenChime = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => {});
    } catch (e) {}
  };

  const renderOrderCard = (order: Order, nextStatus?: Order['status'], actionLabel?: string) => {
    const isUrgent = order.elapsedMinutes >= 12;
    const isWarning = order.elapsedMinutes >= 8 && order.elapsedMinutes < 12;

    return (
      <div
        key={order.id}
        className={`bg-white rounded-2xl border p-4 shadow-sm flex flex-col justify-between transition-all ${
          isUrgent
            ? 'border-rose-400 ring-2 ring-rose-400/20'
            : isWarning
            ? 'border-amber-300'
            : 'border-slate-200/80'
        }`}
      >
        <div>
          {/* Card Top Banner */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div>
              <span className="text-base font-black text-slate-900">{order.orderNumber}</span>
              <span className="text-xs font-bold text-orange-600 block uppercase">
                {order.tableNumber === 'Takeaway' ? '🥡 Takeaway' : `Table ${order.tableNumber}`}
              </span>
            </div>

            {/* Timer Badge */}
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black ${
                isUrgent
                  ? 'bg-rose-100 text-rose-700 animate-pulse'
                  : isWarning
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{order.elapsedMinutes}m</span>
            </div>
          </div>

          {/* Items List */}
          <div className="py-3 space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between text-xs">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-md bg-slate-900 text-white font-extrabold flex items-center justify-center text-[10px]">
                    {item.quantity}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900">{item.name}</span>
                    {item.notes && (
                      <p className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded mt-0.5">
                        Note: {item.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card Action Button */}
        {nextStatus && actionLabel && (
          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => {
                updateOrderStatus(order.id, nextStatus);
                playKitchenChime();
              }}
              className={`w-full py-2.5 px-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
                nextStatus === 'preparing'
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : nextStatus === 'ready'
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : nextStatus === 'completed'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-900 text-white'
              }`}
            >
              <span>{actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {order.status === 'completed' && (
          <div className="pt-2 text-center text-xs font-bold text-slate-400">
            ✓ Completed & Served
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-6 space-y-4 select-none bg-slate-100 overflow-hidden">
      {/* KDS Header Banner (Section 23 ASCII) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              ASHNORA KDS
              <span className="text-xs font-bold text-slate-500 font-mono">MAIN KITCHEN</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-semibold">
              Live Order Prep Tickets • High-Visibility Kitchen Board
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Station Filters */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {stations.map(st => (
              <button
                key={st}
                onClick={() => setStationFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  stationFilter === st ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={playKitchenChime}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            title="Test Kitchen Bell"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 KDS Columns: NEW | PREPARING | READY | COMPLETED (Section 23 ASCII) */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-hidden min-h-0">
        {/* NEW Orders Column */}
        <div className="flex flex-col bg-slate-200/60 rounded-2xl p-3 overflow-hidden">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              NEW
            </h3>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white text-slate-800 shadow-2xs">
              {newOrders.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {newOrders.map(order => renderOrderCard(order, 'preparing', '[START]'))}
            {newOrders.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-xs font-medium">No new orders</div>
            )}
          </div>
        </div>

        {/* PREPARING Column */}
        <div className="flex flex-col bg-slate-200/60 rounded-2xl p-3 overflow-hidden">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-orange-800 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              PREPARING
            </h3>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white text-orange-800 shadow-2xs">
              {preparingOrders.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {preparingOrders.map(order => renderOrderCard(order, 'ready', '[READY]'))}
            {preparingOrders.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-xs font-medium">No orders cooking</div>
            )}
          </div>
        </div>

        {/* READY Column */}
        <div className="flex flex-col bg-slate-200/60 rounded-2xl p-3 overflow-hidden">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              READY
            </h3>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white text-emerald-800 shadow-2xs">
              {readyOrders.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {readyOrders.map(order => renderOrderCard(order, 'completed', '[SERVE]'))}
            {readyOrders.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-xs font-medium">No items waiting</div>
            )}
          </div>
        </div>

        {/* COMPLETED Column */}
        <div className="flex flex-col bg-slate-200/60 rounded-2xl p-3 overflow-hidden">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
              COMPLETED
            </h3>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white text-slate-600 shadow-2xs">
              {completedOrders.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 opacity-75">
            {completedOrders.map(order => renderOrderCard(order))}
            {completedOrders.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-xs font-medium">No history today</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
