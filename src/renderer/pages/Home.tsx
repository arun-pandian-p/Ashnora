import React from 'react';
import { useApp, UserRole } from '../context/AppContext';
import { ChefHat, Users, CreditCard, Settings, Utensils, ArrowRight } from 'lucide-react';
import { BRAND_LOGO, HERO_FOOD_PLATE, HOME_HERO_BANNER } from '../assets/images';

export const HomeScreen: React.FC = () => {
  const { setCurrentScreen, setCurrentRole } = useApp();

  const handleOpenRole = (role: UserRole) => {
    setCurrentRole(role);
    setCurrentScreen('login');
  };

  return (
    <div className="min-h-full w-full bg-[#FDFBF7] text-[#0F172A] p-6 md:p-8 flex flex-col justify-between select-none overflow-x-hidden overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <img
            src={BRAND_LOGO}
            alt="Ashnora"
            className="w-8 h-8 object-contain drop-shadow"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-[#0B1F3A] tracking-tight">Ashnora</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100/80 text-[#F97316] border border-orange-200">
                v1.0.6
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#F97316] uppercase tracking-widest block -mt-0.5">
              Restaurant OS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('login')}
            className="px-4 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#132c4f] text-white text-xs font-bold shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Sign In</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F97316]" />
          </button>
        </div>
      </div>

      {/* Hero Welcome Banner (Centered Image) */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-sm border border-orange-100/80 mb-6 bg-gradient-to-r from-[#FFFDF9] via-[#FFF8F0] to-[#FFEFE0] flex items-center justify-center">
        <img
          src={HOME_HERO_BANNER}
          alt="Welcome to Ashnora - Scan, Order, Track, Pay"
          className="w-full h-auto max-h-[320px] object-cover md:object-contain rounded-3xl"
        />
      </div>

      {/* 4 Pastel Role Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6">
        {/* 1. Kitchen Card */}
        <div
          onClick={() => handleOpenRole('kitchen')}
          className="group relative bg-white hover:bg-sky-50/40 rounded-2xl border border-slate-100 hover:border-sky-200 p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden min-h-[160px]"
        >
          <div className="relative z-10">
            <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ChefHat className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-[#0B1F3A] mb-1">Kitchen</h3>
            <p className="text-xs text-slate-500 font-medium">Manage orders & prep times</p>
          </div>

          <div className="relative z-10 mt-6 flex items-center gap-1.5 text-xs font-bold text-sky-600 group-hover:text-sky-700">
            <span>Open Kitchen</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Corner Watermark */}
          <div className="absolute -bottom-4 -right-4 w-20 h-20 text-sky-200/40 pointer-events-none transition-transform group-hover:scale-110">
            <ChefHat className="w-full h-full" />
          </div>
        </div>

        {/* 2. Waiter Card */}
        <div
          onClick={() => handleOpenRole('waiter')}
          className="group relative bg-white hover:bg-purple-50/40 rounded-2xl border border-slate-100 hover:border-purple-200 p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden min-h-[160px]"
        >
          <div className="relative z-10">
            <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-[#0B1F3A] mb-1">Waiter</h3>
            <p className="text-xs text-slate-500 font-medium">Tables, calls & order tracking</p>
          </div>

          <div className="relative z-10 mt-6 flex items-center gap-1.5 text-xs font-bold text-purple-600 group-hover:text-purple-700">
            <span>Open Waiter</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Corner Watermark */}
          <div className="absolute -bottom-4 -right-4 w-20 h-20 text-purple-200/40 pointer-events-none transition-transform group-hover:scale-110">
            <Utensils className="w-full h-full" />
          </div>
        </div>

        {/* 3. Billing Card */}
        <div
          onClick={() => handleOpenRole('cashier')}
          className="group relative bg-white hover:bg-emerald-50/40 rounded-2xl border border-slate-100 hover:border-emerald-200 p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden min-h-[160px]"
        >
          <div className="relative z-10">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-[#0B1F3A] mb-1">Billing</h3>
            <p className="text-xs text-slate-500 font-medium">Process payments & receipts</p>
          </div>

          <div className="relative z-10 mt-6 flex items-center gap-1.5 text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
            <span>Open Billing</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Corner Watermark */}
          <div className="absolute -bottom-4 -right-4 w-20 h-20 text-emerald-200/40 pointer-events-none transition-transform group-hover:scale-110">
            <CreditCard className="w-full h-full" />
          </div>
        </div>

        {/* 4. Admin Card */}
        <div
          onClick={() => handleOpenRole('admin')}
          className="group relative bg-white hover:bg-violet-50/40 rounded-2xl border border-slate-100 hover:border-violet-200 p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden min-h-[160px]"
        >
          <div className="relative z-10">
            <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Settings className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-[#0B1F3A] mb-1">Admin</h3>
            <p className="text-xs text-slate-500 font-medium">Manage restaurant settings</p>
          </div>

          <div className="relative z-10 mt-6 flex items-center gap-1.5 text-xs font-bold text-violet-600 group-hover:text-violet-700">
            <span>Open Admin</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Corner Watermark */}
          <div className="absolute -bottom-4 -right-4 w-20 h-20 text-violet-200/40 pointer-events-none transition-transform group-hover:scale-110">
            <Settings className="w-full h-full" />
          </div>
        </div>
      </div>

      {/* Bottom Card: System Features */}
      <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-xs p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left Section */}
        <div className="w-full lg:w-1/4">
          <div className="w-8 h-1 bg-[#F97316] rounded-full mb-2" />
          <h2 className="text-lg font-black text-[#0B1F3A]">System Features</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Everything you need to run your restaurant smoothly.
          </p>
        </div>

        {/* Center 4 Feature Items */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-2/4">
          {/* Digital Menu */}
          <div className="flex flex-col items-center text-center p-2">
            <div className="w-9 h-9 rounded-xl bg-orange-100/80 text-[#F97316] flex items-center justify-center mb-2">
              <Utensils className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#0B1F3A]">Digital Menu</span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">Online menu & QR ordering</span>
          </div>

          {/* Kitchen Display */}
          <div className="flex flex-col items-center text-center p-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-amber-600 flex items-center justify-center mb-2">
              <ChefHat className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#0B1F3A]">Kitchen Display</span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">Real-time kitchen orders</span>
          </div>

          {/* Waiter Tablet */}
          <div className="flex flex-col items-center text-center p-2">
            <div className="w-9 h-9 rounded-xl bg-purple-100/80 text-purple-600 flex items-center justify-center mb-2">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#0B1F3A]">Waiter Tablet</span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">Table management</span>
          </div>

          {/* POS Billing */}
          <div className="flex flex-col items-center text-center p-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center mb-2">
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#0B1F3A]">POS Billing</span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">Fast & secure payments</span>
          </div>
        </div>

        {/* Right Section: Streamline Your Restaurant */}
        <div
          onClick={() => setCurrentScreen('login')}
          className="w-full lg:w-1/4 flex items-center justify-center lg:justify-end gap-3 cursor-pointer group p-2"
        >
          <div className="text-right">
            <span className="block font-serif italic font-bold text-sm md:text-base text-[#F97316] leading-tight group-hover:underline">
              Streamline
            </span>
            <span className="block font-serif italic font-bold text-sm md:text-base text-[#F97316] leading-tight">
              Your Restaurant
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#F97316] group-hover:bg-orange-600 text-white flex items-center justify-center shadow-sm group-hover:shadow transition-all group-hover:scale-105">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
