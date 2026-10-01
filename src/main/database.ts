import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import type { Order, MenuItem, Table, SyncQueueItem } from '../../../shared/types';

interface LocalStoreData {
  tables: Table[];
  menu_items: MenuItem[];
  orders: Order[];
  sync_queue: SyncQueueItem[];
  settings: Record<string, any>;
  last_synced_at: string | null;
}

class LocalDatabase {
  private dbPath: string;
  private data: LocalStoreData;
  private syncTimer: NodeJS.Timeout | null = null;
  private isSyncing = false;

  constructor() {
    const userDataPath = app.getPath('userData');
    this.dbPath = path.join(userDataPath, 'ashnora_local.json');
    this.data = this.loadDatabase();
    this.startBackgroundSync();
  }

  private loadDatabase(): LocalStoreData {
    try {
      if (fs.existsSync(this.dbPath)) {
        const raw = fs.readFileSync(this.dbPath, 'utf8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('[Database] Failed to read local database, creating new:', err);
    }

    return {
      tables: [],
      menu_items: [],
      orders: [],
      sync_queue: [],
      settings: {},
      last_synced_at: null,
    };
  }

  private saveDatabase(): void {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('[Database] Error saving local database:', err);
    }
  }

  // Tables
  public getTables(): Table[] {
    return this.data.tables;
  }

  public setTables(tables: Table[]): void {
    this.data.tables = tables;
    this.saveDatabase();
  }

  public updateTableStatus(tableId: string, status: Table['status']): boolean {
    const table = this.data.tables.find(t => t.id === tableId);
    if (table) {
      table.status = status;
      this.enqueueSync('tables', 'UPDATE', { id: tableId, status });
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Menu Items
  public getMenuItems(): MenuItem[] {
    return this.data.menu_items;
  }

  public setMenuItems(items: MenuItem[]): void {
    this.data.menu_items = items;
    this.saveDatabase();
  }

  // Orders
  public getOrders(): Order[] {
    return this.data.orders;
  }

  public getOrderById(orderId: string): Order | undefined {
    return this.data.orders.find(o => o.id === orderId);
  }

  public createOrder(order: Order): Order {
    this.data.orders.unshift(order);
    this.enqueueSync('orders', 'INSERT', order);
    this.saveDatabase();
    return order;
  }

  public updateOrderStatus(orderId: string, status: Order['status']): boolean {
    const order = this.data.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      order.updated_at = new Date().toISOString();
      this.enqueueSync('orders', 'UPDATE', { id: orderId, status, updated_at: order.updated_at });
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Offline Sync Queue
  public enqueueSync(tableName: string, action: 'INSERT' | 'UPDATE' | 'DELETE', payload: Record<string, any>): void {
    const queueItem: SyncQueueItem = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      table_name: tableName,
      action,
      payload,
      status: 'pending',
      retry_count: 0,
      created_at: new Date().toISOString(),
    };
    this.data.sync_queue.push(queueItem);
    this.saveDatabase();
  }

  public getSyncQueue(): SyncQueueItem[] {
    return this.data.sync_queue;
  }

  public clearSyncedQueue(): void {
    this.data.sync_queue = this.data.sync_queue.filter(item => item.status !== 'synced');
    this.saveDatabase();
  }

  private startBackgroundSync(): void {
    if (this.syncTimer) clearInterval(this.syncTimer);
    // Attempt sync check every 15 seconds
    this.syncTimer = setInterval(() => {
      this.processSyncQueue();
    }, 15000);
  }

  public async processSyncQueue(): Promise<{ processed: number; failed: number }> {
    if (this.isSyncing) return { processed: 0, failed: 0 };
    const pending = this.data.sync_queue.filter(i => i.status === 'pending');
    if (pending.length === 0) return { processed: 0, failed: 0 };

    this.isSyncing = true;
    let processed = 0;
    let failed = 0;

    for (const item of pending) {
      item.status = 'syncing';
      try {
        // Mark as synced locally
        item.status = 'synced';
        item.synced_at = new Date().toISOString();
        processed++;
      } catch (err) {
        item.status = 'failed';
        item.retry_count++;
        failed++;
      }
    }

    this.data.last_synced_at = new Date().toISOString();
    this.saveDatabase();
    this.isSyncing = false;
    return { processed, failed };
  }
}

export const localDb = new LocalDatabase();
