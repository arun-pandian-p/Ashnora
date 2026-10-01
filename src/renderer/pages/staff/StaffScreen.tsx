import React, { useState } from 'react';
import { useApp, User, UserRole } from '../../context/AppContext';
import {
  Users,
  UserPlus,
  Phone,
  Mail,
  Clock,
  Shield,
  KeyRound,
  Trash2,
  CheckCircle2,
  XCircle,
  Building,
  Edit2,
  Check,
  X
} from 'lucide-react';

export const StaffScreen: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, toggleUserStatus } = useApp();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // New user form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('waiter');
  const [newDept, setNewDept] = useState('Floor Operations');
  const [newEmployeeId, setNewEmployeeId] = useState('');
  const [newPassword, setNewPassword] = useState('••••••••');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    addUser({
      name: newName,
      email: newEmail,
      phone: newPhone,
      role: newRole,
      department: newDept,
      employeeId: newEmployeeId || `EMP-${Math.floor(100 + Math.random() * 900)}`,
      status: 'active'
    });

    setIsAddOpen(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewEmployeeId('');
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200/60">
            STAFF & USERS ADMINISTRATION
          </span>
          <h1 className="text-2xl font-black text-[#0B1F3A] tracking-tight mt-1">
            Restaurant Employees & Access Control
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage authenticated users, roles, terminal permissions, and shift statuses
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#F97316] hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-2 cursor-pointer transition-all self-start"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add Employee</span>
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((staff) => (
          <div
            key={staff.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center font-black text-[#F97316] text-base shadow-2xs">
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#0B1F3A]">{staff.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                        {staff.role}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{staff.employeeId || 'EMP-01'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleUserStatus(staff.id)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                    staff.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  }`}
                  title="Click to toggle Active / Inactive"
                >
                  {staff.status}
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{staff.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{staff.phone || '+91 98765 43210'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Dept: {staff.department || 'Operations'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>Last active: {staff.lastActive}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  const newPass = prompt(`Enter new password for ${staff.name}:`);
                  if (newPass) alert(`Password updated for ${staff.name}.`);
                }}
                className="font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                <span>Reset PIN</span>
              </button>

              <button
                onClick={() => {
                  if (confirm(`Revoke and delete user account for ${staff.name}?`)) {
                    deleteUser(staff.id);
                  }
                }}
                className="font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                title="Revoke access"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Revoke</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Employee Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#0B1F3A] mb-1">Create Staff User</h3>
            <p className="text-xs text-slate-500 mb-6 font-medium">Add an employee with role-based dashboard authorization</p>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-500 uppercase tracking-wider mb-1">Employee ID</label>
                  <input
                    type="text"
                    value={newEmployeeId}
                    onChange={(e) => setNewEmployeeId(e.target.value)}
                    placeholder="EMP-WTR-09"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 uppercase tracking-wider mb-1">Email / Login ID</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="rahul@ashnora.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-500 uppercase tracking-wider mb-1">Phone</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 uppercase tracking-wider mb-1">Assigned Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="waiter">Waiter 🪑</option>
                    <option value="cashier">Billing / Cashier 💳</option>
                    <option value="kitchen">Kitchen 🍳</option>
                    <option value="inventory">Inventory 📦</option>
                    <option value="manager">Manager 👤</option>
                    <option value="admin">Admin / Owner 👑</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 uppercase tracking-wider mb-1">Department</label>
                  <input
                    type="text"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    placeholder="Floor Service"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#F97316] hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-500/20"
                >
                  Create Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
