import React from 'react';
import { useApp, UserRole } from '../context/AppContext';
import { BRAND_LOGO } from '../assets/images';
import {
  Home,
  CreditCard,
  ShoppingCart,
  ChefHat,
  Box,
  Users,
  LayoutGrid,
  Calendar,
  UserCheck,
  BarChart3,
  FileText,
  Sliders,
  Settings,
  Bell,
  LogOut,
  Sparkles,
  Printer,
  Receipt,
  DollarSign,
  Shield,
  Layers,
  Percent,
  UploadCloud,
  Truck,
  Package,
  Cpu,
  RefreshCw,
  Wifi,
  WifiOff,
  Info
} from 'lucide-react';

interface SidebarSection {
  title?: string;
  items: {
    id: string;
    label: string;
    icon: React.ReactNode;
  }[];
}

export const PortalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentUser,
    currentRole,
    activeTab,
    setActiveTab,
    restaurantProfile,
    setCurrentScreen,
    logout,
    orders,
    syncState,
    syncCount,
    triggerSync
  } = useApp();

  // Role-Based Navigation Sections
  const getSectionsForRole = (): SidebarSection[] => {
    switch (currentRole) {
      case 'admin':
        return [
          {
            items: [
              { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> }
            ]
          },
          {
            title: 'SALES',
            items: [
              { id: 'pos', label: 'POS / Billing', icon: <CreditCard className="w-4 h-4" /> },
              { id: 'orders', label: 'Orders', icon: <ShoppingCart className="w-4 h-4" /> },
              { id: 'payments', label: 'Payments', icon: <DollarSign className="w-4 h-4" /> }
            ]
          },
          {
            title: 'OPERATIONS',
            items: [
              { id: 'kds', label: 'Kitchen / KDS', icon: <ChefHat className="w-4 h-4" /> },
              { id: 'tables', label: 'Tables', icon: <LayoutGrid className="w-4 h-4" /> },
              { id: 'reservations', label: 'Reservations', icon: <Calendar className="w-4 h-4" /> },
              { id: 'waiter', label: 'Waiter', icon: <Users className="w-4 h-4" /> }
            ]
          },
          {
            title: 'INVENTORY',
            items: [
              { id: 'inventory', label: 'Inventory', icon: <Box className="w-4 h-4" /> },
              { id: 'purchases', label: 'Purchases', icon: <Truck className="w-4 h-4" /> },
              { id: 'suppliers', label: 'Suppliers', icon: <Package className="w-4 h-4" /> },
              { id: 'stock', label: 'Stock', icon: <Layers className="w-4 h-4" /> }
            ]
          },
          {
            title: 'CUSTOMERS',
            items: [
              { id: 'customers', label: 'Customers', icon: <UserCheck className="w-4 h-4" /> },
              { id: 'customer_menu', label: 'Customer Menu', icon: <Layers className="w-4 h-4" /> }
            ]
          },
          {
            title: 'ANALYTICS',
            items: [
              { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> }
            ]
          },
          {
            title: 'ADMINISTRATION',
            items: [
              { id: 'staff', label: 'Staff & Users', icon: <Users className="w-4 h-4" /> },
              { id: 'restaurant_settings', label: 'Restaurant Settings', icon: <Settings className="w-4 h-4" /> },
              { id: 'admin_menu', label: 'Menu Management', icon: <Layers className="w-4 h-4" /> },
              { id: 'taxes', label: 'Taxes', icon: <Percent className="w-4 h-4" /> },
              { id: 'payment_settings', label: 'Payment Settings', icon: <DollarSign className="w-4 h-4" /> },
              { id: 'billing_settings', label: 'Billing Settings', icon: <Receipt className="w-4 h-4" /> },
              { id: 'printers', label: 'Printers', icon: <Printer className="w-4 h-4" /> },
              { id: 'kds_settings', label: 'KDS Settings', icon: <ChefHat className="w-4 h-4" /> },
              { id: 'hardware', label: 'Hardware', icon: <Cpu className="w-4 h-4" /> },
              { id: 'security', label: 'Security & Diagnostics', icon: <Shield className="w-4 h-4" /> },
              { id: 'about', label: 'About Ashnora', icon: <Info className="w-4 h-4" /> }
            ]
          },
          {
            title: 'IMPORT / DOCUMENTS',
            items: [
              { id: 'documents', label: 'Upload Documents', icon: <UploadCloud className="w-4 h-4" /> }
            ]
          }
        ];

      case 'manager':
        return [
          {
            items: [
              { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> }
            ]
          },
          {
            title: 'SALES',
            items: [
              { id: 'pos', label: 'POS / Billing', icon: <CreditCard className="w-4 h-4" /> },
              { id: 'orders', label: 'Orders', icon: <ShoppingCart className="w-4 h-4" /> },
              { id: 'payments', label: 'Payments', icon: <DollarSign className="w-4 h-4" /> }
            ]
          },
          {
            title: 'OPERATIONS',
            items: [
              { id: 'kds', label: 'Kitchen / KDS', icon: <ChefHat className="w-4 h-4" /> },
              { id: 'tables', label: 'Tables', icon: <LayoutGrid className="w-4 h-4" /> },
              { id: 'reservations', label: 'Reservations', icon: <Calendar className="w-4 h-4" /> }
            ]
          },
          {
            title: 'INVENTORY & STAFF',
            items: [
              { id: 'inventory', label: 'Inventory', icon: <Box className="w-4 h-4" /> },
              { id: 'customers', label: 'Customers', icon: <UserCheck className="w-4 h-4" /> },
              { id: 'staff', label: 'Staff', icon: <Users className="w-4 h-4" /> },
              { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> }
            ]
          }
        ];

      case 'cashier':
        return [
          {
            items: [
              { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> }
            ]
          },
          {
            title: 'BILLING COUNTER',
            items: [
              { id: 'pos', label: 'POS / Billing', icon: <CreditCard className="w-4 h-4" /> },
              { id: 'orders', label: 'Orders', icon: <ShoppingCart className="w-4 h-4" /> },
              { id: 'payments', label: 'Payments', icon: <DollarSign className="w-4 h-4" /> }
            ]
          }
        ];

      case 'kitchen':
        return [
          {
            items: [
              { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> }
            ]
          },
          {
            title: 'KITCHEN DISPLAY',
            items: [
              { id: 'kds', label: 'Kitchen / KDS', icon: <ChefHat className="w-4 h-4" /> },
              { id: 'orders', label: 'Kitchen Orders', icon: <ShoppingCart className="w-4 h-4" /> }
            ]
          }
        ];

      case 'waiter':
        return [
          {
            items: [
              { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> }
            ]
          },
          {
            title: 'FLOOR SERVICE',
            items: [
              { id: 'tables', label: 'Tables', icon: <LayoutGrid className="w-4 h-4" /> },
              { id: 'orders', label: 'Orders', icon: <ShoppingCart className="w-4 h-4" /> },
              { id: 'reservations', label: 'Reservations', icon: <Calendar className="w-4 h-4" /> },
              { id: 'customers', label: 'Customers', icon: <UserCheck className="w-4 h-4" /> }
            ]
          }
        ];

      case 'inventory':
        return [
          {
            items: [
              { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> }
            ]
          },
          {
            title: 'INVENTORY CONTROL',
            items: [
              { id: 'inventory', label: 'Inventory', icon: <Box className="w-4 h-4" /> },
              { id: 'purchases', label: 'Purchases', icon: <Truck className="w-4 h-4" /> },
              { id: 'suppliers', label: 'Suppliers', icon: <Package className="w-4 h-4" /> },
              { id: 'stock', label: 'Stock', icon: <Layers className="w-4 h-4" /> },
              { id: 'reports', label: 'Inventory Reports', icon: <FileText className="w-4 h-4" /> }
            ]
          }
        ];

      default:
        return [];
    }
  };

  const sections = getSectionsForRole();

  return (
    <div className="flex h-[calc(100vh-40px)] w-full overflow-hidden bg-slate-50 select-none">
      {/* FIXED NAVY SIDEBAR (NO COLLAPSE, 250px) */}
      <aside className="w-[250px] shrink-0 bg-[#0B1F3A] text-slate-300 flex flex-col justify-between border-r border-white/10 z-30">
        {/* Header Branding */}
        <div>
          <div className="h-16 px-5 flex items-center gap-3 border-b border-white/10">
            <img
              src={BRAND_LOGO}
              alt="Ashnora Logo"
              className="w-7 h-7 object-contain drop-shadow"
            />
            <div>
              <span className="text-sm font-black text-white tracking-wider block leading-none">
                ASHNORA
              </span>
              <span className="text-[10px] font-bold text-[#F97316] uppercase tracking-widest block mt-0.5">
                RESTAURANT OS
              </span>
            </div>
          </div>

          {/* Navigation Links (Grouped by Category) */}
          <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-210px)] custom-scrollbar text-xs">
            {sections.map((sec, sIdx) => (
              <div key={sIdx} className="space-y-1">
                {sec.title && (
                  <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {sec.title}
                  </div>
                )}
                {sec.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all text-left cursor-pointer ${
                        isActive
                          ? 'bg-white/10 text-white font-bold shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-[#F97316]' : 'text-slate-400'}>
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer (Status, Version, Current User, Logout) */}
        <div className="p-3 border-t border-white/10 bg-black/20 text-xs">
          {/* Status badge */}
          <div className="flex items-center justify-between px-2 py-1 mb-2 text-[11px] text-slate-400">
            <span className="font-mono">v1.0.6 • Terminal</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
          </div>

          {/* Current User Info */}
          <div className="flex items-center justify-between px-2 py-2 rounded-xl bg-white/5 border border-white/5 mb-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-[#F97316] font-black flex items-center justify-center text-xs">
                {currentUser?.name?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-bold text-white block truncate">{currentUser?.name || 'Authorized User'}</span>
                <span className="text-[10px] font-bold text-orange-400 uppercase block">{currentRole}</span>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FFF8F1]">
        {/* Top Bar */}
        <header className="h-14 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 shadow-2xs z-20">
          <div className="flex items-center gap-3">
            <span className="text-sm font-extrabold text-[#0B1F3A]">
              {restaurantProfile.name}
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
              • {restaurantProfile.branch}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Sync Button */}
            <button
              onClick={triggerSync}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#F97316] ${syncState === 'SYNCING' ? 'animate-spin' : ''}`} />
              <span>{syncCount > 0 ? `${syncCount} Pending` : 'Synced'}</span>
            </button>

            {/* Role Badge */}
            <span className="px-2.5 py-1 rounded-xl bg-orange-50 border border-orange-200 text-[#F97316] font-bold uppercase text-[11px]">
              {currentRole}
            </span>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto bg-[#FFF8F1]">
          {children}
        </main>
      </div>
    </div>
  );
};
