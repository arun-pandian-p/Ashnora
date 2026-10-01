import React from 'react';
import { useApp, UserRole } from '../context/AppContext';
import { ShieldCheck, UserCheck, CreditCard, ChefHat, Utensils, Box, ArrowRight, LogOut, Store } from 'lucide-react';

export const RoleSelectScreen: React.FC = () => {
  const { currentUser, setCurrentRole, setCurrentScreen, setActiveTab, restaurantProfile, logout } = useApp();

  const handleSelectRole = (role: UserRole) => {
    setCurrentRole(role);
    // Set appropriate initial active tab based on selected role
    if (role === 'kitchen') {
      setActiveTab('kds');
    } else if (role === 'waiter') {
      setActiveTab('tables');
    } else if (role === 'cashier') {
      setActiveTab('pos');
    } else if (role === 'inventory') {
      setActiveTab('inventory');
    } else {
      setActiveTab('home');
    }
    setCurrentScreen('portal');
  };

  const rolesConfig: Array<{
    role: UserRole;
    title: string;
    icon: string;
    subtitle: string;
    description: string;
    bgClass: string;
    borderClass: string;
    textClass: string;
    badgeClass: string;
  }> = [
    {
      role: 'admin',
      title: 'ADMIN / OWNER',
      icon: '👑',
      subtitle: 'Full Restaurant Control',
      description: 'Restaurant profile, menu, taxes, printers, user permissions, table layouts & reports.',
      bgClass: 'bg-[#FAF5FF] hover:bg-[#F3E8FF]',
      borderClass: 'border-purple-200',
      textClass: 'text-purple-900',
      badgeClass: 'bg-purple-100 text-purple-800'
    },
    {
      role: 'manager',
      title: 'MANAGER',
      icon: '👤',
      subtitle: 'Daily Operations',
      description: 'Real-time sales overview, shift management, live orders, tables & customer reservations.',
      bgClass: 'bg-[#F1F5F9] hover:bg-[#E2E8F0]',
      borderClass: 'border-slate-200',
      textClass: 'text-slate-900',
      badgeClass: 'bg-slate-200 text-slate-800'
    },
    {
      role: 'cashier',
      title: 'BILLING / CASHIER',
      icon: '💳',
      subtitle: 'Fast Counter POS',
      description: 'Quick order taking, barcode scan, split bills, cash/card/UPI & instant thermal receipt print.',
      bgClass: 'bg-[#EFF6FF] hover:bg-[#DBEAFE]',
      borderClass: 'border-blue-200',
      textClass: 'text-blue-900',
      badgeClass: 'bg-blue-100 text-blue-800'
    },
    {
      role: 'kitchen',
      title: 'KITCHEN / KDS',
      icon: '🍳',
      subtitle: 'Kitchen Display System',
      description: 'High-visibility ticket columns, station routing, preparation timers & ready notifications.',
      bgClass: 'bg-[#FFFBEB] hover:bg-[#FEF3C7]',
      borderClass: 'border-amber-200',
      textClass: 'text-amber-900',
      badgeClass: 'bg-amber-100 text-amber-800'
    },
    {
      role: 'waiter',
      title: 'WAITER',
      icon: '🪑',
      subtitle: 'Tableside Service',
      description: 'Floor tables map, guest seating, quick table order taker & direct kitchen transmission.',
      bgClass: 'bg-[#ECFDF5] hover:bg-[#D1FAE5]',
      borderClass: 'border-emerald-200',
      textClass: 'text-emerald-900',
      badgeClass: 'bg-emerald-100 text-emerald-800'
    },
    {
      role: 'inventory',
      title: 'INVENTORY',
      icon: '📦',
      subtitle: 'Stock & Supplies',
      description: 'Raw materials stock tracking, low-inventory alerts, purchase logs & supplier directory.',
      bgClass: 'bg-[#F0FDFA] hover:bg-[#CCFBF1]',
      borderClass: 'border-teal-200',
      textClass: 'text-teal-900',
      badgeClass: 'bg-teal-100 text-teal-800'
    }
  ];

  // Filter roles if user has specific allowedRoles restrictions
  const allowedRoles = currentUser?.allowedRoles || ['admin', 'manager', 'cashier', 'kitchen', 'waiter', 'inventory'];
  const displayRoles = rolesConfig.filter(r => allowedRoles.includes(r.role));

  return (
    <div className="min-h-full flex flex-col justify-between bg-[#FFF8F1] text-[#0F172A] p-6 md:p-10 select-none overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <img
            src="/brand/ashnora-glossy-icon.png"
            alt="Ashnora"
            className="w-9 h-9 object-contain drop-shadow"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div>
            <h1 className="text-xl font-extrabold text-[#0F172A] tracking-tight">Ashnora</h1>
            <div className="flex items-center gap-2 text-xs text-[#475569] font-semibold">
              <Store className="w-3.5 h-3.5 text-[#F97316]" />
              <span>{restaurantProfile.name} • {restaurantProfile.branch}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-[#0F172A]">{currentUser?.name || 'Authenticated User'}</p>
            <p className="text-[11px] text-[#475569] font-medium">{currentUser?.email}</p>
          </div>
          <button
            onClick={logout}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-[#475569] hover:text-rose-600 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            title="Log out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Role Selection Area */}
      <div className="my-8 max-w-5xl mx-auto w-full">
        <div className="text-center mb-8">
          <span className="text-xs font-bold tracking-widest text-[#F97316] uppercase px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200">
            Role Gate
          </span>
          <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mt-2">
            SELECT YOUR ROLE
          </h2>
          <p className="text-sm text-[#475569] font-medium mt-1">
            Choose how you want to continue in Ashnora Restaurant OS
          </p>
        </div>

        {/* 6 Soft Pastel Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayRoles.map((item) => (
            <div
              key={item.role}
              onClick={() => handleSelectRole(item.role)}
              className={`group rounded-3xl ${item.bgClass} border ${item.borderClass} p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${item.badgeClass}`}>
                    {item.subtitle}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-[#0F172A] mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-[#475569] font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/50">
                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0B1F3A] hover:bg-[#F97316] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>CONTINUE</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center pt-4 border-t border-slate-200/80 text-xs text-[#475569] font-medium">
        Ashnora Single-Binary Unified Restaurant Architecture • Role-based access control enabled
      </div>
    </div>
  );
};
