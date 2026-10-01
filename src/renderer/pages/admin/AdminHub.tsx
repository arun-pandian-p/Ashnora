import React, { useState } from 'react';
import {
  Store,
  Users,
  Layers,
  Percent,
  CreditCard,
  Receipt,
  Printer,
  ChefHat,
  LayoutGrid,
  Calendar,
  Box,
  Bell,
  Clock,
  Settings,
  ChevronRight
} from 'lucide-react';
import { RestaurantProfile } from './RestaurantProfile';
import { UsersAndRoles } from './UsersAndRoles';
import { MenuManagement } from './MenuManagement';
import { TaxSettings } from './TaxSettings';
import { PaymentSettings } from './PaymentSettings';
import { BillingSettings } from './BillingSettings';
import { PrinterManagement } from './PrinterManagement';
import { KDSSettings } from './KDSSettings';
import { TableSettings } from './TableSettings';
import { ReservationSettings } from './ReservationSettings';
import { InventorySettings } from './InventorySettings';
import { NotificationSettings } from './NotificationSettings';
import { BusinessHours } from './BusinessHours';
import { RestaurantPreferences } from './RestaurantPreferences';
import { SecurityDiagnostics } from './SecurityDiagnostics';
import { AboutAshnora } from './AboutAshnora';
import { QRCodeCenter } from './QRCodeCenter';
import { ShieldCheck, Info, QrCode } from 'lucide-react';

export type AdminSection =
  | 'profile'
  | 'qr'
  | 'users'
  | 'menu'
  | 'taxes'
  | 'payments'
  | 'billing'
  | 'printers'
  | 'kds'
  | 'tables'
  | 'reservations'
  | 'inventory'
  | 'notifications'
  | 'hours'
  | 'preferences'
  | 'security'
  | 'about';

export const AdminHub: React.FC<{ initialSection?: AdminSection }> = ({ initialSection = 'profile' }) => {
  const [activeSection, setActiveSection] = useState<AdminSection>(initialSection);

  const sections: Array<{ id: AdminSection; title: string; icon: React.ReactNode }> = [
    { id: 'profile', title: 'Restaurant Profile', icon: <Store className="w-4 h-4" /> },
    { id: 'qr', title: 'QR Codes & Web Menu', icon: <QrCode className="w-4 h-4 text-orange-500" /> },
    { id: 'users', title: 'Users & Roles', icon: <Users className="w-4 h-4" /> },
    { id: 'menu', title: 'Menu & Products', icon: <Layers className="w-4 h-4" /> },
    { id: 'taxes', title: 'Taxes', icon: <Percent className="w-4 h-4" /> },
    { id: 'payments', title: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'billing', title: 'Billing Settings', icon: <Receipt className="w-4 h-4" /> },
    { id: 'printers', title: 'Printers & Hardware', icon: <Printer className="w-4 h-4" /> },
    { id: 'kds', title: 'KDS Settings', icon: <ChefHat className="w-4 h-4" /> },
    { id: 'tables', title: 'Table Settings', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'reservations', title: 'Reservation Settings', icon: <Calendar className="w-4 h-4" /> },
    { id: 'inventory', title: 'Inventory Settings', icon: <Box className="w-4 h-4" /> },
    { id: 'notifications', title: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'hours', title: 'Business Hours', icon: <Clock className="w-4 h-4" /> },
    { id: 'preferences', title: 'Preferences', icon: <Settings className="w-4 h-4" /> },
    { id: 'security', title: 'Security & Diagnostics', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'about', title: 'About', icon: <Info className="w-4 h-4" /> }
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 select-none">
      {/* Sub-navigation pill menu */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {sections.map(sec => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span className={isActive ? 'text-orange-400' : 'text-slate-400'}>{sec.icon}</span>
                <span>{sec.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Subscreen */}
      <div className="animate-in fade-in">
        {activeSection === 'profile' && <RestaurantProfile />}
        {activeSection === 'qr' && <QRCodeCenter />}
        {activeSection === 'users' && <UsersAndRoles />}
        {activeSection === 'menu' && <MenuManagement />}
        {activeSection === 'taxes' && <TaxSettings />}
        {activeSection === 'payments' && <PaymentSettings />}
        {activeSection === 'billing' && <BillingSettings />}
        {activeSection === 'printers' && <PrinterManagement />}
        {activeSection === 'kds' && <KDSSettings />}
        {activeSection === 'tables' && <TableSettings />}
        {activeSection === 'reservations' && <ReservationSettings />}
        {activeSection === 'inventory' && <InventorySettings />}
        {activeSection === 'notifications' && <NotificationSettings />}
        {activeSection === 'hours' && <BusinessHours />}
        {activeSection === 'preferences' && <RestaurantPreferences />}
        {activeSection === 'security' && <SecurityDiagnostics />}
        {activeSection === 'about' && <AboutAshnora />}
      </div>
    </div>
  );
};
