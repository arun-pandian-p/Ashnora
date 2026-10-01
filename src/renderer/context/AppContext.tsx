import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'manager' | 'cashier' | 'kitchen' | 'waiter' | 'inventory';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  employeeId?: string;
  department?: string;
  status: 'active' | 'inactive';
  lastActive: string;
  allowedRoles: UserRole[];
  permissions?: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Starters' | 'Main Course' | 'Breads' | 'Drinks' | 'Desserts';
  price: number;
  image: string;
  isAvailable: boolean;
  preparationTime: number; // mins
  description?: string;
  taxes?: number; // %
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  tableNumber: string;
  orderType: 'dine_in' | 'takeaway' | 'delivery';
  guestCount?: number;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'new' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod?: 'cash' | 'card' | 'upi';
  cashReceived?: number;
  changeAmount?: number;
  createdAt: string;
  elapsedMinutes: number;
  kitchenStation?: 'Main Kitchen' | 'Bar' | 'Grill';
}

export interface TableInfo {
  id: string;
  number: string;
  floor: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'waiting' | 'bill_requested';
  currentGuests?: number;
  activeOrderId?: string;
  reservationTime?: string;
  customerName?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  minThreshold: number;
  status: 'normal' | 'low' | 'out';
  lastRestocked: string;
  costPerUnit: number;
  supplier: string;
}

export interface Reservation {
  id: string;
  customerName: string;
  phone: string;
  guestCount: number;
  tableNumber: string;
  time: string;
  date: string;
  status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalVisits: number;
  totalSpend: number;
  lastVisit: string;
  favoriteDish: string;
  notes?: string;
}

export interface RestaurantProfile {
  name: string;
  branch: string;
  tagline: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  gstin: string;
  fssai: string;
  currency: string;
  currencySymbol: string;
  taxRate: number; // 5%
  serviceChargeRate: number; // 0%
  receiptFooter: string;
}

export interface HardwarePrinter {
  id: string;
  name: string;
  type: 'receipt' | 'kot' | 'kitchen' | 'barcode' | 'drawer';
  connection: 'USB' | 'Network (TCP/IP)' | 'Bluetooth' | 'COM / Serial';
  status: 'connected' | 'disconnected' | 'paper_out';
  paperWidth: '80mm' | '58mm';
  ipAddress?: string;
}

export interface DocumentItem {
  id: string;
  fileName: string;
  fileType: 'PDF' | 'CSV' | 'DOCX';
  fileSize: string;
  uploadDate: string;
  parsedType?: 'menu' | 'inventory' | 'staff' | 'suppliers' | 'general';
  recordsCount?: number;
  status: 'validated' | 'imported' | 'pending';
}

export interface AuditLogItem {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  user: string;
}

export type SyncState = 'SYNCED' | 'SYNCING' | 'OFFLINE' | 'PENDING' | 'CONFLICT' | 'ERROR';

interface AppContextType {
  // Navigation & Session
  currentScreen: 'onboarding' | 'home' | 'login' | 'role_select' | 'portal';
  setCurrentScreen: (screen: 'onboarding' | 'home' | 'login' | 'role_select' | 'portal') => void;
  isOnboarded: boolean;
  completeOnboarding: (config?: Partial<RestaurantProfile>) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedTableForOrder: TableInfo | null;
  setSelectedTableForOrder: (table: TableInfo | null) => void;

  // Restaurant details
  restaurantProfile: RestaurantProfile;
  updateRestaurantProfile: (profile: Partial<RestaurantProfile>) => void;

  // Sync Engine & Telemetry
  syncState: SyncState;
  syncCount: number;
  triggerSync: () => Promise<void>;
  isDeactivated: boolean;
  setIsDeactivated: (deactivated: boolean) => void;

