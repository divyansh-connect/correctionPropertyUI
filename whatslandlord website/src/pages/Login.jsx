import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Key, Briefcase, Crown, Home, Wrench, BarChart3, ArrowRight, ShieldCheck } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Login() {
  const [selectedRole, setSelectedRole] = useState('super-admin');
  const [email, setEmail] = useState('admin@apexpm.com');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const roles = [
    { id: 'super-admin', label: 'Super Admin', email: 'admin@apexpm.com', icon: Key },
    { id: 'manager', label: 'Manager', email: 'manager@apexpm.com', icon: Briefcase },
    { id: 'owner-portal', label: 'Owner Portal', email: 'owner@apexpm.com', icon: Crown },
    { id: 'tenant-portal', label: 'Tenant Portal', email: 'tenant@apexpm.com', icon: Home },
    { id: 'maintenance-staff', label: 'Maintenance Staff', email: 'maintenance@apexpm.com', icon: Wrench },
    { id: 'collection-manager', label: 'Collection Manager', email: 'collection@apexpm.com', icon: BarChart3 },
  ];

  const handleRoleChange = (role) => {
    setSelectedRole(role.id);
    setEmail(role.email);
  };

  const activeRoleObj = roles.find((r) => r.id === selectedRole) || roles[0];

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  return (
    <div className="py-16 sm:py-24 bg-brand-slate flex items-center justify-center min-h-[85vh] px-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-brand-blue flex items-center justify-center text-white shadow-md">
              <Building2 className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
            <span className="text-2xl font-extrabold text-brand-neutral-dark tracking-tight">WhatsLandlord</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-brand-neutral-dark pt-2">Software Portal Sign In</h1>
          <p className="text-xs text-brand-neutral-muted">Access your property management workspace</p>
        </div>

        {/* Login Card */}
        <Card variant="white" className="p-6 sm:p-8 border-brand-neutral-border shadow-hero-card">
          {isLoggedIn ? (
            <div className="py-6 px-4 text-center space-y-4 animate-fade-in">
              <div className="w-14 h-14 bg-brand-blue text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <ShieldCheck className="w-8 h-8 text-brand-indigo-light" />
              </div>
              <h3 className="text-xl font-extrabold text-brand-neutral-dark">Authentication Successful!</h3>
              <div className="p-3 bg-brand-blue-surface rounded-xl border border-brand-blue/20 text-xs text-brand-blue space-y-1">
                <p className="font-bold uppercase tracking-wider text-[10px]">Active Role Session</p>
                <p className="text-sm font-extrabold text-brand-neutral-dark">{activeRoleObj.label}</p>
                <p className="text-brand-neutral-muted">{email}</p>
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <Link to="/" className="w-full py-3 px-4 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1">
                  <span>Explore Live SaaS Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsLoggedIn(false)}
                  className="w-full py-2.5 px-4 bg-brand-slate hover:bg-brand-slate-accent text-brand-neutral-dark font-bold text-xs rounded-xl transition-colors"
                >
                  Switch Role / Log Out
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* 6 Role Selector Buttons matching exact Netlify demo access */}
              <div className="mb-6 space-y-2">
                <p className="text-[10px] font-bold text-brand-neutral-muted uppercase tracking-wider text-center">Demo Portal Access (Select Role)</p>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((r) => {
                    const Icon = r.icon;
                    const isActive = selectedRole === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleRoleChange(r)}
                        className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-brand-blue text-white border-brand-blue shadow-xs'
                            : 'bg-brand-slate text-brand-neutral-dark border-brand-neutral-border hover:bg-brand-slate-accent'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-brand-indigo-light' : 'text-brand-blue'}`} />
                        <span>{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-brand-neutral-dark mb-1.5">User Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-brand-slate border border-brand-neutral-border text-brand-neutral-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block font-bold text-brand-neutral-dark">Password</label>
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-brand-blue hover:underline">Forgot password?</a>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-brand-slate border border-brand-neutral-border text-brand-neutral-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    required
                  />
                </div>

                <div className="flex items-center justify-between py-1 text-xs">
                  <label className="flex items-center gap-2 text-brand-neutral-muted cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue" />
                    <span>Remember this device for 30 days</span>
                  </label>
                </div>

                <Button type="submit" variant="primary" size="lg" icon={ArrowRight} className="w-full">
                  Enter {activeRoleObj.label.toUpperCase()}
                </Button>
              </form>
            </>
          )}
        </Card>

        {/* Back Link */}
        <div className="text-center text-xs">
          <Link to="/" className="text-brand-neutral-muted hover:text-brand-blue font-semibold">
            ← Return to SaaS Marketing Website
          </Link>
        </div>
      </div>
    </div>
  );
}
