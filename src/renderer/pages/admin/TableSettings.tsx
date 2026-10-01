import React, { useState } from 'react';
import { useApp, TableInfo } from '../../context/AppContext';
import { LayoutGrid, Plus, Trash2, Edit2, Check, Users, QrCode, ExternalLink, Copy, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const TableSettings: React.FC = () => {
  const { tables, setTables } = useApp();
  const [customFloors, setCustomFloors] = useState<string[]>(['Floor 1', 'Floor 2', 'Terrace Patio', 'VIP Lounge']);
  const [selectedFloor, setSelectedFloor] = useState('Floor 1');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAddFloorOpen, setIsAddFloorOpen] = useState(false);
  const [newFloorName, setNewFloorName] = useState('');
  const [viewingQrTable, setViewingQrTable] = useState<TableInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const [newTable, setNewTable] = useState({ number: '', capacity: 4, floor: 'Floor 1' });

  const webBaseUrl = window.location.hostname === 'localhost' || window.location.protocol === 'file:'
    ? 'http://localhost:5173'
    : 'https://ashnora.com';
  const restaurantId = 'ASH-BLR-01';

  // Extract all existing floors dynamically from tables + customFloors
  const allFloors = Array.from(new Set([...customFloors, ...tables.map(t => t.floor || 'Floor 1')]));
  const filteredTables = tables.filter(t => (t.floor || 'Floor 1') === selectedFloor);

  const handleAddFloor = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newFloorName.trim();
    if (!trimmed || allFloors.includes(trimmed)) return;
    setCustomFloors(prev => [...prev, trimmed]);
    setSelectedFloor(trimmed);
    setNewTable(prev => ({ ...prev, floor: trimmed }));
    setNewFloorName('');
    setIsAddFloorOpen(false);
  };

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTable.number) return;

    const tableItem: TableInfo = {
      id: `t-${Date.now()}`,
      number: newTable.number,
      floor: newTable.floor,
      capacity: Number(newTable.capacity),
      status: 'available'
    };

    setTables(prev => [...prev, tableItem]);
    setIsAddOpen(false);
    setNewTable({ number: '', capacity: 4, floor: selectedFloor });
  };

  const handleDeleteTable = (id: string) => {
    setTables(prev => prev.filter(t => t.id !== id));
  };

  const handleOpenUrl = (url: string) => {
    const api = (window as any).electronAPI;
    if (api?.shell?.openExternal) {
      api.shell.openExternal(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 select-none space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Table Layout & Floor Visual Editor</h2>
          <p className="text-xs text-slate-500 font-medium">Add, configure capacities, preview QR codes and manage restaurant floor seating</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Table</span>
        </button>
      </div>

      {/* Floor Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100">
        {allFloors.map(floor => (
          <button
            key={floor}
            onClick={() => setSelectedFloor(floor)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              selectedFloor === floor
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {floor}
          </button>
        ))}

        <button
          onClick={() => setIsAddFloorOpen(true)}
          className="px-3.5 py-2 rounded-xl border border-dashed border-slate-300 hover:border-orange-500 text-slate-600 hover:text-orange-600 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Floor / Section</span>
        </button>
      </div>

      {/* Visual Table Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredTables.map(tbl => (
          <div
            key={tbl.id}
            className={`p-4 rounded-2xl border flex flex-col justify-between text-center transition-all ${
              tbl.status === 'occupied'
                ? 'bg-orange-50/70 border-orange-200'
                : tbl.status === 'reserved'
                ? 'bg-purple-50/70 border-purple-200'
                : 'bg-emerald-50/50 border-emerald-200'
            }`}
          >
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Table
              </div>
              <div className="text-xl font-black text-slate-900">{tbl.number}</div>
              <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 mt-1">
                <Users className="w-3 h-3" />
                <span>{tbl.capacity} Seats</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                {tbl.status}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewingQrTable(tbl)}
                  className="text-slate-400 hover:text-orange-500 p-1 cursor-pointer"
                  title="View Table QR Code"
                >
                  <QrCode className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteTable(tbl.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                  title="Remove Table"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Floor Section Modal */}
      {isAddFloorOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Add Floor / Section</h3>
            <p className="text-xs text-slate-500 font-medium mb-4">Create a new dining area, patio, rooftop, or banquet hall</p>
            
            <form onSubmit={handleAddFloor} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Floor / Area Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rooftop Garden or VIP Private Dining"
                  value={newFloorName}
                  onChange={(e) => setNewFloorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
                  required
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddFloorOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm"
                >
                  Add Floor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Quick Modal */}
      {viewingQrTable && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl text-center relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setViewingQrTable(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/70 text-orange-600 text-[11px] font-bold mb-3">
              <QrCode className="w-3.5 h-3.5" />
              <span>Table Dining QR</span>
            </div>

            <h3 className="text-xl font-black text-slate-900">Table {viewingQrTable.number}</h3>
            <p className="text-xs text-slate-500 font-medium mb-4">
              {viewingQrTable.floor || 'Floor 1'} • Capacity: {viewingQrTable.capacity} Seats
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 inline-block shadow-inner mb-3">
              <QRCodeSVG
                value={`${webBaseUrl}/menu?r=${restaurantId}&table=${encodeURIComponent(viewingQrTable.number)}`}
                size={160}
                level="M"
                includeMargin={false}
              />
            </div>

            <div className="text-[10px] font-mono text-slate-500 break-all px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 mb-4">
              {`${webBaseUrl}/menu?r=${restaurantId}&table=${encodeURIComponent(viewingQrTable.number)}`}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleOpenUrl(`${webBaseUrl}/menu?r=${restaurantId}&table=${encodeURIComponent(viewingQrTable.number)}`)}
                className="py-2.5 px-3 rounded-xl bg-[#0B1F3A] hover:bg-[#132c4f] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
                <span>Launch Web</span>
              </button>
              <button
                onClick={() => handleCopy(`${webBaseUrl}/menu?r=${restaurantId}&table=${encodeURIComponent(viewingQrTable.number)}`)}
                className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Add Floor Table</h3>
            <form onSubmit={handleAddTable} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Table Number</label>
                <input
                  type="text"
                  placeholder="e.g. 15 or Patio-02"
                  value={newTable.number}
                  onChange={(e) => setNewTable({ ...newTable, number: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Floor Section</label>
                <select
                  value={newTable.floor}
                  onChange={(e) => setNewTable({ ...newTable, floor: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                >
                  {allFloors.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Seating Capacity</label>
                <input
                  type="number"
                  value={newTable.capacity}
                  onChange={(e) => setNewTable({ ...newTable, capacity: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  required
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
                  className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold shadow-sm"
                >
                  Add Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