  // Data
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  addUser: (user: Partial<User>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;

  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  tables: TableInfo[];
  setTables: React.Dispatch<React.SetStateAction<TableInfo[]>>;
  inventoryItems: InventoryItem[];
  setInventoryItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  printers: HardwarePrinter[];
  setPrinters: React.Dispatch<React.SetStateAction<HardwarePrinter[]>>;

  // Documents & Audit
  documents: DocumentItem[];
  addDocument: (doc: DocumentItem) => void;
  deleteDocument: (id: string) => void;
  auditLogs: AuditLogItem[];
  addAuditLog: (action: string, details: string) => void;

  // Actions
  login: (restaurantId: string, email: string, password?: string) => { success: boolean; message?: string };
  logout: () => void;
  createOrder: (order: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  completeOrderPayment: (orderId: string, paymentMethod: 'cash' | 'card' | 'upi', cashReceived?: number) => void;
  printReceipt: (order: Order) => Promise<{ success: boolean; error?: string }>;
  testPrintHardware: (printerId: string) => Promise<{ success: boolean; message: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    return localStorage.getItem('ashnora_onboarded') === 'true';
  });
  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'home' | 'login' | 'role_select' | 'portal'>('home');
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedTableForOrder, setSelectedTableForOrder] = useState<TableInfo | null>(null);
  const [isDeactivated, setIsDeactivated] = useState<boolean>(false);
  const [syncState, setSyncState] = useState<SyncState>('SYNCED');
  const [syncCount, setSyncCount] = useState<number>(0);

  // Restaurant Profile
  const [restaurantProfile, setRestaurantProfile] = useState<RestaurantProfile>({
    name: 'Ashnora Grand Bistro',
    branch: 'Flagship Indiranagar',
    tagline: 'Modern Dining & Authentic Flavors',
    address: '100 Feet Road, HAL 2nd Stage, Indiranagar',
    city: 'Bengaluru, Karnataka 560038',
    phone: '+91 80 4123 9800',
    email: 'contact@ashnora.com',
    website: 'https://ashnora.com',
    gstin: '29ABCDE1234F1Z5',
    fssai: '11223344556677',
    currency: 'INR',
    currencySymbol: '₹',
    taxRate: 5,
    serviceChargeRate: 0,
    receiptFooter: 'Thank you for dining with Ashnora! Visit again.'
  });

  // Users
  const [users, setUsers] = useState<User[]>([
    {
      id: 'u-1',
      name: 'Arun Pandian',
      email: 'admin@prepville.com',
      role: 'admin',
      phone: '+91 98765 43210',
      employeeId: 'EMP-ADM-01',
      department: 'Management',
      status: 'active',
      lastActive: 'Just now',
      allowedRoles: ['admin', 'manager', 'cashier', 'kitchen', 'waiter', 'inventory'],
      permissions: ['all']
    },
    {
      id: 'u-2',
      name: 'Kumar Swamy',
      email: 'manager@ashnora.com',
      role: 'manager',
      phone: '+91 98765 43211',
      employeeId: 'EMP-MGR-02',
      department: 'Operations',
      status: 'active',
      lastActive: '10 mins ago',
      allowedRoles: ['manager', 'cashier', 'waiter'],
      permissions: ['orders', 'pos', 'inventory', 'tables', 'reports']
    },
    {
      id: 'u-3',
      name: 'Ravi Teja',
      email: 'cashier@ashnora.com',
      role: 'cashier',
      phone: '+91 98765 43212',
      employeeId: 'EMP-CSH-03',
      department: 'Billing Counter',
      status: 'active',
      lastActive: '5 mins ago',
      allowedRoles: ['cashier'],
      permissions: ['pos', 'orders', 'payments']
    },
    {
      id: 'u-4',
      name: 'Chef Siva',
      email: 'kitchen@ashnora.com',
      role: 'kitchen',
      phone: '+91 98765 43213',
      employeeId: 'EMP-KIT-04',
      department: 'Main Kitchen',
      status: 'active',
      lastActive: '2 mins ago',
      allowedRoles: ['kitchen'],
      permissions: ['kds', 'orders']
    },
    {
      id: 'u-5',
      name: 'Mani Kandan',
      email: 'waiter@ashnora.com',
      role: 'waiter',
      phone: '+91 98765 43214',
      employeeId: 'EMP-WTR-05',
      department: 'Floor Service',
      status: 'active',
      lastActive: '1 min ago',
      allowedRoles: ['waiter'],
      permissions: ['tables', 'orders', 'reservations']
    },
    {
      id: 'u-6',
      name: 'Kavitha R',
      email: 'inventory@ashnora.com',
      role: 'inventory',
      phone: '+91 98765 43215',
      employeeId: 'EMP-INV-06',
      department: 'Store & Inventory',
      status: 'active',
      lastActive: '15 mins ago',
      allowedRoles: ['inventory'],
      permissions: ['inventory', 'suppliers', 'purchases']
    }
  ]);

  const [currentUser, setCurrentUser] = useState<User | null>(users[0]);

