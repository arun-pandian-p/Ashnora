import React, { useState } from 'react';
import { useApp, HardwarePrinter } from '../../context/AppContext';
import { Printer, RefreshCw, CheckCircle2, AlertCircle, Play, Cpu, Usb, Wifi, Terminal } from 'lucide-react';

export const PrinterManagement: React.FC = () => {
  const { printers, setPrinters, testPrintHardware } = useApp();
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; message: string; success: boolean } | null>(null);

  const handleTestPrint = async (printer: HardwarePrinter) => {
    setTestingId(printer.id);
    const result = await testPrintHardware(printer.id);
    setTestResult({ id: printer.id, message: result.message, success: result.success });
    setTestingId(null);
    setTimeout(() => setTestResult(null), 4000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 select-none space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Native Hardware & POS Printers</h2>
          <p className="text-xs text-slate-500 font-medium">Windows Direct Hardware Integration: Thermal 80mm/58mm, Kitchen KOT, RJ11 Cash Drawer & Scanners</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>Windows Spooler Active</span>
          </span>
        </div>
      </div>

      {/* Hardware Device Grid (Section 12 ASCII) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {printers.map((printer) => (
          <div
            key={printer.id}
            className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-orange-200 transition-all shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600">
                    <Printer className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{printer.name}</h4>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{printer.type} Device</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                  {printer.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100 mb-3 text-slate-600 font-medium">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Interface</span>
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    {printer.connection.includes('USB') ? <Usb className="w-3 h-3 text-blue-500" /> : <Wifi className="w-3 h-3 text-emerald-500" />}
                    {printer.connection}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Paper Width</span>
                  <span className="font-semibold text-slate-800">{printer.paperWidth}</span>
                </div>
              </div>

              {testResult?.id === printer.id && (
                <div
                  className={`p-2 rounded-xl text-xs font-bold mb-3 flex items-center gap-1.5 ${
                    testResult.success ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{testResult.message}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-mono text-slate-400">
                {printer.ipAddress || 'RAW USB Direct'}
              </span>
              <button
                onClick={() => handleTestPrint(printer)}
                disabled={testingId === printer.id}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3 h-3 text-orange-400 fill-orange-400" />
                <span>{testingId === printer.id ? 'Sending...' : 'Test Print'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
        <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-orange-500" />
          Native Windows Hardware Communication
        </h4>
        <p>
          Ashnora.exe communicates with POS hardware via Electron IPC directly to native Win32 printer drivers and ESC/POS raw socket endpoints. No browser print dialogs needed.
        </p>
      </div>
    </div>
  );
};
