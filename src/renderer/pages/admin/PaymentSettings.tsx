import React, { useState } from 'react';
import { CreditCard, DollarSign, QrCode, CheckCircle2, Sliders, Shield, Zap } from 'lucide-react';

export const PaymentSettings: React.FC = () => {
  const [methods, setMethods] = useState([
    { id: 'cash', name: 'Cash at Counter', type: 'Offline Cash Drawer', status: true, fee: '0%' },
    { id: 'upi', name: 'Dynamic UPI QR (PhonePe / GPay / Paytm)', type: 'Instant Bank Sync', status: true, fee: '0%' },
    { id: 'card', name: 'Card Terminal (POS EDC Machine)', type: 'PineLabs / Mosambee / Razorpay', status: true, fee: '1.2%' },
    { id: 'online', name: 'Direct Table QR Online Checkout', type: 'Razorpay / Cashfree Gateway', status: true, fee: '1.8%' }
  ]);

  const toggleMethod = (id: string) => {
    setMethods(prev =>
      prev.map(m => (m.id === id ? { ...m, status: !m.status } : m))
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 select-none space-y-6">
      <div className="pb-6 border-b border-slate-100">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Payment Gateways & Counter Modes</h2>
        <p className="text-xs text-slate-500 font-medium">Configure payment channels, merchant UPI IDs, EDC card swipe integration & rules</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {methods.map((method) => (
          <div
            key={method.id}
            className={`p-5 rounded-2xl border transition-all flex items-start justify-between ${
              method.status ? 'bg-white border-slate-200/80 shadow-2xs' : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className={`p-2.5 rounded-xl ${method.status ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
                {method.id === 'cash' && <DollarSign className="w-5 h-5" />}
                {method.id === 'upi' && <QrCode className="w-5 h-5" />}
                {method.id === 'card' && <CreditCard className="w-5 h-5" />}
                {method.id === 'online' && <Zap className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{method.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{method.type}</p>
                <span className="inline-block text-[10px] font-bold text-slate-400 mt-2 bg-slate-100 px-2 py-0.5 rounded-md">
                  Processing Fee: {method.fee}
                </span>
              </div>
            </div>

            <button
              onClick={() => toggleMethod(method.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                method.status
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {method.status ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>
        ))}
      </div>

      <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-center gap-3 text-xs text-amber-900 font-medium">
        <Shield className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <span>
          Payment transactions are encrypted and synced locally in offline mode before pushing to cloud reconciliation.
        </span>
      </div>
    </div>
  );
};
