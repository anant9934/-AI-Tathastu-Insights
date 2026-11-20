import React, { useState, useEffect } from 'react';
import { Users, Plus, Shield, Trash2, X, AlertCircle, Check } from 'lucide-react';
import { StudioUser, UserRole } from '../../types/studio';
import { api } from '../../lib/api';
import { useStudioAuth } from '../context/StudioAuthContext';

export const StudioUsersPage: React.FC = () => {
  const { user: currentUser } = useStudioAuth();
  const [users, setUsers] = useState<StudioUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  // Invite Form
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('author');
  const [inviteAffiliation, setInviteAffiliation] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.studio.users.list();
      setUsers(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.studio.users.create({
        email: inviteEmail,
        name: inviteName,
        roleId: inviteRole,
        affiliation: inviteAffiliation,
      });
      setIsInviteOpen(false);
      setInviteEmail('');
      setInviteName('');
      setInviteAffiliation('');
      fetchUsers();
    } catch (err: any) {
      alert(`User creation failed: ${err.message}`);
    }
  };

  const handleChangeRole = async (userId: string, newRole: UserRole) => {
    try {
      await api.studio.users.updateRole(userId, newRole);
      fetchUsers();
    } catch (err: any) {
      alert(`Role change failed: ${err.message}`);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to revoke this user account?')) return;
    try {
      await api.studio.users.delete(userId);
      fetchUsers();
    } catch (err: any) {
      alert(`Revocation failed: ${err.message}`);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-800/40">Super Admin</span>;
      case 'admin':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40">Admin</span>;
      case 'editor':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40">Editor</span>;
      case 'research_editor':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">Research Editor</span>;
      case 'media_manager':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/40">Media Manager</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">{role}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Role-Based Access Control & User Administration
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage editorial staff, author authorizations, reviewer credentials, and server-side RBAC permissions.
          </p>
        </div>
        <button
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-md text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Provision User</span>
        </button>
      </div>

      <div className="bg-white dark:bg-[#12161E] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-[#FAFAFA] dark:bg-[#0E1116] text-[11px] font-mono uppercase tracking-wider text-neutral-500">
              <th className="py-3 px-4">User Name & Email</th>
              <th className="py-3 px-4">Affiliation / Group</th>
              <th className="py-3 px-4">Current Role</th>
              <th className="py-3 px-4">Role Assignment</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-neutral-400 font-mono text-xs">Loading users...</td>
              </tr>
            ) : users.map((u) => (
              <tr key={u.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors">
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="font-semibold text-neutral-900 dark:text-white">{u.name}</div>
                  <div className="text-[11px] font-mono text-neutral-400">{u.email}</div>
                </td>
                <td className="py-3 px-4 whitespace-nowrap text-neutral-600 dark:text-neutral-400">
                  {u.affiliation || 'AI Tathastu Insights'}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  {getRoleBadge(u.roleId)}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  {currentUser?.roleId === 'super_admin' ? (
                    <select
                      value={u.roleId}
                      onChange={(e) => handleChangeRole(u.id, e.target.value as UserRole)}
                      className="p-1 rounded text-xs border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                    >
                      <option value="super_admin">Super Admin</option>
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="research_editor">Research Editor</option>
                      <option value="media_manager">Media Manager</option>
                      <option value="author">Author</option>
                      <option value="contributor">Contributor</option>
                    </select>
                  ) : (
                    <span className="text-[11px] text-neutral-400 font-mono">Managed by Super Admin</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  {currentUser?.roleId === 'super_admin' && u.id !== currentUser.id && (
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      title="Revoke User Access"
                      className="p-1 rounded text-neutral-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isInviteOpen && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#12161E] rounded-xl max-w-md w-full p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Provision New User Account</h3>
              <button onClick={() => setIsInviteOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleInviteSubmit} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Dr. Priya Desai"
                  className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Institutional Email</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="name@organization.org"
                  className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Role Assignment</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                >
                  <option value="author">Author (Submit & edit own drafts)</option>
                  <option value="research_editor">Research Editor (Verify DOIs & papers)</option>
                  <option value="media_manager">Media Manager (Upload media)</option>
                  <option value="editor">Editor (Full editorial approvals)</option>
                  <option value="admin">Administrator (Website & settings)</option>
                  <option value="super_admin">Super Administrator (Complete system control)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Affiliation / Lab</label>
                <input
                  type="text"
                  value={inviteAffiliation}
                  onChange={(e) => setInviteAffiliation(e.target.value)}
                  placeholder="e.g. AI Tathastu Hardware Efficiency Lab"
                  className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button type="button" onClick={() => setIsInviteOpen(false)} className="px-3 py-1.5 text-xs text-neutral-500 rounded">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded">Provision Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
