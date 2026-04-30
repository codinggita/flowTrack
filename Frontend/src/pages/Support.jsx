import { useState, useEffect } from 'react';
import { api } from '../services/api';

// ── Helpers ─────────────────────────────────────────────────────────────
const timeAgo = (date) => {
  const secs = Math.floor((Date.now() - new Date(date)) / 1000);
  if (secs < 60)    return 'just now';
  if (secs < 3600)  return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return new Date(date).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
};

const fullDate = (date) => new Date(date).toLocaleString('en-IN', {
  day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit',
});

// ── Status config ────────────────────────────────────────────────────────
const STATUS = {
  open:              { label:'Open',             color:'#42e5b0', bg:'rgba(66,229,176,0.1)'   },
  in_progress:       { label:'In Progress',      color:'#ffd080', bg:'rgba(255,208,128,0.1)' },
  waiting_for_user:  { label:'Waiting for You',  color:'#ffbca2', bg:'rgba(255,188,162,0.1)' },
  resolved:          { label:'Resolved',         color:'#42b0e5', bg:'rgba(66,176,229,0.1)'  },
  closed:            { label:'Closed',           color:'#85948c', bg:'rgba(133,148,140,0.1)' },
};

const PRIORITY = {
  low:    { label:'Low',    color:'#85948c' },
  medium: { label:'Medium', color:'#ffd080' },
  high:   { label:'High',   color:'#ffbca2' },
  urgent: { label:'Urgent', color:'#ff4d4d' },
};

const CATEGORIES = [
  { value:'account',       label:'Account & Login'         },
  { value:'transactions',  label:'Transactions'            },
  { value:'accounts',      label:'Bank Accounts / UPI'     },
  { value:'reports',       label:'Reports & Charts'        },
  { value:'subscriptions', label:'Subscriptions'           },
  { value:'billing',       label:'Billing & Plans'         },
  { value:'bug',           label:'Bug / App Error'         },
  { value:'feature',       label:'Feature Request'         },
  { value:'data',          label:'Data Export / Deletion'  },
  { value:'other',         label:'Other'                   },
];

// ── FAQ Data ─────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: 'How do I add a transaction?',
    a: 'Go to the Transactions page and click "+ Add Transaction" in the top right. Fill in the description, amount, category, account, and date. Click Save. Your account balance updates automatically.',
  },
  {
    q: 'Why is my net worth showing incorrectly?',
    a: 'Net worth is calculated by adding all your account balances. For credit cards, the outstanding amount is subtracted. Make sure your account balances are correct in the Accounts page. You can update them by clicking on an account.',
  },
  {
    q: 'Can FlowTrack access my real bank account?',
    a: 'No. FlowTrack does NOT connect to your actual bank. All data is entered manually by you. We never ask for your banking credentials. This is by design to keep your financial data private and secure.',
  },
  {
    q: 'How do I import transactions from a CSV file?',
    a: 'Go to Transactions → click "CSV Upload". Your CSV must have columns: date, description, amount, type (income/expense), category. Download our sample CSV template for the correct format.',
  },
  {
    q: 'How do I set up subscription tracking?',
    a: 'Go to the Recurring page → click "+ Add New". Enter the service name, plan, amount, billing cycle (monthly/yearly), and next renewal date. FlowTrack will notify you 3 and 7 days before renewal.',
  },
  {
    q: 'Why are my charts empty?',
    a: 'Charts are built from your real transaction data. If you just created your account, add some transactions first. Make sure the period filter (This Month / This Quarter) matches when your transactions were added.',
  },
  {
    q: 'How do I change my password?',
    a: 'Go to Settings → Security tab → Change Password section. Enter your current password and your new password (minimum 8 characters). Changing your password will log out all other devices for security.',
  },
  {
    q: 'Can I export my data?',
    a: 'Go to Transactions page → filter as needed → the export feature allows CSV download of your transactions. Full account data export can be requested via Settings → Privacy & Consent.',
  },
  {
    q: 'How do I delete my account?',
    a: 'Go to Settings → Privacy & Consent tab → "Request Account Deletion". We will process your request within 30 days as required by Indian data protection law (DPDP Act 2023).',
  },
  {
    q: 'Is my financial data secure?',
    a: 'Yes. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Passwords are hashed with bcrypt and never stored in plain text. We do not sell your data to anyone. Read our Privacy Policy for full details.',
  },
  {
    q: 'Why did my notification badge not go away?',
    a: 'Click the bell icon to open the notification panel, then click "Mark all read". The badge updates every 30 seconds automatically. If it persists, try refreshing the page.',
  },
  {
    q: 'What is the Optimization Score on the Recurring page?',
    a: 'This score (0-100%) measures how efficiently you use your subscriptions. A subscription is considered "unused" if no matching transaction appears in the last 30 days. Each unused subscription deducts 10 points. 92%+ is excellent.',
  },
];

