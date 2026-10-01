import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Download, Printer, Filter, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';

export const ReportsScreen: React.FC = () => {
  const { restaurantProfile } = useApp();
  const [selectedReport, setSelectedReport] = useState('sales');
  const [dateRange, setDateRange] = useState('Today (Oct 01)');

  const reportTypes = [
    { id: 'sales', title: 'Daily Sales & Revenue Report', desc: 'Summary of daily gross revenue, net sales, taxes and discounts' },
    { id: 'payment', title: 'Payment Channel Breakdown', desc: 'Reconciliation of Cash, Card, UPI and online gateway settlements' },
    { id: 'orders', title: 'Order History & Ticket Logs', desc: 'Item-by-item breakdown of all completed and cancelled tickets' },
    { id: 'product', title: 'Product & Category Sales', desc: 'Volume and margin contribution per menu item' },
    { id: 'inventory', title: 'Inventory Consumption & Waste', desc: 'Raw material depletion, stock value and low threshold logs' },
    { id: 'tax', title: 'Tax & GST Filing Summary', desc: 'CGST, SGST and VAT audit summary ready for accounting' },
    { id: 'staff', title: 'Staff Performance & Tips', desc: 'Orders served per waiter, cashier collections and shift times' },
    { id: 'reservation', title: 'Reservation & Footfall Report', desc: 'Covers seated, no-shows and peak hour footfall statistics' }
  ];

  const handleExportCSV = () => {
    alert(`Exporting ${selectedReport.toUpperCase()}_REPORT.csv for ${dateRange}...`);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="p-6 md:p-8 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
            Audit & Export 📄
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Financial & Operational Reports
          </h1>
          <p className="text-xs text-slate-500 font-medium">Export audit-ready CSV spreadsheets and print formal statements for accountants</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer transition-all"
          >
            <Download className="w-4 h-4 text-orange-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrintReport}
            className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm shadow-orange-500/20 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Date Filter Selection */}
      <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
        <span className="text-xs font-bold text-slate-400 uppercase ml-2 mr-1">Period:</span>
        {['Today (Oct 01)', 'Yesterday', 'This Week', 'This Month', 'Custom Date Range'].map(range => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              dateRange === range
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Report Types Grid (Section 31 ASCII) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTypes.map(rpt => {
          const isSelected = selectedReport === rpt.id;
          return (
            <div
              key={rpt.id}
              onClick={() => setSelectedReport(rpt.id)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-start justify-between group ${
                isSelected
                  ? 'bg-orange-50/50 border-orange-400 ring-2 ring-orange-400/20 shadow-xs'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-2xl ${isSelected ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{rpt.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{rpt.desc}</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 transition-transform ${isSelected ? 'text-orange-600 translate-x-1' : 'text-slate-400 group-hover:translate-x-1'}`} />
            </div>
          );
        })}
      </div>

      {/* Report Data Preview Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              {reportTypes.find(r => r.id === selectedReport)?.title}
            </h3>
            <p className="text-xs text-slate-400">Statement for: {dateRange} • {restaurantProfile.name}</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Reconciled
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase">
                <th className="p-3.5 pl-6">Transaction ID</th>
                <th className="p-3.5">Order Type</th>
                <th className="p-3.5">Payment Channel</th>
                <th className="p-3.5">Gross Subtotal</th>
                <th className="p-3.5">GST Tax</th>
                <th className="p-3.5 pr-6 text-right">Net Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {[
                { id: 'TXN-9021', type: 'Dine-In (T-04)', channel: 'UPI (PhonePe)', sub: 840, tax: 42, net: 882 },
                { id: 'TXN-9020', type: 'Dine-In (T-08)', channel: 'Card EDC', sub: 880, tax: 44, net: 924 },
                { id: 'TXN-9019', type: 'Dine-In (T-02)', channel: 'Cash', sub: 760, tax: 38, net: 798 },
                { id: 'TXN-9018', type: 'Takeaway Counter', channel: 'UPI (GPay)', sub: 480, tax: 24, net: 504 },
                { id: 'TXN-9017', type: 'Dine-In (T-05)', channel: 'Cash', sub: 910, tax: 45.5, net: 955.5 }
              ].map(row => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="p-3.5 pl-6 font-mono font-bold text-slate-900">{row.id}</td>
                  <td className="p-3.5">{row.type}</td>
                  <td className="p-3.5 font-bold text-slate-800">{row.channel}</td>
                  <td className="p-3.5">₹{row.sub}</td>
                  <td className="p-3.5 text-slate-500">₹{row.tax}</td>
                  <td className="p-3.5 pr-6 text-right font-black text-slate-900">₹{row.net}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
