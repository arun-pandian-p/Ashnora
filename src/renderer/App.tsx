import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DesktopTitleBar } from './components/DesktopTitleBar';
import { UpdateNotificationBanner } from './components/UpdateNotificationBanner';
import { PortalLayout } from './components/PortalLayout';

// Screens
import { HomeScreen } from './pages/Home';
import { LoginScreen } from './pages/Login';
import { RoleSelectScreen } from './pages/RoleSelect';
import { DeactivationScreen } from './pages/DeactivationScreen';
import { OnboardingWizard } from './pages/OnboardingWizard';

// Portals & Subscreens
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminHub } from './pages/admin/AdminHub';
import { DocumentsScreen } from './pages/admin/DocumentsScreen';
import { ManagerDashboard } from './pages/manager/ManagerDashboard';
import { POSScreen } from './pages/pos/POSScreen';
import { KDSScreen } from './pages/kds/KDSScreen';
import { WaiterFloorPlan } from './pages/waiter/WaiterFloorPlan';
import { InventoryScreen } from './pages/inventory/InventoryScreen';
import { StaffScreen } from './pages/staff/StaffScreen';
import { ReservationsScreen } from './pages/reservations/ReservationsScreen';
import { CustomersScreen } from './pages/customers/CustomersScreen';
import { AnalyticsScreen } from './pages/analytics/AnalyticsScreen';
import { ReportsScreen } from './pages/reports/ReportsScreen';
import { OrdersScreen } from './pages/orders/OrdersScreen';

const MainAppContent: React.FC = () => {
  const { currentScreen, currentRole, activeTab, isDeactivated, isOnboarded } = useApp();

  if (isDeactivated) {
    return <DeactivationScreen />;
  }

  // First launch onboarding check
  if (!isOnboarded || currentScreen === 'onboarding') {
    return <OnboardingWizard />;
  }

  if (currentScreen === 'home') {
    return <HomeScreen />;
  }

  if (currentScreen === 'login') {
    return <LoginScreen />;
  }

  if (currentScreen === 'role_select') {
    return <RoleSelectScreen />;
  }

  // Render Role-Specific Portal
  return (
    <PortalLayout>
      {/* Admin Views */}
      {currentRole === 'admin' && (
        <>
          {activeTab === 'home' && <AdminDashboard />}
          {activeTab === 'pos' && <POSScreen />}
          {activeTab === 'orders' && <OrdersScreen />}
          {activeTab === 'payments' && <OrdersScreen />}
          {activeTab === 'kds' && <KDSScreen />}
          {activeTab === 'tables' && <WaiterFloorPlan />}
          {activeTab === 'reservations' && <ReservationsScreen />}
          {activeTab === 'waiter' && <WaiterFloorPlan />}
          {activeTab === 'inventory' && <InventoryScreen />}
          {activeTab === 'purchases' && <InventoryScreen />}
          {activeTab === 'suppliers' && <InventoryScreen />}
          {activeTab === 'stock' && <InventoryScreen />}
          {activeTab === 'customers' && <CustomersScreen />}
          {activeTab === 'customer_menu' && <AdminHub initialSection="menu" />}
          {activeTab === 'analytics' && <AnalyticsScreen />}
          {activeTab === 'reports' && <ReportsScreen />}
          {activeTab === 'staff' && <StaffScreen />}
          {activeTab === 'restaurant_settings' && <AdminHub initialSection="profile" />}
          {activeTab === 'admin_menu' && <AdminHub initialSection="menu" />}
          {activeTab === 'taxes' && <AdminHub initialSection="taxes" />}
          {activeTab === 'payment_settings' && <AdminHub initialSection="payments" />}
          {activeTab === 'billing_settings' && <AdminHub initialSection="billing" />}
          {activeTab === 'printers' && <AdminHub initialSection="printers" />}
          {activeTab === 'kds_settings' && <AdminHub initialSection="kds" />}
          {activeTab === 'hardware' && <AdminHub initialSection="printers" />}
          {activeTab === 'security' && <AdminHub initialSection="security" />}
          {activeTab === 'about' && <AdminHub initialSection="about" />}
          {activeTab === 'documents' && <DocumentsScreen />}
        </>
      )}

      {/* Manager Views */}
      {currentRole === 'manager' && (
        <>
          {activeTab === 'home' && <ManagerDashboard />}
          {activeTab === 'pos' && <POSScreen />}
          {activeTab === 'orders' && <OrdersScreen />}
          {activeTab === 'payments' && <OrdersScreen />}
          {activeTab === 'kds' && <KDSScreen />}
          {activeTab === 'tables' && <WaiterFloorPlan />}
          {activeTab === 'reservations' && <ReservationsScreen />}
          {activeTab === 'inventory' && <InventoryScreen />}
          {activeTab === 'customers' && <CustomersScreen />}
          {activeTab === 'staff' && <StaffScreen />}
          {activeTab === 'analytics' && <AnalyticsScreen />}
          {activeTab === 'reports' && <ReportsScreen />}
        </>
      )}

      {/* Cashier / Billing Views */}
      {currentRole === 'cashier' && (
        <>
          {activeTab === 'home' && <POSScreen />}
          {activeTab === 'pos' && <POSScreen />}
          {activeTab === 'orders' && <OrdersScreen />}
          {activeTab === 'payments' && <OrdersScreen />}
        </>
      )}

      {/* Kitchen / KDS Views */}
      {currentRole === 'kitchen' && (
        <>
          {activeTab === 'home' && <KDSScreen />}
          {activeTab === 'kds' && <KDSScreen />}
          {activeTab === 'orders' && <OrdersScreen />}
        </>
      )}

      {/* Waiter Views */}
      {currentRole === 'waiter' && (
        <>
          {activeTab === 'home' && <WaiterFloorPlan />}
          {activeTab === 'tables' && <WaiterFloorPlan />}
          {activeTab === 'orders' && <OrdersScreen />}
          {activeTab === 'reservations' && <ReservationsScreen />}
          {activeTab === 'customers' && <CustomersScreen />}
        </>
      )}

      {/* Inventory Views */}
      {currentRole === 'inventory' && (
        <>
          {activeTab === 'home' && <InventoryScreen />}
          {activeTab === 'inventory' && <InventoryScreen />}
          {activeTab === 'purchases' && <InventoryScreen />}
          {activeTab === 'suppliers' && <InventoryScreen />}
          {activeTab === 'stock' && <InventoryScreen />}
          {activeTab === 'reports' && <ReportsScreen />}
        </>
      )}
    </PortalLayout>
  );
};

export function App() {
  return (
    <AppProvider>
      <div className="flex flex-col h-screen w-screen bg-slate-50 text-slate-900 overflow-hidden select-none">
        <DesktopTitleBar />
        <UpdateNotificationBanner />
        <div className="flex-1 overflow-hidden relative">
          <MainAppContent />
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