// ── Help Articles ─────────────────────────────────────────────────────────
const HELP_ARTICLES = [
  {
    icon:     '🚀',
    title:    'Getting Started with FlowTrack',
    desc:     'Set up your first account, add transactions, and understand your dashboard.',
    steps:    ['Create your account', 'Add your bank/UPI accounts', 'Start adding transactions', 'View your dashboard charts'],
    time:     '5 min read',
    category: 'Beginner',
  },
  {
    icon:     '💸',
    title:    'Understanding Transaction Categories',
    desc:     'Learn how to categorize transactions correctly for accurate reports.',
    steps:    ['Use Income for salary, freelance, dividends', 'Use Food for restaurants, groceries, delivery', 'Use Transport for Uber, fuel, metro', 'Use Housing for rent, maintenance'],
    time:     '3 min read',
    category: 'Transactions',
  },
  {
    icon:     '📊',
    title:    'Reading Your Financial Reports',
    desc:     'Understand what each chart and metric means for your financial health.',
    steps:    ['Donut chart = spending breakdown by category', 'Area chart = income vs expenses over time', 'Merchant bars = where you spend most', 'Savings margin = % of income saved'],
    time:     '4 min read',
    category: 'Reports',
  },
  {
    icon:     '🔔',
    title:    'Setting Up Smart Notifications',
    desc:     'Configure alerts so you never miss an important financial event.',
    steps:    ['Go to Settings → Notifications', 'Enable Transaction Alerts for large expenses', 'Enable Subscription Reminders to avoid surprises', 'Enable Weekly Report for Sunday summaries'],
    time:     '2 min read',
    category: 'Settings',
  },
  {
    icon:     '📱',
    title:    'Importing Transactions via CSV',
    desc:     'Bulk import your transaction history from any bank statement.',
    steps:    ['Export statement as CSV from your bank', 'Format columns: date, description, amount, type, category', 'Go to Transactions → CSV Upload', 'Select your account and upload the file'],
    time:     '5 min read',
    category: 'Transactions',
  },
  {
    icon:     '🛡️',
    title:    'Keeping Your Account Secure',
    desc:     'Best practices for protecting your FlowTrack account.',
    steps:    ['Use a strong unique password (12+ characters)', 'Enable Two-Factor Authentication in Settings', 'Review active sessions regularly', 'Never share your login credentials'],
    time:     '3 min read',
    category: 'Security',
  },
];

// ── Sub-components ────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const cfg = STATUS[status] || STATUS.open;
  return (
    <span style={{
      background:   cfg.bg,
      color:        cfg.color,
      border:       `1px solid ${cfg.color}44`,
      borderRadius: 4,
      fontSize:     11,
      fontWeight:   700,
      padding:      '3px 10px',
      textTransform:'uppercase',
      letterSpacing:'0.05em',
    }}>{cfg.label}</span>
  );
};

const PriorityDot = ({ priority }) => {
  const cfg = PRIORITY[priority] || PRIORITY.medium;
  return (
    <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'var(--muted)' }}>
      <span style={{ width:7, height:7, borderRadius:'50%', background:cfg.color, display:'inline-block' }} />
      {cfg.label}
    </span>
  );
};

const Card = ({ children, style={} }) => (
  <div className="card" style={{ padding:24, ...style }}>{children}</div>
);

const SectionTitle = ({ children }) => (
  <h3 style={{ fontFamily:'var(--font-display)', fontSize:18, fontWeight:700, marginBottom:16 }}>{children}</h3>
);

