import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);
  return matches;
};

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
  { id: 'transactions', label: 'Transactions', icon: 'account_balance_wallet', path: '#' },
  { id: 'accounts', label: 'Accounts', icon: 'account_balance', path: '#' },
  { id: 'cards', label: 'Cards', icon: 'credit_card', path: '#' },
  { id: 'budget', label: 'Budget', icon: 'savings', path: '#' },
  { id: 'goals', label: 'Goals', icon: 'flag', path: '#' },
  { id: 'reports', label: 'Reports', icon: 'equalizer', path: '#' },
  { id: 'settings', label: 'Settings', icon: 'settings', path: '/profile' },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  return (
    <nav className={`fixed left-0 top-0 bottom-0 flex flex-col h-full border-r border-outline-variant/30 glass-strong z-30 transition-all duration-300 ease-in-out ${collapsed ? 'w-[72px]' : 'w-[240px]'} hidden md:flex`}>
      <div className={`flex items-center gap-3 px-4 py-5 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl flex items-center justify-center flex-shrink-0 shadow-glow">
          <span className="material-symbols-outlined text-primary icon-fill text-xl">water_drop</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden animate-fade-in">
            <div className="text-lg text-on-surface tracking-tight font-bold">FlowTrack</div>
            <div className="text-[9px] text-on-surface-variant tracking-[0.15em] uppercase font-medium">Personal Finance</div>
          </div>
        )}
      </div>
      <button onClick={() => setCollapsed(!collapsed)} className="mx-3 mb-3 p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all duration-200 flex items-center justify-center">
        <span className="material-symbols-outlined text-[18px]">{collapsed ? 'chevron_right' : 'chevron_left'}</span>
      </button>
      <div className="flex flex-col flex-1 px-3 gap-2">
        {navItems.map((item) => (
          <Link key={item.id} to={item.path} title={collapsed ? item.label : undefined}
            className={`flex items-center gap-3 px-3 py-3 text-[14px] font-semibold tracking-tight transition-all duration-300 rounded-xl ${
              item.id === 'settings'
                ? 'text-primary bg-primary/10 border border-primary/20 shadow-glow'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 border border-transparent'
            } ${collapsed ? 'justify-center' : ''}`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${item.id === 'settings' ? 'bg-primary/20' : 'bg-surface-container-high'}`}>
              <span className={`material-symbols-outlined text-[20px] ${item.id === 'settings' ? 'icon-fill' : ''}`}>{item.icon}</span>
            </div>
            {!collapsed && <span className="font-medium">{item.label}</span>}
            {!collapsed && item.id === 'settings' && <span className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse-glow"></span>}
          </Link>
        ))}
      </div>
      <div className="mb-6 px-3">
        <Link to="/login" title={collapsed ? 'Logout' : undefined}
          className={`flex items-center gap-3 px-3 py-3 text-[14px] font-semibold tracking-tight text-on-surface-variant hover:text-error hover:bg-error/10 border border-transparent hover:border-error/20 rounded-xl transition-all duration-300 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </div>
          {!collapsed && <span className="font-medium">Logout</span>}
        </Link>
      </div>
    </nav>
  );
};

export default function ProfilePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMd = useMediaQuery('(min-width: 768px)');

  return (
    <div className="text-on-surface min-h-screen flex">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      <div className="flex-1 flex flex-col min-w-0 relative transition-all duration-300"
        style={{ paddingLeft: isMd ? (sidebarCollapsed ? '72px' : '240px') : '0' }}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/4 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-accent-purple/3 rounded-full blur-3xl pointer-events-none"></div>

        <main className="flex-1 p-6 lg:p-10 overflow-y-auto flex flex-col items-center">
          <div className="max-w-5xl w-full flex flex-col gap-10 py-6">

            <header className="animate-fade-in-up">
              <h1 className="text-3xl font-bold font-headline text-on-surface mb-2 tracking-tight">Profile & Settings</h1>
              <p className="text-[15px] text-on-surface-variant">Manage your profile, security, and application preferences.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-1 flex flex-col gap-8">

                {/* Profile Card */}
                <section className="glass-card rounded-2xl p-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                  <h2 className="text-xl font-bold font-headline text-on-surface mb-8">Profile</h2>
                  <div className="flex flex-col items-center mb-8">
                    <div className="relative mb-5 group">
                      <img alt="Swaraj Prajapati" className="w-28 h-28 rounded-full border-2 border-primary/30 object-cover shadow-glow"
                        src="https://api.dicebear.com/9.x/notionists/svg?seed=Swaraj&backgroundColor=00e5a0" />
                      <button className="absolute bottom-1 right-1 bg-surface-container-high border border-outline-variant/50 rounded-full p-2.5 text-on-surface hover:text-primary hover:border-primary/50 transition-all duration-300 shadow-elevated group-hover:scale-110">
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                    </div>
                    <h3 className="text-2xl font-bold font-headline text-on-surface">Swaraj Prajapati</h3>
                    <p className="text-sm text-primary mt-2 font-medium bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">ID: FT-849201</p>
                  </div>
                  <div className="flex flex-col gap-6">
                    <div>
                      <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-2.5 ml-1">Full Name</label>
                      <input className="input-field !pl-5 !py-3.5 text-[15px]" readOnly type="text" value="Swaraj Prajapati" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-2.5 ml-1">Email Address</label>
                      <input className="input-field !pl-5 !py-3.5 text-[15px]" type="email" defaultValue="swaraj.prajapati@example.com" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-2.5 ml-1">Phone Number</label>
                      <input className="input-field !pl-5 !py-3.5 text-[15px]" type="tel" defaultValue="+91 98765 43210" />
                    </div>
                    <button className="w-full btn-primary mt-3 !py-4 text-[16px] font-bold tracking-tight">Save Profile</button>
                  </div>
                </section>

                {/* Subscription Card */}
                <section className="glass-card rounded-2xl p-8 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                  <div className="flex justify-between items-start mb-5 relative z-10">
                    <h2 className="text-xl font-bold font-headline text-on-surface">Plan</h2>
                    <span className="px-3 py-1.5 bg-primary/10 text-primary text-[11px] uppercase font-bold tracking-wider rounded-lg border border-primary/20">Active</span>
                  </div>
                  <div className="relative z-10">
                    <div className="text-3xl font-bold font-headline gradient-text mb-2 tracking-tight">Pro Plan</div>
                    <p className="text-[14px] text-on-surface-variant mb-8">Billed annually. Next cycle in 84 days.</p>
                    <div className="flex gap-4">
                      <button className="flex-1 py-3.5 bg-surface-container-high border border-outline-variant/40 text-on-surface text-[15px] font-bold rounded-xl hover:border-primary/40 hover:text-primary transition-all duration-300">Manage</button>
                      <button className="flex-1 py-3.5 bg-primary/10 border border-primary/30 text-primary text-[15px] font-bold rounded-xl hover:bg-primary/20 transition-all duration-300">Upgrade</button>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-2 flex flex-col gap-8">

                {/* Preferences */}
                <section className="glass-card rounded-2xl p-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                  <h2 className="text-xl font-bold font-headline text-on-surface mb-8 border-b border-outline-variant/30 pb-5">Preferences</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2 ml-1">
                        <span className="material-symbols-outlined text-[16px]">payments</span> Base Currency
                      </label>
                      <div className="relative group">
                        <select className="input-field !pl-5 !py-3.5 text-[15px] appearance-none cursor-pointer group-hover:border-primary/40">
                          <option value="INR">INR (₹) - Indian Rupee</option>
                          <option value="USD">USD ($) - US Dollar</option>
                          <option value="EUR">EUR (€) - Euro</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none group-hover:text-primary transition-colors">expand_more</span>
                      </div>
                      <p className="text-[12px] text-on-surface-variant/70 mt-2.5 ml-1">All dashboard metrics will use this currency.</p>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2 ml-1">
                        <span className="material-symbols-outlined text-[16px]">language</span> Language
                      </label>
                      <div className="relative group">
                        <select className="input-field !pl-5 !py-3.5 text-[15px] appearance-none cursor-pointer group-hover:border-primary/40">
                          <option value="en-IN">English (India)</option>
                          <option value="hi-IN">Hindi</option>
                          <option value="en-US">English (US)</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none group-hover:text-primary transition-colors">expand_more</span>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-4 flex items-center gap-2 ml-1">
                        <span className="material-symbols-outlined text-[16px]">palette</span> Interface Theme
                      </label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        {['light', 'dark', 'system'].map((t) => (
                          <label key={t} className="flex-1 cursor-pointer">
                            <input type="radio" name="theme" value={t} className="peer sr-only" defaultChecked={t === 'dark'} />
                            <div className="h-14 flex items-center justify-center gap-2.5 border border-outline-variant/40 rounded-xl text-on-surface-variant font-bold text-[15px] peer-checked:border-primary peer-checked:text-primary peer-checked:bg-primary/10 hover:bg-surface-container-high/50 transition-all">
                              <span className="material-symbols-outlined text-[20px]">{t === 'light' ? 'light_mode' : t === 'dark' ? 'dark_mode' : 'desktop_windows'}</span>
                              {t.charAt(0).toUpperCase() + t.slice(1)}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Account Security */}
                <section className="glass-card rounded-2xl p-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                  <h2 className="text-xl font-bold font-headline text-on-surface mb-8 border-b border-outline-variant/30 pb-5">Account Security</h2>
                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-7 border-b border-outline-variant/20">
                      <div>
                        <h3 className="text-[16px] font-bold text-on-surface flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-primary text-[22px]">password</span> Password
                        </h3>
                        <p className="text-[14px] text-on-surface-variant mt-2">Last changed 4 months ago</p>
                      </div>
                      <button className="py-3 px-6 bg-surface-container-high border border-outline-variant/40 text-on-surface text-[15px] font-bold rounded-xl hover:border-primary/40 hover:text-primary transition-all duration-300 whitespace-nowrap">
                        Change Password
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-7 border-b border-outline-variant/20">
                      <div>
                        <h3 className="text-[16px] font-bold text-on-surface flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-primary text-[22px]">verified_user</span> Two-Factor Authentication
                        </h3>
                        <p className="text-[14px] text-on-surface-variant mt-2">Add an extra layer of security to your account.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-12 h-7 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[22px] after:w-[22px] after:transition-all peer-checked:bg-primary shadow-elevated"></div>
                      </label>
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-on-surface mb-5">Active Sessions</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[480px]">
                          <thead>
                            <tr className="border-b border-outline-variant/30 h-12">
                              <th className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Device</th>
                              <th className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Location</th>
                              <th className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody className="text-[14px]">
                            <tr className="border-b border-outline-variant/10 h-14 group">
                              <td className="text-on-surface flex items-center gap-2.5 h-14">
                                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">laptop_mac</span> MacBook Pro (Safari)
                              </td>
                              <td className="text-on-surface-variant">Mumbai, India</td>
                              <td className="text-primary font-bold text-[12px] tracking-wide uppercase">Current</td>
                              <td></td>
                            </tr>
                            <tr className="h-14 group">
                              <td className="text-on-surface flex items-center gap-2.5 h-14">
                                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">smartphone</span> iPhone 13 (App)
                              </td>
                              <td className="text-on-surface-variant">Mumbai, India</td>
                              <td className="text-on-surface-variant/70 text-[13px]">Active 2d ago</td>
                              <td className="text-right">
                                <button className="text-error hover:text-error-container transition-colors text-[12px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100">Revoke</button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Notifications */}
                <section className="glass-card rounded-2xl p-8 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                  <h2 className="text-xl font-bold font-headline text-on-surface mb-8 border-b border-outline-variant/30 pb-5">Notification Settings</h2>
                  <div className="flex flex-col gap-7">
                    {[
                      { title: 'New Transaction Alerts', desc: 'Get notified for every inflow or outflow.', on: true },
                      { title: 'Weekly Report', desc: 'A summary of your spending and income every Sunday.', on: true },
                      { title: 'Subscription Reminders', desc: 'Alert 3 days before any tracked subscription renews.', on: false },
                    ].map((n, i) => (
                      <div key={i} className="flex items-center justify-between gap-6">
                        <div>
                          <h3 className="text-[16px] font-bold text-on-surface">{n.title}</h3>
                          <p className="text-[14px] text-on-surface-variant mt-1.5">{n.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                          <input type="checkbox" className="sr-only peer" defaultChecked={n.on} />
                          <div className="w-12 h-7 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[22px] after:w-[22px] after:transition-all peer-checked:bg-primary shadow-elevated"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </section>

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
