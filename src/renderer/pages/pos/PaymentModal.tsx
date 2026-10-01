import React, { useState } from 'react';
import { useApp, Order } from '../../context/AppContext';
import { CreditCard, DollarSign, QrCode, Printer, CheckCircle2, X, ArrowRight, ShieldCheck } from 'lucide-react';

interface PaymentModalProps {
  order: Order;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ order, onClose, onPaymentSuccess }) => {
  const { restaurantProfile, completeOrderPayment, printReceipt } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('cash');
  const [cashReceived, setCashReceived] = useState<number>(order.total);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPrinted, setIsPrinted] = useState(false);

  const changeAmount = Math.max(0, cashReceived - order.total);

  const handleComplete = async () => {
    setIsProcessing(true);
    completeOrderPayment(order.id, paymentMethod, paymentMethod === 'cash' ? cashReceived : undefined);
    
    // Auto-print thermal receipt if requested
    try {
      await printReceipt(order);
      setIsPrinted(true);
    } catch (e) {
      console.error(e);
    }

    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 600);
  };

  const handlePrintOnly = async () => {
    await printReceipt(order);
    setIsPrinted(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in select-none">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 md:p-8 max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">COMPLETE PAYMENT</h3>
            <p className="text-xs text-slate-500 font-medium">Order {order.orderNumber} • Table {order.tableNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Total Price Banner (Section 22 ASCII) */}
        <div className="my-6 p-5 rounded-2xl bg-orange-50 border border-orange-200 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-700">Total Payable Amount</span>
          <div className="text-4xl font-black text-slate-900 mt-1">
            {restaurantProfile.currencySymbol}{order.total}
          </div>
        </div>

        {/* Payment Methods Tabs */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setPaymentMethod('cash')}
            className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1.5 font-extrabold text-xs transition-all cursor-pointer ${
              paymentMethod === 'cash'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <DollarSign className="w-5 h-5" />
            <span>CASH</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1.5 font-extrabold text-xs transition-all cursor-pointer ${
              paymentMethod === 'card'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span>CARD</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('upi')}
            className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1.5 font-extrabold text-xs transition-all cursor-pointer ${
              paymentMethod === 'upi'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <QrCode className="w-5 h-5" />
            <span>UPI QR</span>
          </button>
        </div>

        {/* Cash Tender Input & Change Calculator */}
        {paymentMethod === 'cash' && (
          <div className="space-y-4 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Cash Received (₹)
              </label>
              <input
                type="number"
                value={cashReceived}
                onChange={(e) => setCashReceived(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-lg font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                min={order.total}
              />
            </div>

            {/* Change Due Display */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
              <span className="font-bold text-slate-600 uppercase">Change Due to Customer:</span>
              <span className="text-base font-black text-emerald-600">
                {restaurantProfile.currencySymbol}{changeAmount}
              </span>
            </div>
          </div>
        )}

        {/* UPI QR Display */}
        {paymentMethod === 'upi' && (
          <div className="text-center p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6 flex flex-col items-center">
            <div className="w-32 h-32 bg-white p-2 rounded-xl border border-slate-300 shadow-2xs mb-2 flex items-center justify-center">
              <QrCode className="w-24 h-24 text-slate-900" />
            </div>
            <p className="text-xs font-bold text-slate-700">Scan to pay {restaurantProfile.currencySymbol}{order.total}</p>
            <p className="text-[10px] text-slate-400">Merchant UPI: ashnora@icici</p>
          </div>
        )}

        {/* Card EDC Display */}
        {paymentMethod === 'card' && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6 text-center text-xs text-slate-600 font-medium">
            <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="font-bold text-slate-900">Insert / Tap Card on EDC Terminal</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Amount ₹{order.total} automatically pushed to machine.</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleComplete}
            disabled={isProcessing || (paymentMethod === 'cash' && cashReceived < order.total)}
            className="w-full py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm shadow-md shadow-orange-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{isProcessing ? 'PROCESSING...' : 'COMPLETE PAYMENT'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handlePrintOnly}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>PRINT RECEIPT ONLY</span>
          </button>
        </div>
      </div>
    </div>
  );
};
