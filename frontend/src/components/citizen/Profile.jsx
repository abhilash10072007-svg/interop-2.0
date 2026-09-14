import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  KeyRound, 
  Link2, 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Edit3, 
  Save, 
  CheckCircle2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Profile = () => {
  const { user, setUser, showToast } = useApp();
  const [activeSubTab, setActiveSubTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });

  const handleSave = () => {
    setUser(editForm);
    setIsEditing(false);
    showToast('Profile information updated successfully!', 'success', 'Saved');
  };

  const navTabs = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'address', label: 'Address Details', icon: MapPin },
    { id: 'password', label: 'Change Password', icon: KeyRound },
    { id: 'accounts', label: 'Linked Accounts', icon: Link2 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  return (
    <div className="space-y-6 pb-12 animate-precise-up">
      {/* Title Header */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">My Profile</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your personal information and account settings.
          </p>
        </div>

        <button
          onClick={() => {
            if (isEditing) handleSave();
            else setIsEditing(true);
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
            isEditing
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              : 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/30'
          }`}
        >
          {isEditing ? <Save className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
          <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Profile Overview Card (Arjun Kumar) */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white text-2xl font-extrabold flex items-center justify-center shadow-lg shadow-orange-600/20">
            {user.initials}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-white">{user.name}</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                Citizen ID: {user.citizenId}
              </span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Citizen
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-800">
            <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
            <div>
              <p className="text-[11px] text-slate-400">Mobile</p>
              <p className="font-semibold text-white mt-0.5">{user.mobile}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-800">
            <Mail className="w-4 h-4 text-sky-400 flex-shrink-0" />
            <div>
              <p className="text-[11px] text-slate-400">Email</p>
              <p className="font-semibold text-white mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-800">
            <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-[11px] text-slate-400">Address</p>
              <p className="font-semibold text-white mt-0.5 truncate">{user.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Navigation & Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Navigation Sidebar */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3 shadow-xl space-y-1">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Detail Pane */}
        <div className="md:col-span-2 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
          {activeSubTab === 'personal' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={isEditing ? editForm.name : user.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white disabled:opacity-75 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Citizen ID</label>
                  <input
                    type="text"
                    disabled
                    value={user.citizenId}
                    className="w-full px-3 py-2 bg-slate-800/40 border border-slate-700/60 rounded-xl text-slate-400 cursor-not-allowed font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Date of Birth</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={isEditing ? editForm.dob : user.dob}
                    onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white disabled:opacity-75 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Aadhaar Number</label>
                  <input
                    type="text"
                    disabled
                    value={user.aadhaarNumber}
                    className="w-full px-3 py-2 bg-slate-800/40 border border-slate-700/60 rounded-xl text-slate-400 cursor-not-allowed font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'address' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800">Permanent Address</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Full Residential Address</label>
                  <textarea
                    rows={3}
                    disabled={!isEditing}
                    value={isEditing ? editForm.address : user.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white disabled:opacity-75 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'password' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800">Security Credentials</h3>
              <div className="space-y-3 text-xs max-w-sm">
                <div>
                  <label className="block text-slate-400 mb-1">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <button 
                  onClick={() => showToast('Password changed successfully.', 'success')}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold transition-all text-xs"
                >
                  Update Password
                </button>
              </div>
            </div>
          )}

          {activeSubTab === 'accounts' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800">Linked Digital Accounts</h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="font-semibold text-white">Aadhaar (UIDAI eKYC)</span>
                  <span className="text-emerald-400 font-bold">Linked ✓</span>
                </div>
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="font-semibold text-white">DigiLocker Account</span>
                  <span className="text-emerald-400 font-bold">Linked ✓</span>
                </div>
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="font-semibold text-white">Parivahan Sewa</span>
                  <span className="text-emerald-400 font-bold">Active ✓</span>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'settings' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800">Portal Preferences</h3>
              <p className="text-xs text-slate-400">Manage SMS alerts, email notification digests, and high contrast view.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
