import React from 'react';
import { 
  LayoutGrid, 
  UtensilsCrossed, 
  ChefHat, 
  Boxes, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings 
} from 'lucide-react';

export type DesktopTab = 'pos' | 'orders' | 'kds' | 'inventory' | 'staff' | 'payments' | 'analytics' | 'settings';

interface DesktopNavProps {
  currentTab: DesktopTab;
  onTabChange: (tab: DesktopTab) => void;
}

export const DesktopNav: React.FC<DesktopNavProps> = ({ currentTab, onTabChange }) => {
  const navItems: { id: DesktopTab; label: string; icon: React.ReactNode }[] = [
    { id: 'pos', label: 'Point of Sale', icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'orders', label: 'Orders & Tables', icon: <UtensilsCrossed className="w-5 h-5" /> },
    { id: 'kds', label: 'Kitchen (KDS)', icon: <ChefHat className="w-5 h-5" /> },
    { id: 'inventory', label: 'Inventory', icon: <Boxes className="w-5 h-5" /> },
    { id: 'staff', label: 'Staff & Roles', icon: <Users className="w-5 h-5" /> },
    { id: 'payments', label: 'Payments & Split', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'settings', label: 'POS Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-[#0B1F3A] border-r border-white/5 flex flex-col justify-between p-3 select-none flex-shrink-0">
      <div className="space-y-1">
        <div className="px-3 py-2 mb-2">
          <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Restaurant Operations</p>
        </div>
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-3 bg-black/20 rounded-xl border border-white/5">
        <p className="text-xs text-slate-400 font-medium">Local SQLite Store</p>
        <p className="text-[11px] text-emerald-400 mt-0.5">● Offline Transaction Engine Active</p>
      </div>
    </aside>
  );
};
