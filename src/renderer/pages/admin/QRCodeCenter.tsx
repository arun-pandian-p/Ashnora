import React, { useState, useRef } from 'react';
import { useApp, TableInfo } from '../../context/AppContext';
import { QRCodeSVG } from 'qrcode.react';
import {
  QrCode,
  ExternalLink,
  Copy,
  Printer,
  Download,
  Check,
  Sparkles,
  Smartphone,
  Layers,
  Radio,
  RefreshCw,
  Globe
} from 'lucide-react';
import { BRAND_LOGO } from '../../assets/images';

export const QRCodeCenter: React.FC = () => {
  const { tables, restaurantProfile } = useApp();
  const [webBaseUrl, setWebBaseUrl] = useState(() => {
    return window.location.hostname === 'localhost' || window.location.protocol === 'file:'
      ? 'http://localhost:5173'
      : 'https://ashnora.com';
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null);
  const [filterFloor, setFilterFloor] = useState('all');

  const restaurantId = 'ASH-BLR-01';
  const masterMenuUrl = `${webBaseUrl}/menu?r=${restaurantId}`;

  const floors = ['all', ...Array.from(new Set(tables.map(t => t.floor || 'Floor 1')))];
  const filteredTables = filterFloor === 'all'
    ? tables
    : tables.filter(t => (t.floor || 'Floor 1') === filterFloor);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenUrl = (url: string) => {
    const api = (window as any).electronAPI;
    if (api?.shell?.openExternal) {
      api.shell.openExternal(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const handlePrintAllStands = () => {
    window.print();
  };

  const getTableMenuUrl = (tableNumber: string, seat?: number) => {
    let url = `${webBaseUrl}/menu?r=${restaurantId}&table=${encodeURIComponent(tableNumber)}`;
    if (seat) {
      url += `&seat=${seat}`;
    }
    return url;
  };

  return (
    <div className="space-y-6 select-none">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-[#0B1F3A] to-[#162D4A] rounded-3xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-bold">
              <QrCode className="w-3.5 h-3.5" />
              <span>Real-Time Customer Menu & Table QR Flow</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Table QR Code & Web Connect Center
            </h1>
            <p className="text-slate-300 text-xs md:text-sm font-medium leading-relaxed">
              Generate, preview, test, and print high-resolution Table & Seat QR codes. Scanning instantly connects customers to the live ordering, voice note, and payment pipeline.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePrintAllStands}
              className="px-4 py-2.5 rounded-xl bg-white text-[#0B1F3A] hover:bg-slate-100 text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4 text-orange-500" />
              <span>Print Table Stands</span>
            </button>
            <button
              onClick={() => handleOpenUrl(masterMenuUrl)}
              className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/25 flex items-center gap-2 cursor-pointer transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Customer Web Menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Web Base URL & Real-Time Sync Config */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Customer Menu Web Domain
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                QR codes point to this URL. Realtime events sync between this web menu and Ashnora.exe.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              value={webBaseUrl}
              onChange={(e) => setWebBaseUrl(e.target.value)}
              placeholder="https://ashnora.com or http://localhost:5173"
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono text-slate-800 w-full md:w-64 focus:outline-none focus:bg-white focus:border-orange-500"
            />
            <button
              onClick={() => handleCopy(masterMenuUrl, 'master-url')}
              className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {copiedId === 'master-url' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'master-url' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Master Menu QR + Live Flow Architecture Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Master QR Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col items-center text-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-800 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Master Restaurant QR</span>
            </div>
            <h3 className="text-base font-black text-slate-900 mb-1">
              General Menu & Walk-In
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-4">
              Scan from any phone to view the live menu, search items, and browse categories.
            </p>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 inline-block shadow-inner">
              <QRCodeSVG
                value={masterMenuUrl}
                size={160}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: BRAND_LOGO,
                  x: undefined,
                  y: undefined,
                  height: 28,
                  width: 28,
                  excavate: true
                }}
              />
            </div>

            <div className="text-[11px] font-mono text-slate-600 font-semibold mt-3 break-all px-4 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
              {masterMenuUrl}
            </div>
          </div>

          <div className="w-full pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={() => handleOpenUrl(masterMenuUrl)}
              className="flex-1 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#132c4f] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-orange-400" />
              <span>Test on Web</span>
            </button>
            <button
              onClick={() => handleCopy(masterMenuUrl, 'master-qr')}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
              title="Copy Link"
            >
              {copiedId === 'master-qr' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Real-time Order ↔ Voice ↔ KDS Workflow Infographic */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                Live Customer ↔ Kitchen ↔ Waiter ↔ POS Pipeline
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                REALTIME ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs mb-6">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <div className="font-bold text-[#0B1F3A] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-black">1</span>
                  <span>QR Scan</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Customer scans Table QR. Session token generated with cryptographic isolation.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <div className="font-bold text-[#0B1F3A] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-black">2</span>
                  <span>Voice & Order</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Order items with optional 30s audio instruction. Idempotent submission.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <div className="font-bold text-[#0B1F3A] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-black">3</span>
                  <span>Live KDS & Staff</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Kitchen hears voice note, updates status (Prep/Ready). Waiter call dispatches.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <div className="font-bold text-[#0B1F3A] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-black">4</span>
                  <span>Bill & Close</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Request Bill sent to POS. Payment settled, receipt printed, session cleanly ended.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Total Configured Floor Tables: {tables.length}</div>
                <div className="text-[11px] text-slate-600 font-medium">Each table has a dedicated dining session QR code with seat multiplexing</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floor Filter Tabs & Table QR Stand Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Table QR Stands & Direct Launch</h2>
            <p className="text-xs text-slate-500 font-medium">Click any table to view high-res QR code, copy link, or test in browser</p>
          </div>

          {/* Floor filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {floors.map(fl => (
              <button
                key={fl}
                onClick={() => setFilterFloor(fl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterFloor === fl
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {fl === 'all' ? 'All Floors' : fl}
              </button>
            ))}
          </div>
        </div>

        {/* Table Cards with Embedded QR Codes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredTables.map(tbl => {
            const tableUrl = getTableMenuUrl(tbl.number);
            const isSelected = selectedTable?.id === tbl.id;

            return (
              <div
                key={tbl.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                  isSelected ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {tbl.floor || 'Floor 1'}
                      </span>
                      <h4 className="text-base font-black text-slate-900">
                        Table {tbl.number}
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {tbl.capacity} Seats
                    </span>
                  </div>

                  {/* QR Code Graphic */}
                  <div className="flex justify-center p-3 bg-slate-50 rounded-xl border border-slate-100 my-2">
                    <QRCodeSVG
                      value={tableUrl}
                      size={110}
                      level="M"
                      includeMargin={false}
                    />
                  </div>

                  <div className="text-[10px] font-mono text-slate-500 truncate text-center mt-1">
                    {tableUrl}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleOpenUrl(tableUrl)}
                    className="py-2 px-3 rounded-xl bg-[#0B1F3A] hover:bg-[#132c4f] text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 text-orange-400" />
                    <span>Launch</span>
                  </button>
                  <button
                    onClick={() => handleCopy(tableUrl, tbl.id)}
                    className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedId === tbl.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === tbl.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