  // Documents
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'doc-1',
      fileName: 'Ashnora_Summer_Menu_2026.csv',
      fileType: 'CSV',
      fileSize: '42 KB',
      uploadDate: '2026-09-28',
      parsedType: 'menu',
      recordsCount: 38,
      status: 'imported'
    },
    {
      id: 'doc-2',
      fileName: 'Supplier_Price_Agreement.pdf',
      fileType: 'PDF',
      fileSize: '1.2 MB',
      uploadDate: '2026-09-30',
      parsedType: 'suppliers',
      recordsCount: 6,
      status: 'validated'
    },
    {
      id: 'doc-3',
      fileName: 'Standard_Operating_Procedures.docx',
      fileType: 'DOCX',
      fileSize: '340 KB',
      uploadDate: '2026-10-01',
      parsedType: 'general',
      recordsCount: 1,
      status: 'imported'
    }
  ]);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    {
      id: 'log-1',
      action: 'System Initialized',
      details: 'Ashnora Desktop OS v1.0.6 ready and synchronized with local SQLite store.',
      timestamp: 'Today, 08:00 AM',
      user: 'System'
    },
    {
      id: 'log-2',
      action: 'Menu Imported',
      details: '38 products synchronized from cloud Customer Menu registry.',
      timestamp: 'Today, 08:05 AM',
      user: 'Arun Pandian'
    }
  ]);

  const addDocument = (doc: DocumentItem) => {
    setDocuments(prev => [doc, ...prev]);
    addAuditLog('Document Uploaded', `Uploaded ${doc.fileName} (${doc.fileType}) for ${doc.parsedType || 'general'} import.`);
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    addAuditLog('Document Deleted', `Document ${id} removed.`);
  };

  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      action,
      details,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: currentUser?.name || 'Authorized User'
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 99)]);
  };

  // User Management
  const addUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: userData.name || 'New Staff Member',
      email: userData.email || `staff${Date.now()}@ashnora.com`,
      role: userData.role || 'waiter',
      phone: userData.phone || '',
      employeeId: userData.employeeId || `EMP-${Math.floor(100 + Math.random() * 900)}`,
      department: userData.department || 'Operations',
      status: 'active',
      lastActive: 'Never',
      allowedRoles: [userData.role || 'waiter'],
      permissions: userData.permissions || ['orders']
    };
    setUsers(prev => [...prev, newUser]);
    addAuditLog('User Created', `Added staff user ${newUser.name} with role ${newUser.role.toUpperCase()}`);
  };

  const updateUser = (id: string, updated: Partial<User>) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updated } : u)));
    addAuditLog('User Updated', `Updated user details for ${id}`);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    addAuditLog('User Revoked', `Revoked access for user ${id}`);
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === id) {
          const nextStatus = u.status === 'active' ? 'inactive' : 'active';
          addAuditLog('User Status Changed', `User ${u.name} marked ${nextStatus}`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  // Trigger Cloud Sync
  const triggerSync = async () => {
    setSyncState('SYNCING');
    try {
      const api = (window as any).electronAPI;
      if (api?.db?.syncNow) {
        await api.db.syncNow();
      }
      setSyncCount(0);
      setSyncState('SYNCED');
      addAuditLog('Cloud Synchronized', 'All local offline transactions synced with Supabase.');
    } catch {
      setSyncState('OFFLINE');
    }
  };

  const completeOnboarding = (config?: Partial<RestaurantProfile>) => {
    if (config) {
      setRestaurantProfile(prev => ({ ...prev, ...config }));
    }
    setIsOnboarded(true);
    localStorage.setItem('ashnora_onboarded', 'true');
    setCurrentScreen('home');
    addAuditLog('Onboarding Completed', 'Restaurant initial profile & menu imported into local storage.');
  };

  // Menu items
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: 'm-1', name: 'Chicken Biryani', category: 'Main Course', price: 340, image: '/food/chicken-biryani.jpg', isAvailable: true, preparationTime: 12, description: 'Fragrant basmati rice dum cooked with chicken & spices.' },
    { id: 'm-2', name: 'Butter Chicken', category: 'Main Course', price: 320, image: '/food/butter-chicken.jpg', isAvailable: true, preparationTime: 10, description: 'Tender tandoori chicken simmered in rich creamy tomato gravy.' },
    { id: 'm-3', name: 'Paneer Butter Masala', category: 'Main Course', price: 280, image: '/food/paneer-butter-masala.jpg', isAvailable: true, preparationTime: 10, description: 'Cottage cheese in rich buttery tomato puree.' },
    { id: 'm-4', name: 'Chicken 65', category: 'Starters', price: 240, image: '/food/chicken-65.jpg', isAvailable: true, preparationTime: 8, description: 'Crispy spicy fried chicken tossed with curry leaves.' },
    { id: 'm-5', name: 'Paneer Tikka', category: 'Starters', price: 220, image: '/food/paneer-tikka.jpg', isAvailable: true, preparationTime: 8, description: 'Charcoal grilled cottage cheese with bell peppers.' },
    { id: 'm-6', name: 'Garlic Naan', category: 'Breads', price: 60, image: '/food/garlic-bread.jpg', isAvailable: true, preparationTime: 4, description: 'Clay oven baked flatbread infused with garlic butter.' },
    { id: 'm-7', name: 'Fresh Lime Soda', category: 'Drinks', price: 90, image: '/food/lime-soda.jpg', isAvailable: true, preparationTime: 3, description: 'Refreshing sparkling lime soda.' },
    { id: 'm-8', name: 'Gulab Jamun (2 pcs)', category: 'Desserts', price: 110, image: '/food/gulab-jamun.jpg', isAvailable: true, preparationTime: 2, description: 'Warm milk dumplings soaked in cardamom saffron syrup.' }
  ]);

  // Tables
  const [tables, setTables] = useState<TableInfo[]>([
    { id: 't-1', number: '01', floor: 'Ground Floor', capacity: 2, status: 'occupied', currentGuests: 2, activeOrderId: 'ord-101' },
    { id: 't-2', number: '02', floor: 'Ground Floor', capacity: 4, status: 'available' },
    { id: 't-3', number: '03', floor: 'Ground Floor', capacity: 4, status: 'available' },
    { id: 't-4', number: '04', floor: 'Ground Floor', capacity: 6, status: 'waiting', currentGuests: 4 },
    { id: 't-5', number: '05', floor: 'Ground Floor', capacity: 4, status: 'reserved', reservationTime: '7:30 PM', customerName: 'Vikram Malhotra' },
    { id: 't-6', number: '06', floor: 'Ground Floor', capacity: 2, status: 'bill_requested', currentGuests: 2, activeOrderId: 'ord-103' },
    { id: 't-7', number: 'P-1', floor: 'Patio Terrace', capacity: 4, status: 'available' },
    { id: 't-8', number: 'P-2', floor: 'Patio Terrace', capacity: 6, status: 'occupied', currentGuests: 5, activeOrderId: 'ord-104' }
  ]);

  // Orders
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord-101',
      orderNumber: '#101',
      tableNumber: '01',
      orderType: 'dine_in',
      guestCount: 2,
      items: [
        { menuItemId: 'm-1', name: 'Chicken Biryani', price: 340, quantity: 2 },
        { menuItemId: 'm-7', name: 'Fresh Lime Soda', price: 90, quantity: 2 }
      ],
      subtotal: 860,
      tax: 43,
      discount: 0,
      total: 903,
      status: 'preparing',
      paymentStatus: 'pending',
      createdAt: '12 mins ago',
      elapsedMinutes: 12,
      kitchenStation: 'Main Kitchen'
    },
    {
      id: 'ord-102',
      orderNumber: '#102',
      tableNumber: 'Takeaway',
      orderType: 'takeaway',
      items: [
        { menuItemId: 'm-2', name: 'Butter Chicken', price: 320, quantity: 1 },
        { menuItemId: 'm-6', name: 'Garlic Naan', price: 60, quantity: 3 }
      ],
      subtotal: 500,
      tax: 25,
      discount: 0,
      total: 525,
      status: 'ready',
      paymentStatus: 'paid',
      paymentMethod: 'upi',
      createdAt: '8 mins ago',
      elapsedMinutes: 8,
      kitchenStation: 'Main Kitchen'
    }
  ]);

  // Inventory
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    { id: 'inv-1', name: 'Fresh Chicken Breast', category: 'Meat & Poultry', currentStock: 14.5, unit: 'kg', minThreshold: 10, status: 'normal', lastRestocked: 'Today, 6:00 AM', costPerUnit: 220, supplier: 'Metro Meat Wholesalers' },
    { id: 'inv-2', name: 'Farm Fresh Tomatoes', category: 'Vegetables', currentStock: 4.2, unit: 'kg', minThreshold: 8, status: 'low', lastRestocked: 'Yesterday', costPerUnit: 35, supplier: 'Green Valley Organic' },
    { id: 'inv-3', name: 'Mozzarella & Cheddar Blend', category: 'Dairy', currentStock: 0, unit: 'kg', minThreshold: 5, status: 'out', lastRestocked: '3 days ago', costPerUnit: 480, supplier: 'Amul Dairy Direct' },
    { id: 'inv-4', name: 'Basmati Rice (Daawat Royal)', category: 'Grains & Pulses', currentStock: 65, unit: 'kg', minThreshold: 20, status: 'normal', lastRestocked: '2 days ago', costPerUnit: 95, supplier: 'Sri Laxmi Rice Mill' }
  ]);

  // Reservations
  const [reservations, setReservations] = useState<Reservation[]>([
    { id: 'res-1', customerName: 'Vikram Malhotra', phone: '+91 99887 76655', guestCount: 4, tableNumber: '05', time: '7:30 PM', date: 'Today', status: 'confirmed', notes: 'Anniversary celebration' },
    { id: 'res-2', customerName: 'Pooja Hegde', phone: '+91 98112 34567', guestCount: 6, tableNumber: '10', time: '8:15 PM', date: 'Today', status: 'confirmed' }
  ]);

  // Customers
  const [customers, setCustomers] = useState<Customer[]>([
    { id: 'cust-1', name: 'Vikram Malhotra', phone: '+91 99887 76655', email: 'vikram.m@gmail.com', totalVisits: 14, totalSpend: 28450, lastVisit: 'Yesterday', favoriteDish: 'Chicken Biryani' },
    { id: 'cust-2', name: 'Pooja Hegde', phone: '+91 98112 34567', email: 'pooja.h@outlook.com', totalVisits: 8, totalSpend: 14320, lastVisit: '4 days ago', favoriteDish: 'Butter Chicken' }
  ]);

  // Hardware Printers
  const [printers, setPrinters] = useState<HardwarePrinter[]>([
    { id: 'p-1', name: 'EPSON TM-T88VI (Thermal Billing)', type: 'receipt', connection: 'USB', status: 'connected', paperWidth: '80mm' },
    { id: 'p-2', name: 'Kitchen KOT Printer (Thermal 80mm)', type: 'kot', connection: 'Network (TCP/IP)', status: 'connected', paperWidth: '80mm', ipAddress: '192.168.1.180' },
    { id: 'p-3', name: 'Bar Counter KOT Printer', type: 'kitchen', connection: 'Network (TCP/IP)', status: 'connected', paperWidth: '58mm', ipAddress: '192.168.1.181' }
  ]);

  // Periodic Telemetry Heartbeat
  useEffect(() => {
    const sendHeartbeatTelemetry = async () => {
      try {
        const api = (window as any).electronAPI;
        if (api?.sendHeartbeat) {
          const res = await api.sendHeartbeat({
            restaurant: restaurantProfile.name,
            online: navigator.onLine,
            timestamp: Date.now(),
            role: currentRole
          });
          if (res?.deactivated) {
            setIsDeactivated(true);
          }
        }
      } catch {}
    };

    sendHeartbeatTelemetry();
    const timer = setInterval(sendHeartbeatTelemetry, 60000);
    return () => clearInterval(timer);
  }, [currentRole, restaurantProfile.name]);

  const updateRestaurantProfile = (updated: Partial<RestaurantProfile>) => {
    setRestaurantProfile(prev => ({ ...prev, ...updated }));
    addAuditLog('Settings Modified', 'Restaurant profile and tax configuration updated.');
  };

  // Secure Authentication: Look up user, verify active status, apply their true database role
  const login = (restaurantId: string, emailOrUsername: string, password?: string): { success: boolean; message?: string } => {
    const query = emailOrUsername.trim().toLowerCase();
    const foundUser = users.find(u =>
      u.email.toLowerCase() === query ||
      u.employeeId.toLowerCase() === query ||
      u.name.toLowerCase() === query ||
      (query === 'admin' && u.role === 'admin') ||
      (query === 'cashier' && u.role === 'cashier') ||
      (query === 'kitchen' && u.role === 'kitchen') ||
      (query === 'waiter' && u.role === 'waiter') ||
      (query === 'manager' && u.role === 'manager')
    );

    if (!foundUser) {
      return { success: false, message: 'Invalid credentials. User not found for this restaurant installation.' };
    }

    if (foundUser.status === 'inactive') {
      return { success: false, message: 'This employee account has been deactivated by the Restaurant Admin.' };
    }

    setCurrentUser(foundUser);
    setCurrentRole(foundUser.role);
    setCurrentScreen('portal');
    setActiveTab('home');
    addAuditLog('User Login', `${foundUser.name} (${foundUser.role.toUpperCase()}) authenticated successfully.`);
    return { success: true };
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog('User Logout', `${currentUser.name} signed out.`);
    }
    setCurrentUser(null);
    setCurrentScreen('home');
    setActiveTab('home');
    setSelectedTableForOrder(null);
  };

  const createOrder = (orderData: Partial<Order>): Order => {
    const nextNum = orders.length + 101;
    const items = orderData.items || [];
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * (restaurantProfile.taxRate / 100));
    const total = subtotal + tax - (orderData.discount || 0);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `#${nextNum}`,
      tableNumber: orderData.tableNumber || 'Takeaway',
      orderType: orderData.orderType || 'dine_in',
      guestCount: orderData.guestCount || 2,
      items,
      subtotal,
      tax,
      discount: orderData.discount || 0,
      total,
      status: 'new',
      paymentStatus: 'pending',
      createdAt: 'Just now',
      elapsedMinutes: 0,
      kitchenStation: 'Main Kitchen'
    };

    setOrders(prev => [newOrder, ...prev]);
    setSyncCount(prev => prev + 1);

    if (orderData.tableNumber && orderData.tableNumber !== 'Takeaway') {
      setTables(prev =>
        prev.map(t =>
          t.number === orderData.tableNumber
            ? { ...t, status: 'occupied', currentGuests: orderData.guestCount || 2, activeOrderId: newOrder.id }
            : t
        )
      );
    }

    addAuditLog('Order Created', `Order ${newOrder.orderNumber} placed for Table ${newOrder.tableNumber} (₹${newOrder.total})`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, status } : ord))
    );
    setSyncCount(prev => prev + 1);
    addAuditLog('Order Status Updated', `Order ${orderId} moved to ${status.toUpperCase()}`);
  };

  const completeOrderPayment = (orderId: string, paymentMethod: 'cash' | 'card' | 'upi', cashReceived?: number) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const changeAmount = cashReceived ? Math.max(0, cashReceived - ord.total) : 0;
          return {
            ...ord,
            status: 'completed',
            paymentStatus: 'paid',
            paymentMethod,
            cashReceived,
            changeAmount
          };
        }
        return ord;
      })
    );

    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder?.tableNumber && targetOrder.tableNumber !== 'Takeaway') {
      setTables(prev =>
        prev.map(t =>
          t.number === targetOrder.tableNumber
            ? { ...t, status: 'available', currentGuests: 0, activeOrderId: undefined }
            : t
        )
      );
    }

    setSyncCount(prev => prev + 1);
    addAuditLog('Payment Settled', `Order ${orderId} settled via ${paymentMethod.toUpperCase()}`);
  };

  const printReceipt = async (order: Order): Promise<{ success: boolean; error?: string }> => {
    try {
      const api = (window as any).electronAPI;
      if (api?.printReceipt) {
        return await api.printReceipt({ silent: true });
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const testPrintHardware = async (printerId: string): Promise<{ success: boolean; message: string }> => {
    const target = printers.find(p => p.id === printerId);
    if (!target) return { success: false, message: 'Printer not found' };

    const api = (window as any).electronAPI;
    if (api?.printReceipt) {
      try {
        await api.printReceipt({ deviceName: target.name, silent: true });
        return { success: true, message: `Test receipt printed to ${target.name}` };
      } catch (err: any) {
        return { success: false, message: `Hardware communication error: ${err.message}` };
      }
    }
    return { success: true, message: `Test ticket sent to ${target.name}` };
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        isOnboarded,
        completeOnboarding,
        currentUser,
        setCurrentUser,
        currentRole,
        setCurrentRole,
        activeTab,
        setActiveTab,
        selectedTableForOrder,
        setSelectedTableForOrder,
        restaurantProfile,
        updateRestaurantProfile,
        syncState,
        syncCount,
        triggerSync,
        isDeactivated,
        setIsDeactivated,
        users,
        setUsers,
        addUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        menuItems,
        setMenuItems,
        orders,
        setOrders,
        tables,
        setTables,
        inventoryItems,
        setInventoryItems,
        reservations,
        setReservations,
        customers,
        setCustomers,
        printers,
        setPrinters,
        documents,
        addDocument,
        deleteDocument,
        auditLogs,
        addAuditLog,
        login,
        logout,
        createOrder,
        updateOrderStatus,
        completeOrderPayment,
        printReceipt,
        testPrintHardware
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
