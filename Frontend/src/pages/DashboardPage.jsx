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
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'transactions', label: 'Transactions', icon: 'account_balance_wallet' },
  { id: 'accounts', label: 'Accounts', icon: 'account_balance' },
  { id: 'reports', label: 'Reports', icon: 'equalizer' },
  { id: 'recurring', label: 'Recurring', icon: 'event_repeat' },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <nav className={`fixed left-0 top-0 bottom-0 flex flex-col h-full border-r border-outline-variant/30 glass-strong z-30 transition-all duration-300 ease-in-out ${collapsed ? 'w-[72px]' : 'w-[240px]'} hidden md:flex`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl flex items-center justify-center flex-shrink-0 shadow-glow">
          <span className="material-symbols-outlined text-primary icon-fill text-xl">water_drop</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden animate-fade-in">
            <div className="text-lg text-on-surface tracking-tight font-headline font-bold">FlowTrack</div>
            <div className="font-headline text-[9px] text-on-surface-variant tracking-[0.15em] uppercase">Personal Finance</div>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-3 mb-2 p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all duration-200 flex items-center justify-center"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <span className="material-symbols-outlined text-[18px]">{collapsed ? 'chevron_right' : 'chevron_left'}</span>
      </button>

      {/* Nav Items */}
      <div className="flex flex-col flex-1 px-2.5 gap-0.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            title={collapsed ? item.label : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold tracking-tight transition-all duration-300 rounded-xl ${
              activeTab === item.id
                ? 'text-primary bg-primary/10 border border-primary/20 shadow-glow'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 border border-transparent'
            } ${collapsed ? 'justify-center' : ''}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
              activeTab === item.id ? 'bg-primary/20' : 'bg-surface-container-high'
            }`}>
              <span className={`material-symbols-outlined text-[18px] ${activeTab === item.id ? 'icon-fill' : ''}`}>{item.icon}</span>
            </div>
            {!collapsed && <span className="font-headline">{item.label}</span>}
            {!collapsed && activeTab === item.id && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow"></span>
            )}
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="mb-4 px-2.5">
        <Link
          to="/login"
          title={collapsed ? 'Logout' : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold tracking-tight text-on-surface-variant hover:text-error hover:bg-error/10 border border-transparent hover:border-error/20 rounded-xl transition-all duration-300 ${collapsed ? 'justify-center' : ''}`}
        >
          <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </div>
          {!collapsed && <span className="font-headline">Logout</span>}
        </Link>
      </div>
    </nav>
  );
};

const SummaryCard = ({ title, amount, icon, type, delay = 0 }) => (
  <div className="glass-card-hover rounded-2xl p-5 flex flex-col gap-3 cursor-pointer animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
    <div className="flex justify-between items-start">
      <h2 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.08em] font-body">{title}</h2>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${type === 'expense' ? 'bg-error/10' : 'bg-primary/10'}`}>
        <span className={`material-symbols-outlined text-[20px] ${type === 'expense' ? 'text-error' : 'text-primary'} icon-fill`}>{icon}</span>
      </div>
    </div>
    <div className={`text-[36px] leading-[44px] font-headline font-bold tracking-tight mt-1 tabular-nums ${type === 'expense' ? 'text-error' : 'gradient-text'}`}>
      ₹{amount.toLocaleString('en-IN')}
    </div>
    <div className="flex items-center gap-2 mt-auto pt-1">
      <span className={`material-symbols-outlined text-[16px] ${type === 'expense' ? 'text-error' : 'text-primary'}`}>
        {type === 'expense' ? 'trending_down' : 'trending_up'}
      </span>
      <span className={`text-[12px] ${type === 'expense' ? 'text-error/70' : 'text-primary/70'}`}>
        {type === 'expense' ? '+12% from last month' : '+8% from last month'}
      </span>
    </div>
  </div>
);

const DashboardPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMd = useMediaQuery('(min-width: 768px)');

  const transactions = [
    { id: 1, date: 'Oct 24', description: 'Starbucks Coffee', category: 'Food', account: 'HDFC Bank', amount: -450 },
    { id: 2, date: 'Oct 23', description: 'Uber Ride', category: 'Transport', account: 'ICICI CC', amount: -320 },
    { id: 3, date: 'Oct 23', description: 'Netflix Premium', category: 'Subscriptions', account: 'HDFC Bank', amount: -649 },
    { id: 4, date: 'Oct 22', description: 'Salary Credit', category: 'Income', account: 'SBI Account', amount: 55000 },
    { id: 5, date: 'Oct 21', description: 'Amazon Electronics', category: 'Shopping', account: 'ICICI CC', amount: -2100 },
    { id: 6, date: 'Oct 20', description: 'Electricity Board', category: 'Utilities', account: 'HDFC Bank', amount: -1850 },
    { id: 7, date: 'Oct 19', description: 'Swiggy Order', category: 'Food', account: 'PayTM Wallet', amount: -650 },
    { id: 8, date: 'Oct 18', description: 'Zara Apparel', category: 'Shopping', account: 'ICICI CC', amount: -4500 },
  ];

  const categories = [
    { label: 'Food', amount: 8450, color: 'bg-primary' },
    { label: 'Transport', amount: 4800, color: 'bg-tertiary' },
    { label: 'Shopping', amount: 3600, color: 'bg-accent-blue' },
    { label: 'Subscriptions', amount: 2900, color: 'bg-error' },
    { label: 'Utilities', amount: 2500, color: 'bg-secondary' },
    { label: 'Others', amount: 2100, color: 'bg-outline' },
  ];

  const getCategoryStyle = (cat) => {
    const map = {
      Income: { bg: 'bg-primary/10', text: 'text-primary', icon: 'payments' },
      Food: { bg: 'bg-tertiary/10', text: 'text-tertiary', icon: 'restaurant' },
      Transport: { bg: 'bg-accent-blue/10', text: 'text-accent-blue', icon: 'directions_car' },
      Shopping: { bg: 'bg-accent-purple/10', text: 'text-accent-purple', icon: 'shopping_bag' },
      Subscriptions: { bg: 'bg-error/10', text: 'text-error', icon: 'subscriptions' },
      Utilities: { bg: 'bg-secondary/10', text: 'text-secondary', icon: 'bolt' },
    };
    return map[cat] || { bg: 'bg-outline/10', text: 'text-outline', icon: 'more_horiz' };
  };

  return (
    <div className="text-on-surface min-h-screen flex font-body">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Main Content – dynamically adjusts to sidebar width */}
      <div
        className="flex-1 flex flex-col min-w-0 relative transition-all duration-300"
        style={{ paddingLeft: isMd ? (sidebarCollapsed ? '72px' : '240px') : '0' }}
      >
        {/* Background effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/4 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-accent-purple/3 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header */}
        <header className="w-full h-16 border-b border-outline-variant/30 glass-strong flex justify-between items-center px-6 lg:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <button className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h1 className="text-xl font-headline font-bold gradient-text tracking-tight hidden sm:block">Dashboard</h1>
            <span className="hidden sm:inline-flex px-2 py-0.5 bg-primary/10 rounded-lg text-[10px] font-bold text-primary tracking-wider uppercase border border-primary/20">Pro</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center glass rounded-xl px-3.5 py-2 focus-within:border-primary/50 transition-all duration-300 border border-outline-variant/30">
              <span className="material-symbols-outlined text-on-surface-variant mr-2 text-[18px]">search</span>
              <input
                type="text"
                placeholder="Search transactions..."
                className="bg-transparent border-none text-[13px] font-body text-on-surface placeholder-on-surface-variant/60 focus:outline-none w-44"
              />
            </div>

            <button className="w-9 h-9 glass rounded-xl text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all duration-300 flex items-center justify-center relative group border border-outline-variant/30">
              <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">notifications</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full text-[9px] flex items-center justify-center text-white font-bold">3</span>
            </button>
            <button className="w-9 h-9 glass rounded-xl text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all duration-300 flex items-center justify-center group border border-outline-variant/30">
              <span className="material-symbols-outlined text-[20px] group-hover:rotate-45 transition-transform duration-300">settings</span>
            </button>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary text-[11px] font-bold flex items-center justify-center cursor-pointer shadow-glow hover:shadow-glow-strong transition-shadow duration-300 border border-primary/30">
              S
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-5 lg:p-7 flex flex-col gap-5 overflow-y-auto">
          {/* Welcome */}
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-headline font-bold text-on-surface tracking-tight">Good afternoon, Swaraj 👋</h2>
            <p className="text-body-sm text-on-surface-variant mt-1">Here's your financial overview for October 2024</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SummaryCard title="Total Spent" amount={24350} icon="trending_down" type="expense" delay={100} />
            <SummaryCard title="Total Earned" amount={55000} icon="trending_up" type="income" delay={200} />
            <SummaryCard title="Net Savings" amount={30650} icon="savings" type="income" delay={300} />
          </div>

          {/* Middle Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Spending by Category */}
            <div className="lg:col-span-7 glass-card rounded-2xl p-5 lg:p-6 flex flex-col animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-headline font-bold text-on-surface">Spending by Category</h3>
                <button className="text-[11px] font-bold text-primary hover:text-primary-fixed transition-colors flex items-center gap-1 group uppercase tracking-wider">
                  View Report
                  <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                </button>
              </div>
              <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-8">
                <div className="relative w-44 h-44 rounded-full donut-chart flex-shrink-0">
                  <div className="absolute inset-3.5 rounded-full bg-surface-container flex items-center justify-center flex-col">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Top Category</span>
                    <span className="text-body-lg font-headline font-bold text-on-surface mt-0.5 tabular-nums">Food</span>
                  </div>
                </div>
                <div className="flex-1 w-full flex flex-col gap-1.5">
                  {categories.map((item, idx) => (
                    <div key={item.label} className={`flex justify-between items-center py-2 ${idx !== categories.length - 1 ? 'border-b border-surface-container-highest/50' : ''}`}>
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2.5 h-2.5 rounded-full ${item.color}`}></div>
                        <span className="text-[13px] font-body text-on-surface">{item.label}</span>
                      </div>
                      <span className="text-[15px] font-headline font-semibold text-on-surface tabular-nums">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* This Month Summary */}
            <div className="lg:col-span-5 flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
              <h3 className="text-lg font-headline font-bold text-on-surface">This Month Summary</h3>

              <div className="glass-card-hover rounded-xl p-4 flex items-start gap-3.5 cursor-pointer group">
                <div className="p-2 bg-error/10 rounded-xl text-error flex-shrink-0 group-hover:bg-error/20 transition-colors">
                  <span className="material-symbols-outlined text-[20px] icon-fill">insights</span>
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <h4 className="text-[12px] font-bold text-on-surface">Food Spending Alert</h4>
                  <p className="text-[12px] text-on-surface-variant leading-relaxed">
                    You spent <span className="text-error font-semibold">₹8,450</span> on Food – <span className="text-error font-semibold">15% higher</span> than usual.
                  </p>
                </div>
              </div>

              <div className="glass-card-hover rounded-xl p-4 flex items-start gap-3.5 cursor-pointer group">
                <div className="p-2 bg-secondary/10 rounded-xl text-secondary flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                  <span className="material-symbols-outlined text-[20px] icon-fill">event_upcoming</span>
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <h4 className="text-[12px] font-bold text-on-surface">Upcoming Bill</h4>
                  <p className="text-[12px] text-on-surface-variant leading-relaxed">
                    <span className="text-on-surface font-semibold">Netflix</span> subscription <span className="font-headline font-semibold tabular-nums text-tertiary">₹649</span> is due tomorrow.
                  </p>
                </div>
              </div>

              <div className="glass-card-hover rounded-xl p-4 flex items-start gap-3.5 cursor-pointer group">
                <div className="p-2 bg-primary/10 rounded-xl text-primary flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-[20px] icon-fill">savings</span>
                </div>
                <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                  <h4 className="text-[12px] font-bold text-on-surface">Savings Goal</h4>
                  <p className="text-[12px] text-on-surface-variant leading-relaxed">
                    <span className="text-primary font-semibold">85%</span> towards your goal of <span className="font-headline font-semibold tabular-nums text-primary">₹35,000</span>
                  </p>
                  <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-primary to-primary-fixed rounded-full transition-all duration-1000"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="glass-card rounded-2xl flex flex-col overflow-hidden animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <div className="p-5 border-b border-outline-variant/30 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-headline font-bold text-on-surface">Recent Transactions</h3>
                <span className="px-2 py-0.5 bg-primary/10 rounded-lg text-[10px] font-bold text-primary border border-primary/20">{transactions.length} New</span>
              </div>
              <button className="text-[11px] font-bold text-primary hover:text-primary-fixed transition-colors flex items-center gap-1 group uppercase tracking-wider">
                View All
                <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-surface-container-low/50 border-b border-outline-variant/30 h-11">
                    <th className="pl-5 pr-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Date</th>
                    <th className="px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Description</th>
                    <th className="px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Category</th>
                    <th className="px-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Account</th>
                    <th className="pr-5 pl-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] text-on-surface">
                  {transactions.map((tx) => {
                    const style = getCategoryStyle(tx.category);
                    return (
                      <tr key={tx.id} className="h-14 border-b border-surface-container-highest/30 hover:bg-surface-container-high/30 transition-all duration-200 cursor-pointer group">
                        <td className="pl-5 pr-3 text-on-surface-variant">
                          <div className="flex flex-col">
                            <span className="text-[13px] font-medium">{tx.date}</span>
                            <span className="text-[9px] text-on-surface-variant/50">2024</span>
                          </div>
                        </td>
                        <td className="px-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${style.bg}`}>
                              <span className={`material-symbols-outlined text-[16px] ${style.text}`}>{style.icon}</span>
                            </div>
                            <span className="font-medium group-hover:text-primary transition-colors">{tx.description}</span>
                          </div>
                        </td>
                        <td className="px-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide ${
                            tx.category === 'Income'
                              ? 'bg-primary/10 text-primary border border-primary/20'
                              : 'bg-surface-container-high text-on-surface-variant border border-outline-variant/30'
                          }`}>
                            {tx.category}
                          </span>
                        </td>
                        <td className="px-3">
                          <div className="flex items-center gap-1.5 text-on-surface-variant">
                            <span className="material-symbols-outlined text-[14px]">account_balance</span>
                            <span className="text-[12px]">{tx.account}</span>
                          </div>
                        </td>
                        <td className="pr-5 pl-3 text-right">
                          <span className={`text-[15px] font-headline font-semibold tabular-nums ${tx.amount < 0 ? 'text-error' : 'gradient-text'}`}>
                            {tx.amount < 0 ? '-' : '+'}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
