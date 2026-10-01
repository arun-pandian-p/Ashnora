import React, { useState } from 'react';
import { useApp, User, UserRole } from '../../context/AppContext';
import { Users, UserPlus, Shield, Check, X, Edit2, Trash2, Key } from 'lucide-react';

export const UsersAndRoles: React.FC = () => {
  const { users, setUsers } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'cashier' as UserRole,
    phone: '',
    status: 'active' as 'active' | 'inactive'
  });

  const rolesList: UserRole[] = ['admin', 'manager', 'cashier', 'kitchen', 'waiter', 'inventory'];

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const userObj: User = {
      id: `u-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone || '+91 98765 00000',
      status: newUser.status,
      lastActive: 'Just now',
      allowedRoles: [newUser.role]
    };

    setUsers(prev => [...prev, userObj]);
    setIsAddModalOpen(false);
    setNewUser({ name: '', email: '', role: 'cashier', phone: '', status: 'active' });
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u))
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 select-none space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Users & Role Permissions</h2>
          <p className="text-xs text-slate-500 font-medium">Control staff accounts, login credentials, and module access permissions</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm shadow-orange-500/20 flex items-center gap-2 cursor-pointer transition-all self-start"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add User</span>
        </button>
      </div>

      {/* Users Table (Section 07 ASCII) */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider">
              <th className="p-3.5 pl-4">Name</th>
              <th className="p-3.5">Role</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Last Active</th>
              <th className="p-3.5 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5 pl-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{user.name}</p>
                    <p className="text-[11px] text-slate-400">{user.email}</p>
                  </div>
                </td>
                <td className="p-3.5">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase bg-slate-100 text-slate-800 border border-slate-200">
                    {user.role}
                  </span>
                </td>
                <td className="p-3.5">
                  <span
                    onClick={() => toggleUserStatus(user.id)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase cursor-pointer ${
                      user.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-3.5 text-slate-500">{user.lastActive}</td>
                <td className="p-3.5 pr-4 text-right">
                  <button
                    onClick={() => toggleUserStatus(user.id)}
                    className="text-xs text-slate-500 hover:text-orange-600 font-bold mr-3 cursor-pointer"
                  >
                    {user.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Permission Matrix */}
      <div className="pt-4 border-t border-slate-100">
        <div className="mb-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Role Permission Matrix
          </h3>
          <p className="text-xs text-slate-500">Fine-grained operational module toggles per role</p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold">
                <th className="p-3 pl-4">Module</th>
                {rolesList.map(r => (
                  <th key={r} className="p-3 text-center uppercase text-[11px]">{r}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {[
                { name: 'POS Billing & Cash Drawer', roles: ['admin', 'manager', 'cashier'] },
                { name: 'Kitchen KDS Display', roles: ['admin', 'manager', 'kitchen'] },
                { name: 'Floor Tables & Waiter Orders', roles: ['admin', 'manager', 'waiter'] },
                { name: 'Inventory & Purchases', roles: ['admin', 'manager', 'inventory'] },
                { name: 'Reports & Revenue Analytics', roles: ['admin', 'manager'] },
                { name: 'Menu & Price Configuration', roles: ['admin'] },
                { name: 'Taxes, Printers & Hardware', roles: ['admin'] },
                { name: 'User & Staff Management', roles: ['admin', 'manager'] }
              ].map((perm, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60">
                  <td className="p-3 pl-4 font-bold text-slate-900">{perm.name}</td>
                  {rolesList.map(r => {
                    const hasPerm = perm.roles.includes(r);
                    return (
                      <td key={r} className="p-3 text-center">
                        {hasPerm ? (
                          <span className="inline-flex p-1 rounded-md bg-emerald-50 text-emerald-600">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="inline-flex p-1 rounded-md bg-slate-100 text-slate-300">
                            <X className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 md:p-8 max-w-md w-full">
            <h3 className="text-lg font-black text-slate-900 mb-1">Add Staff Account</h3>
            <p className="text-xs text-slate-500 mb-4">Create access credentials for kitchen, billing, waiter or admin</p>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="e.g. ramesh@ashnora.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assigned Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-white"
                >
                  <option value="cashier">Cashier / Billing</option>
                  <option value="waiter">Waiter</option>
                  <option value="kitchen">Kitchen Staff</option>
                  <option value="inventory">Inventory Staff</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
