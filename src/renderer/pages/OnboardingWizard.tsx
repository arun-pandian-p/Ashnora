import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BRAND_LOGO, getDishImage } from '../assets/images';
import {
  Sparkles,
  Store,
  Layers,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  DollarSign,
  Percent,
  Check,
  Database
} from 'lucide-react';

export const OnboardingWizard: React.FC = () => {
  const { completeOnboarding, restaurantProfile, menuItems } = useApp();
  const [step, setStep] = useState<number>(1);

  // Form states for Step 2
  const [restaurantName, setRestaurantName] = useState(restaurantProfile.name);
  const [branchName, setBranchName] = useState(restaurantProfile.branch);
  const [phone, setPhone] = useState(restaurantProfile.phone);
  const [email, setEmail] = useState(restaurantProfile.email);
  const [address, setAddress] = useState(restaurantProfile.address);
  const [currency, setCurrency] = useState(restaurantProfile.currency);
  const [taxRate, setTaxRate] = useState(restaurantProfile.taxRate);

  // Admin Account state for Step 4
  const [adminName, setAdminName] = useState('Arun Pandian');
  const [adminEmail, setAdminEmail] = useState('admin@prepville.com');
  const [adminPassword, setAdminPassword] = useState('••••••••');

  // Step 5 Sync progress simulation
  const [syncStep, setSyncStep] = useState<number>(0);

  const startSyncSimulation = () => {
    setStep(5);
    setSyncStep(1);

    setTimeout(() => setSyncStep(2), 600);
    setTimeout(() => setSyncStep(3), 1200);
    setTimeout(() => setSyncStep(4), 1800);
    setTimeout(() => setSyncStep(5), 2400);
    setTimeout(() => {
      setSyncStep(6);
      setTimeout(() => setStep(6), 800);
    }, 3000);
  };

  const handleFinish = () => {
    completeOnboarding({
      name: restaurantName,
      branch: branchName,
      phone,
      email,
      address,
      currency,
      taxRate: Number(taxRate)
    });
  };

  return (
    <div className="min-h-full w-full bg-[#FFF8F1] text-[#0F172A] flex flex-col justify-between p-6 md:p-10 select-none relative overflow-y-auto">
      {/* Top Brand Header */}
      <div className="flex items-center justify-between max-w-4xl w-full mx-auto mb-6">
        <div className="flex items-center gap-2.5">
          <img
            src={BRAND_LOGO}
            alt="Ashnora"
            className="w-8 h-8 object-contain drop-shadow"
          />
          <div>
            <span className="text-xl font-black text-[#0B1F3A] tracking-tight block leading-none">
              Ashnora
            </span>
            <span className="text-[10px] font-bold text-[#F97316] uppercase tracking-widest block mt-0.5">
              Restaurant OS Setup
            </span>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-7 bg-[#F97316]'
                  : s < step
                  ? 'w-2.5 bg-emerald-500'
                  : 'w-2.5 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Card Container */}
      <div className="max-w-2xl w-full mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 md:p-10 backdrop-blur-xl relative">
        {/* STEP 1: Welcome */}
        {step === 1 && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200/60 text-[#F97316] flex items-center justify-center mx-auto mb-5 shadow-inner">
              <Sparkles className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold text-[#F97316] uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-200/60">
              Initial Setup Wizard
            </span>
            <h1 className="text-3xl font-black text-[#0B1F3A] tracking-tight mt-3 mb-3">
              Welcome to Ashnora
            </h1>
            <p className="text-base text-slate-600 font-medium leading-relaxed max-w-lg mx-auto mb-8">
              Your complete, high-performance Restaurant Operating System. Let's connect your restaurant, import your customer menu, and set up your local offline database.
            </p>

            <button
              onClick={() => setStep(2)}
              className="px-8 py-3.5 rounded-xl bg-[#F97316] hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/20 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Restaurant Profile & Identification */}
        {step === 2 && (
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#F97316] flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#0B1F3A]">Restaurant Information</h2>
                <p className="text-xs text-slate-500 font-medium">Verify your restaurant identity and operational details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-500 uppercase tracking-wider mb-1">Restaurant Name</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 uppercase tracking-wider mb-1">Branch</label>
                <input
                  type="text"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 uppercase tracking-wider mb-1">Official Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-500 uppercase tracking-wider mb-1">Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 uppercase tracking-wider mb-1">Currency</label>
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase tracking-wider mb-1">Tax Rate (%)</label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#152e50] text-white text-xs font-bold flex items-center gap-2"
              >
                Continue <ArrowRight className="w-4 h-4 text-[#F97316]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Customer Menu Auto-Import */}
        {step === 3 && (
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#F97316] flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#0B1F3A]">Customer Menu Synchronization</h2>
                <p className="text-xs text-slate-500 font-medium">Auto-importing online catalog into local POS and KDS</p>
              </div>
            </div>

            <div className="bg-orange-50/70 border border-orange-200/70 rounded-2xl p-4 mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-orange-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Found {menuItems.length} active menu items in Supabase
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-orange-200 text-orange-700">
                  Shared IDs Linked
                </span>
              </div>
              <p className="text-xs text-slate-600">
                All categories, prices, images, taxes, variants, and product descriptions are automatically mapped to your local database without creating duplicate entries.
              </p>
            </div>

            {/* Quick Preview Grid with Realistic Food Images */}
            <div className="grid grid-cols-2 gap-2.5 mb-6 max-h-56 overflow-y-auto pr-1">
              {menuItems.slice(0, 8).map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs">
                  <img
                    src={getDishImage(item.name || item.image)}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-xl shadow-xs shrink-0"
                  />
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold text-slate-900 block truncate">{item.name}</span>
                    <span className="text-[11px] font-semibold text-orange-600">{restaurantProfile.currencySymbol}{item.price}</span>
                    <span className="text-[10px] text-slate-400 block -mt-0.5">{item.category}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#152e50] text-white text-xs font-bold flex items-center gap-2"
              >
                Approve & Continue <ArrowRight className="w-4 h-4 text-[#F97316]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Owner / Admin Account Setup */}
        {step === 4 && (
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#F97316] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#0B1F3A]">Primary Admin Authorization</h2>
                <p className="text-xs text-slate-500 font-medium">Set the master credentials for this desktop terminal</p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase tracking-wider mb-1">Admin Email</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase tracking-wider mb-1">Master Password</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={startSyncSimulation}
                className="px-6 py-2.5 rounded-xl bg-[#F97316] hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-orange-500/20"
              >
                Start Database Sync <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Initial Sync & Offline Store Creation */}
        {step === 5 && (
          <div className="py-4">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#F97316] flex items-center justify-center mx-auto mb-3">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
              <h2 className="text-xl font-black text-[#0B1F3A]">Initializing Desktop OS</h2>
              <p className="text-xs text-slate-500 font-medium">Building local offline SQLite storage and synchronizing data...</p>
            </div>

            <div className="space-y-3 max-w-md mx-auto text-xs font-semibold">
              <div className={`p-3 rounded-xl border flex items-center justify-between ${syncStep >= 1 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                <span>1. Connected to Supabase Cloud Registry</span>
                {syncStep >= 1 && <Check className="w-4 h-4 text-emerald-600" />}
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between ${syncStep >= 2 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                <span>2. Downloading Restaurant Configuration</span>
                {syncStep >= 2 && <Check className="w-4 h-4 text-emerald-600" />}
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between ${syncStep >= 3 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                <span>3. Customer Menu & Products Imported</span>
                {syncStep >= 3 && <Check className="w-4 h-4 text-emerald-600" />}
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between ${syncStep >= 4 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                <span>4. Staff & Role Permissions Cached</span>
                {syncStep >= 4 && <Check className="w-4 h-4 text-emerald-600" />}
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between ${syncStep >= 5 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                <span>5. Local Encrypted SQLite Database Ready</span>
                {syncStep >= 5 && <Check className="w-4 h-4 text-emerald-600" />}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Setup Complete */}
        {step === 6 && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-black text-[#0B1F3A] mb-2">
              Your Ashnora System is Ready
            </h2>

            <p className="text-sm text-slate-600 font-medium max-w-md mx-auto mb-8 leading-relaxed">
              All restaurant modules, offline storage, hardware hooks, and menu items are synchronized. You can now launch Ashnora.
            </p>

            <button
              onClick={handleFinish}
              className="px-8 py-3.5 rounded-xl bg-[#F97316] hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Open Ashnora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="py-2 text-center text-[10px] text-slate-400">
        Ashnora Installation Wizard • Hardware-Safe Local Database
      </div>
    </div>
  );
};
