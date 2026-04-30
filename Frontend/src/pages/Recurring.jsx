import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { formatINR } from '../utils/format';

export default function Recurring() {
  const [subs, setSubs] = useState([]);
  const [stats, setStats] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subRes, accRes] = await Promise.all([api.getSubscriptions(), api.getAccounts()]);
      setSubs(subRes.data.subscriptions);
      setStats(subRes.data.stats);
      setAccounts(accRes.data.accounts);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (data) => {
    await api.createSubscription(data);
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this subscription?')) return;
    await api.deleteSubscription(id);
    fetchData();
  };

  return (
    <div className="page-transition">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:700 }}>Subscriptions</h1>
          <p style={{ color:'var(--muted)', marginTop:4, fontSize:14 }}>Track your recurring payments</p>
        </div>
        <button className="btn-primary" onClick={() => setModalOpen(true)}
          style={{ height:40, padding:'0 20px', fontSize:14 }}>+ Add Subscription</button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        {[
          { label:'MONTHLY COST', value:formatINR(stats.totalMonthly||0), color:'var(--green)' },
          { label:'YEARLY PROJECTION', value:formatINR(stats.yearlyProjection||0), color:'var(--orange)' },
          { label:'ACTIVE SUBS', value:stats.activeSubs||0, color:'var(--text)' },
          { label:'RENEWING SOON', value:stats.upcoming7days||0, color:'var(--red)' },
        ].map((s,i) => (
          <div key={s.label} className={`card anim-fade-up delay-${i}`} style={{ padding:20 }}>
            <span className="label-text">{s.label}</span>
            <p style={{ fontFamily:'var(--font-display)', fontSize:24, fontWeight:700, color:s.color, marginTop:8 }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:60 }}><div className="spinner"></div></div>
      ) : subs.length === 0 ? (
        <div className="card" style={{ padding:40, textAlign:'center', color:'var(--muted)' }}>
          No subscriptions yet. Add your first one to start tracking!
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:16 }}>
          {subs.map((sub, i) => {
            const days = sub.daysUntilRenewal;
            const isSoon = days >= 0 && days <= 7;
            return (
              <div key={sub._id} className={`card anim-fade-up delay-${Math.min(i,8)} ${isSoon ? 'renew-pulse' : ''}`}
                style={{ padding:20, borderColor: isSoon ? 'rgba(255,188,162,0.5)' : undefined }}>
                <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:12 }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:sub.color||'var(--card-high)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, color:'var(--green)' }}>
                    {sub.letter}
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:600, fontSize:14 }}>{sub.name}</p>
                    <p style={{ color:'var(--muted)', fontSize:11 }}>{sub.plan || sub.billingCycle}</p>
                  </div>
                  <button onClick={() => handleDelete(sub._id)}
                    style={{ background:'none', border:'none', color:'var(--muted)', cursor:'pointer', fontSize:16 }}>×</button>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <span style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700, color:'var(--green)' }}>
                      {formatINR(sub.amount)}
                    </span>
                    <span style={{ color:'var(--muted)', fontSize:12 }}>/{sub.billingCycle === 'yearly' ? 'yr' : sub.billingCycle === 'weekly' ? 'wk' : 'mo'}</span>
                  </div>
                  <span className={isSoon ? 'badge badge-orange' : 'badge'}>
                    {days < 0 ? 'Overdue' : days === 0 ? 'Today' : `${days}d left`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && <AddSubModal accounts={accounts} onClose={() => setModalOpen(false)} onSuccess={handleCreate} />}
    </div>
  );
}

function AddSubModal({ accounts, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name:'', amount:'', billingCycle:'monthly', plan:'',
    accountId: accounts[0]?._id || '',
    nextRenewalDate: new Date(Date.now()+30*24*60*60*1000).toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.amount || !form.accountId) { setError('Fill all required fields'); return; }
    try {
      setLoading(true);
      await onSuccess({ ...form, amount: parseFloat(form.amount) });
    } catch (err) { setError(err.message); setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700 }}>Add Subscription</h2>
          <button onClick={onClose} className="btn-ghost" style={{ width:32, height:32, padding:0 }}>✕</button>
        </div>
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <label className="label-text">Service Name</label>
            <input className="input-field" placeholder="e.g. Netflix"
              value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label className="label-text">Amount (₹)</label>
              <input className="input-field" type="number" placeholder="0.00" min="0.01" step="0.01"
                value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} />
            </div>
            <div>
              <label className="label-text">Billing Cycle</label>
              <select className="input-field" value={form.billingCycle} onChange={e=>setForm(f=>({...f,billingCycle:e.target.value}))}>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label className="label-text">Account</label>
              <select className="input-field" value={form.accountId} onChange={e=>setForm(f=>({...f,accountId:e.target.value}))}>
                <option value="">Select account</option>
                {accounts.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label-text">Next Renewal</label>
              <input className="input-field" type="date" value={form.nextRenewalDate}
                onChange={e=>setForm(f=>({...f,nextRenewalDate:e.target.value}))} />
            </div>
          </div>
          {error && <p style={{ color:'var(--red)', fontSize:12 }}>{error}</p>}
          <div style={{ display:'flex', gap:12, marginTop:4 }}>
            <button type="button" className="btn-ghost" onClick={onClose} style={{ flex:1, height:44 }}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ flex:1, height:44 }}>
              {loading ? 'Adding...' : 'Add Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