const Toast = ({ msg, type }) => {
  if (!msg) return null;
  return (
    <div style={{
      position:'fixed', bottom:24, right:24, zIndex:9999,
      background: type==='error' ? '#2d1111' : '#112d1f',
      border: `1px solid ${type==='error' ? 'var(--red)' : 'var(--green)'}`,
      borderRadius:10, padding:'14px 20px',
      color: type==='error' ? 'var(--red)' : 'var(--green)',
      fontSize:13, fontWeight:600,
      animation:'fadeSlideUp 0.3s ease',
    }}>
      {type==='error' ? '❌' : '✅'} {msg}
    </div>
  );
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function Support() {
  const [activeTab,      setActiveTab]      = useState('overview');
  const [tickets,        setTickets]        = useState([]);
  const [stats,          setStats]          = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading,        setLoading]        = useState(false);
  const [toast,          setToast]          = useState({ msg:'', type:'success' });
  const [expandedFaq,    setExpandedFaq]    = useState(null);
  const [expandedArticle,setExpandedArticle]= useState(null);
  const [replyText,      setReplyText]      = useState('');
  const [submitting,     setSubmitting]     = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject:'', category:'', description:'', priority:'medium',
  });

  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:'', type:'success' }), 3500);
  };

  // Fetch tickets and stats
  useEffect(() => {
    if (activeTab === 'tickets' || activeTab === 'overview') {
      setLoading(true);
      Promise.all([api.getTickets(), api.getSupportStats()])
        .then(([ticketsRes, statsRes]) => {
          setTickets(ticketsRes.data || []);
          setStats(statsRes.data);
        })
        .catch(() => showToast('Failed to load support data', 'error'))
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  // Submit new ticket
  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!ticketForm.subject || !ticketForm.category || !ticketForm.description) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    try {
      setSubmitting(true);
      const res = await api.createTicket(ticketForm);
      showToast(`Ticket ${res.data.ticketId} submitted! Check your email for confirmation.`);
      setTicketForm({ subject:'', category:'', description:'', priority:'medium' });
      setActiveTab('tickets');
      const ticketsRes = await api.getTickets();
      setTickets(ticketsRes.data || []);
    } catch (err) {
      showToast(err.message || 'Failed to submit ticket', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Load single ticket
  const handleViewTicket = async (ticket) => {
    try {
      const res = await api.getTicket(ticket._id);
      setSelectedTicket(res.data);
      setActiveTab('ticket-detail');
    } catch (err) {
      showToast('Failed to load ticket', 'error');
    }
  };

  // Reply to ticket
  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      setSubmitting(true);
      const res = await api.replyToTicket(selectedTicket._id, { message: replyText });
      setSelectedTicket(res.data);
      setReplyText('');
      showToast('Reply sent');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Close ticket
  const handleClose = async () => {
    if (!confirm('Close this ticket?')) return;
    try {
      await api.closeTicket(selectedTicket._id);
      setSelectedTicket(t => ({ ...t, status:'closed' }));
      showToast('Ticket closed');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Rate ticket
  const handleRate = async (score) => {
    try {
      await api.rateTicket(selectedTicket._id, { score });
      setSelectedTicket(t => ({ ...t, status:'closed', rating:{ score } }));
      showToast('Thank you for your feedback! ⭐');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const tabs = [
    { id:'overview', label:'Overview'       },
    { id:'faq',      label:'FAQ'            },
    { id:'articles', label:'Help Articles'  },
    { id:'new',      label:'New Ticket'     },
    { id:'tickets',  label:'My Tickets'     },
  ];

  return (
    <div className="page-transition" style={{ maxWidth:960, margin:'0 auto' }}>
      <Toast msg={toast.msg} type={toast.type} />

      {/* Page Header */}
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:700 }}>
          Support Center
        </h1>
        <p style={{ color:'var(--muted)', marginTop:4, fontSize:14 }}>
          Get help, browse articles, or contact our team.
        </p>
      </div>

      {/* Tabs */}
      {activeTab !== 'ticket-detail' && (
        <div style={{
          display:'flex', gap:4, borderBottom:'1px solid var(--border)',
          marginBottom:28, overflowX:'auto', paddingBottom:1,
        }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                background:'none', border:'none',
                borderBottom: activeTab===tab.id ? '2px solid var(--green)' : '2px solid transparent',
                color:        activeTab===tab.id ? 'var(--green)' : 'var(--muted)',
                padding:'10px 16px', cursor:'pointer',
                fontSize:13, fontWeight:600, whiteSpace:'nowrap',
                marginBottom:-1, transition:'all 0.15s',
              }}>
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* ── TAB: OVERVIEW ──────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div>
          {/* Stats */}
          {stats && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
              {[
                { label:'Total Tickets',    value: stats.total,    icon:'🎫', color:'var(--text)'  },
                { label:'Open Tickets',     value: stats.open,     icon:'🔓', color:'var(--orange)'},
                { label:'Resolved Tickets', value: stats.resolved, icon:'✅', color:'var(--green)' },
              ].map(s => (
                <div key={s.label} className="card" style={{ padding:20, textAlign:'center' }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:32,
                    fontWeight:800, color:s.color }}>{s.value}</div>
                  <div style={{ color:'var(--muted)', fontSize:12, marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16, marginBottom:24 }}>
            {[
              {
                icon:'🎫', title:'Submit a Ticket', color:'#42e5b0',
                desc:'Describe your issue and our team will respond within 24 hours.',
                action: () => setActiveTab('new'),
                label:'New Ticket',
              },
              {
                icon:'💬', title:'Live Chat', color:'#ffd080',
                desc:'Chat with us in real time. Available Mon–Sat, 9am–6pm IST.',
                action: () => {
                  // Tawk.to live chat (free)
                  if (window.Tawk_API) window.Tawk_API.toggle();
                  else showToast('Loading live chat...', 'info');
                },
                label:'Start Chat',
              },
              {
                icon:'📚', title:'Browse Help Articles', color:'#42b0e5',
                desc:'Step-by-step guides for every feature in FlowTrack.',
                action: () => setActiveTab('articles'),
                label:'View Articles',
              },
              {
                icon:'❓', title:'FAQ', color:'#ffbca2',
                desc:'Quick answers to the most common questions.',
                action: () => setActiveTab('faq'),
                label:'Browse FAQ',
              },
            ].map(item => (
              <div key={item.title} className="card"
                style={{
                  padding:24, cursor:'pointer',
                  borderLeft:`3px solid ${item.color}44`,
                  transition:'all 0.2s',
                }}
                onClick={item.action}
                onMouseOver={e => e.currentTarget.style.borderColor = item.color}
                onMouseOut={e  => e.currentTarget.style.borderColor = `${item.color}44`}
              >
                <div style={{ fontSize:32, marginBottom:12 }}>{item.icon}</div>
                <h3 style={{ fontFamily:'var(--font-display)', fontSize:16,
                  fontWeight:700, marginBottom:6 }}>{item.title}</h3>
                <p style={{ color:'var(--muted)', fontSize:13, lineHeight:1.6,
                  marginBottom:16 }}>{item.desc}</p>
                <button className="btn-ghost"
                  style={{ height:36, padding:'0 16px', fontSize:13,
                    color:item.color, borderColor:`${item.color}44` }}>
                  {item.label} →
                </button>
              </div>
            ))}
          </div>

          {/* System Status */}
          <Card>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <SectionTitle>System Status</SectionTitle>
                <p style={{ color:'var(--muted)', fontSize:13, marginTop:-12 }}>
                  All FlowTrack services are operational.
                </p>
              </div>
              <div style={{
                display:'flex', alignItems:'center', gap:8,
                background:'rgba(66,229,176,0.1)', border:'1px solid rgba(66,229,176,0.2)',
                borderRadius:8, padding:'8px 16px',
              }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--green)',
                  animation:'pulse 2s ease infinite' }} />
                <span style={{ color:'var(--green)', fontSize:13, fontWeight:700 }}>All Systems Operational</span>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginTop:16 }}>
              {[
                { name:'API Server',      status:'Operational', uptime:'99.9%' },
                { name:'Database',        status:'Operational', uptime:'99.8%' },
                { name:'Email Service',   status:'Operational', uptime:'99.7%' },
              ].map(s => (
                <div key={s.name} style={{
                  background:'var(--card-high)', border:'1px solid var(--border)',
                  borderRadius:8, padding:'12px 16px',
                  display:'flex', justifyContent:'space-between', alignItems:'center',
                }}>
                  <span style={{ fontSize:13, fontWeight:600 }}>{s.name}</span>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                      <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--green)' }} />
                      <span style={{ fontSize:11, color:'var(--green)', fontWeight:600 }}>{s.status}</span>
                    </div>
                    <span style={{ fontSize:11, color:'var(--muted)' }}>{s.uptime} uptime</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Contact Info */}
          <Card style={{ marginTop:16 }}>
            <SectionTitle>Contact Information</SectionTitle>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
              {[
                { icon:'📧', label:'Email Support', value:'swaraj.prajapati.cg@gmail.com', sub:'Response within 24h' },
                { icon:'📱', label:'Phone Support', value:'+91 9229095823', sub:'Mon–Sat, 9am–6pm IST' },
                { icon:'📍', label:'Location',      value:'India', sub:'Data stored in India' },
              ].map(item => (
                <div key={item.label} style={{
                  background:'var(--card-high)', border:'1px solid var(--border)',
                  borderRadius:8, padding:'16px',
                }}>
                  <div style={{ fontSize:24, marginBottom:8 }}>{item.icon}</div>
                  <p style={{ fontSize:12, color:'var(--muted)', marginBottom:4 }}>{item.label}</p>
                  <p style={{ fontSize:14, fontWeight:600 }}>{item.value}</p>
                  <p style={{ fontSize:11, color:'var(--muted)', marginTop:2 }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB: FAQ ────────────────────────────────────────────────────── */}
      {activeTab === 'faq' && (
        <Card>
          <SectionTitle>Frequently Asked Questions</SectionTitle>
          <p style={{ color:'var(--muted)', fontSize:13, marginBottom:24, marginTop:-12 }}>
            {FAQ_ITEMS.length} questions answered. Can't find yours?{' '}
            <button onClick={() => setActiveTab('new')}
              style={{ background:'none', border:'none', color:'var(--green)',
                cursor:'pointer', fontSize:13, fontWeight:600 }}>
              Submit a ticket →
            </button>
          </p>

          {FAQ_ITEMS.map((item, i) => (
            <div key={i}
              style={{
                border:'1px solid var(--border)', borderRadius:8,
                marginBottom:8, overflow:'hidden',
                transition:'border-color 0.2s',
                borderColor: expandedFaq===i ? 'var(--green)' : 'var(--border)',
              }}>
              <button
                onClick={() => setExpandedFaq(expandedFaq===i ? null : i)}
                style={{
                  width:'100%', background:'var(--card-high)',
                  border:'none', padding:'16px 20px',
                  display:'flex', justifyContent:'space-between', alignItems:'center',
                  cursor:'pointer', textAlign:'left',
                }}>
                <span style={{ fontSize:14, fontWeight:600, color:'var(--text)', flex:1 }}>{item.q}</span>
                <span style={{
                  fontSize:18, color:'var(--green)',
                  transform: expandedFaq===i ? 'rotate(45deg)' : 'rotate(0deg)',
                  transition:'transform 0.2s', flexShrink:0, marginLeft:12,
                }}>+</span>
              </button>
              {expandedFaq === i && (
                <div style={{
                  padding:'16px 20px',
                  background:'rgba(66,229,176,0.03)',
                  borderTop:'1px solid var(--border)',
                  animation:'fadeSlideUp 0.2s ease',
                }}>
                  <p style={{ color:'#bbcac1', fontSize:13, lineHeight:1.8, margin:0 }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </Card>
      )}

      {/* ── TAB: HELP ARTICLES ──────────────────────────────────────────── */}
      {activeTab === 'articles' && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16, marginBottom:16 }}>
            {HELP_ARTICLES.map((article, i) => (
              <div key={i} className="card"
                style={{
                  padding:24, cursor:'pointer',
                  transition:'border-color 0.2s',
                }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                  <span style={{ fontSize:28 }}>{article.icon}</span>
                  <div style={{ display:'flex', gap:6 }}>
                    <span style={{ fontSize:10, fontWeight:700,
                      background:'var(--card-high)', color:'var(--muted)',
                      border:'1px solid var(--border)', borderRadius:4,
                      padding:'2px 8px', textTransform:'uppercase' }}>
                      {article.category}
                    </span>
                    <span style={{ fontSize:10, color:'var(--muted)', padding:'2px 0' }}>
                      {article.time}
                    </span>
                  </div>
                </div>
                <h3 style={{ fontFamily:'var(--font-display)', fontSize:15,
                  fontWeight:700, marginBottom:8 }}>{article.title}</h3>
                <p style={{ color:'var(--muted)', fontSize:13, lineHeight:1.6,
                  marginBottom:16 }}>{article.desc}</p>
                <button
                  onClick={() => setExpandedArticle(expandedArticle===i ? null : i)}
                  className="btn-ghost"
                  style={{ height:34, padding:'0 14px', fontSize:12 }}>
                  {expandedArticle===i ? 'Collapse ↑' : 'Read Article →'}
                </button>
                {expandedArticle === i && (
                  <div style={{
                    marginTop:16, padding:'16px',
                    background:'rgba(66,229,176,0.04)',
                    border:'1px solid rgba(66,229,176,0.15)',
                    borderRadius:8,
                    animation:'fadeSlideUp 0.2s ease',
                  }}>
                    <p style={{ fontSize:12, fontWeight:700, color:'var(--muted)',
                      letterSpacing:'0.07em', textTransform:'uppercase', marginBottom:10 }}>
                      Steps
                    </p>
                    {article.steps.map((step, j) => (
                      <div key={j} style={{ display:'flex', gap:10, marginBottom:8 }}>
                        <span style={{
                          width:22, height:22, borderRadius:'50%',
                          background:'var(--green)', color:'#003828',
                          display:'flex', alignItems:'center', justifyContent:'center',
                          fontSize:11, fontWeight:800, flexShrink:0,
                        }}>{j+1}</span>
                        <span style={{ fontSize:13, color:'#bbcac1', lineHeight:1.5, paddingTop:2 }}>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: NEW TICKET ──────────────────────────────────────────────── */}
      {activeTab === 'new' && (
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20 }}>
          <Card>
            <SectionTitle>Submit a Support Ticket</SectionTitle>
            <p style={{ color:'var(--muted)', fontSize:13, marginTop:-8, marginBottom:20 }}>
              Describe your issue in detail. We respond within 24 hours.
            </p>

            <form onSubmit={handleSubmitTicket} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <label className="label-text">Category *</label>
                <select className="input-field" value={ticketForm.category}
                  onChange={e => setTicketForm(f => ({ ...f, category:e.target.value }))}>
                  <option value="">Select a category...</option>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              <div>
                <label className="label-text">Subject *</label>
                <input className="input-field"
                  placeholder="Brief description of your issue"
                  value={ticketForm.subject}
                  onChange={e => setTicketForm(f => ({ ...f, subject:e.target.value }))}
                  maxLength={150}
                />
                <p style={{ color:'var(--muted)', fontSize:11, marginTop:4 }}>
                  {ticketForm.subject.length}/150
                </p>
              </div>

              <div>
                <label className="label-text">Priority</label>
                <div style={{ display:'flex', gap:8 }}>
                  {Object.entries(PRIORITY).map(([key, cfg]) => (
                    <button key={key} type="button"
                      onClick={() => setTicketForm(f => ({ ...f, priority:key }))}
                      style={{
                        flex:1, height:36, border:'1px solid',
                        borderColor: ticketForm.priority===key ? cfg.color : 'var(--border)',
                        borderRadius:6, background: ticketForm.priority===key ? `${cfg.color}18` : 'transparent',
                        color: ticketForm.priority===key ? cfg.color : 'var(--muted)',
                        fontSize:12, fontWeight:600, cursor:'pointer', transition:'all 0.15s',
                      }}>
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label-text">Description *</label>
                <textarea
                  className="input-field"
                  placeholder="Please describe your issue in detail. Include what you were doing, what happened, and what you expected to happen."
                  value={ticketForm.description}
                  onChange={e => setTicketForm(f => ({ ...f, description:e.target.value }))}
                  rows={6}
                  maxLength={2000}
                  style={{ resize:'vertical', minHeight:120 }}
                />
                <p style={{ color:'var(--muted)', fontSize:11, marginTop:4 }}>
                  {ticketForm.description.length}/2000 characters
                </p>
              </div>

              <button type="submit" className="btn-primary"
                disabled={submitting}
                style={{ height:48, fontSize:14 }}>
                {submitting ? 'Submitting...' : '🎫 Submit Ticket'}
              </button>
            </form>
          </Card>

          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <Card>
              <h3 style={{ fontFamily:'var(--font-display)', fontSize:15, fontWeight:700, marginBottom:12 }}>
                💡 Before submitting
              </h3>
              {[
                'Check our FAQ for quick answers',
                'Browse Help Articles for step-by-step guides',
                'Include as much detail as possible',
                'Mention your account ID (found in Settings)',
              ].map((tip, i) => (
                <div key={i} style={{ display:'flex', gap:8, marginBottom:8 }}>
                  <span style={{ color:'var(--green)', fontSize:14, flexShrink:0 }}>✓</span>
                  <span style={{ fontSize:12, color:'var(--muted)', lineHeight:1.5 }}>{tip}</span>
                </div>
              ))}
            </Card>

            <Card>
              <h3 style={{ fontFamily:'var(--font-display)', fontSize:15, fontWeight:700, marginBottom:12 }}>
                ⏰ Response Times
              </h3>
              {[
                { priority:'Urgent', time:'2–4 hours',  color:'#ff4d4d' },
                { priority:'High',   time:'4–8 hours',  color:'#ffbca2' },
                { priority:'Medium', time:'24 hours',   color:'#ffd080' },
                { priority:'Low',    time:'48–72 hours',color:'#85948c' },
              ].map(r => (
                <div key={r.priority} style={{ display:'flex', justifyContent:'space-between',
                  padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                  <span style={{ fontSize:13, color:r.color, fontWeight:600 }}>{r.priority}</span>
                  <span style={{ fontSize:12, color:'var(--muted)' }}>{r.time}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* ── TAB: MY TICKETS ──────────────────────────────────────────────── */}
      {activeTab === 'tickets' && (
        <Card>
          <SectionTitle>My Support Tickets</SectionTitle>

          {loading ? (
            <div style={{ padding:'40px 0', textAlign:'center', color:'var(--muted)' }}>Loading...</div>
          ) : tickets.length === 0 ? (
            <div style={{ padding:'48px 0', textAlign:'center' }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🎫</div>
              <p style={{ color:'var(--text)', fontWeight:600, marginBottom:8 }}>No tickets yet</p>
              <p style={{ color:'var(--muted)', fontSize:13, marginBottom:20 }}>
                Need help? Submit your first support ticket.
              </p>
              <button className="btn-primary" onClick={() => setActiveTab('new')}
                style={{ height:40, padding:'0 24px', fontSize:14 }}>
                + New Ticket
              </button>
            </div>
          ) : (
            tickets.map((ticket, i) => (
              <div key={ticket._id}
                className={`anim-fade-up delay-${Math.min(i,8)}`}
                onClick={() => handleViewTicket(ticket)}
                style={{
                  display:'flex', alignItems:'center', gap:16,
                  padding:'16px', marginBottom:8,
                  background:'var(--card-high)', border:'1px solid var(--border)',
                  borderRadius:8, cursor:'pointer', transition:'border-color 0.15s',
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = 'var(--green)'}
                onMouseOut={e  => e.currentTarget.style.borderColor = 'var(--border)'}>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                    <span style={{ fontSize:13, fontWeight:700 }}>{ticket.ticketId}</span>
                    <StatusBadge status={ticket.status} />
                    <PriorityDot priority={ticket.priority} />
                  </div>
                  <p style={{ fontSize:14, fontWeight:600, marginBottom:2 }}>{ticket.subject}</p>
                  <p style={{ fontSize:12, color:'var(--muted)' }}>
                    {CATEGORIES.find(c => c.value===ticket.category)?.label} · {timeAgo(ticket.createdAt)}
                  </p>
                </div>
                <span style={{ color:'var(--muted)', fontSize:20 }}>›</span>
              </div>
            ))
          )}
        </Card>
      )}

      {/* ── TICKET DETAIL VIEW ─────────────────────────────────────────── */}
      {activeTab === 'ticket-detail' && selectedTicket && (
        <div>
          <button onClick={() => setActiveTab('tickets')}
            style={{ background:'none', border:'1px solid var(--border)', borderRadius:6,
              color:'var(--muted)', padding:'6px 14px', cursor:'pointer',
              fontSize:13, marginBottom:20 }}>
            ← Back to Tickets
          </button>

          <Card>
            {/* Ticket Header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                  <span style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:700,
                    color:'var(--green)' }}>{selectedTicket.ticketId}</span>
                  <StatusBadge status={selectedTicket.status} />
                  <PriorityDot priority={selectedTicket.priority} />
                </div>
                <h2 style={{ fontFamily:'var(--font-display)', fontSize:18, fontWeight:700 }}>
                  {selectedTicket.subject}
                </h2>
                <p style={{ color:'var(--muted)', fontSize:12, marginTop:4 }}>
                  {CATEGORIES.find(c=>c.value===selectedTicket.category)?.label} ·
                  Opened {fullDate(selectedTicket.createdAt)}
                </p>
              </div>
              {selectedTicket.isOpen && (
                <button onClick={handleClose} className="btn-ghost"
                  style={{ height:36, padding:'0 16px', fontSize:13,
                    color:'var(--muted)', borderColor:'var(--border)' }}>
                  Close Ticket
                </button>
              )}
            </div>

            {/* Messages */}
            <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:20 }}>
              {selectedTicket.messages?.map((msg, i) => (
                <div key={i} style={{
                  display:'flex', gap:12, flexDirection: msg.sender==='user' ? 'row-reverse' : 'row',
                }}>
                  <div style={{
                    width:36, height:36, borderRadius:'50%', flexShrink:0,
                    background: msg.sender==='user' ? 'var(--green)' : 'var(--card-high)',
                    border:'1px solid var(--border)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:14, fontWeight:700,
                    color: msg.sender==='user' ? '#003828' : 'var(--muted)',
                  }}>
                    {msg.sender==='user' ? 'U' : '🛠️'}
                  </div>
                  <div style={{ maxWidth:'75%' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4,
                      flexDirection: msg.sender==='user' ? 'row-reverse' : 'row' }}>
                      <span style={{ fontSize:12, fontWeight:600 }}>
                        {msg.sender==='user' ? 'You' : msg.senderName}
                      </span>
                      <span style={{ fontSize:11, color:'var(--muted)' }}>{timeAgo(msg.sentAt)}</span>
                    </div>
                    <div style={{
                      padding:'12px 16px', borderRadius:8,
                      background: msg.sender==='user' ? 'rgba(66,229,176,0.1)' : 'var(--card-high)',
                      border:     `1px solid ${msg.sender==='user' ? 'rgba(66,229,176,0.2)' : 'var(--border)'}`,
                    }}>
                      <p style={{ fontSize:13, color:'#bbcac1', lineHeight:1.6, margin:0 }}>
                        {msg.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Box */}
            {selectedTicket.isOpen && (
              <div style={{ borderTop:'1px solid var(--border)', paddingTop:16 }}>
                <textarea className="input-field"
                  placeholder="Add a reply..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  rows={3}
                  style={{ resize:'vertical', minHeight:80, marginBottom:10 }}
                />
                <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
                  <button className="btn-primary"
                    onClick={handleReply}
                    disabled={!replyText.trim() || submitting}
                    style={{ height:40, padding:'0 20px', fontSize:13 }}>
                    {submitting ? 'Sending...' : 'Send Reply →'}
                  </button>
                </div>
              </div>
            )}

            {/* Rating (for resolved tickets) */}
            {selectedTicket.status === 'resolved' && !selectedTicket.rating?.score && (
              <div style={{
                borderTop:'1px solid var(--border)', paddingTop:20, marginTop:8,
                background:'rgba(66,229,176,0.04)', borderRadius:8, padding:16,
              }}>
                <p style={{ fontWeight:600, marginBottom:12 }}>
                  ⭐ How was your support experience?
                </p>
                <div style={{ display:'flex', gap:8 }}>
                  {[1,2,3,4,5].map(star => (
                    <button key={star} onClick={() => handleRate(star)}
                      style={{
                        background:'var(--card-high)', border:'1px solid var(--border)',
                        borderRadius:8, padding:'8px 16px', cursor:'pointer',
                        fontSize:20, transition:'all 0.15s',
                      }}
                      onMouseOver={e => e.target.style.borderColor = 'var(--green)'}
                      onMouseOut={e  => e.target.style.borderColor = 'var(--border)'}>
                      {'⭐'.repeat(star)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Already rated */}
            {selectedTicket.rating?.score > 0 && (
              <div style={{ borderTop:'1px solid var(--border)', paddingTop:16, marginTop:8 }}>
                <p style={{ color:'var(--muted)', fontSize:13 }}>
                  You rated this ticket: {'⭐'.repeat(selectedTicket.rating.score)}
                </p>
              </div>
            )}
          </Card>
        </div>
      )}

    </div>
  );
}
