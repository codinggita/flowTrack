import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { emitDataChange } from '../hooks/useChartRefresh';
import { formatINR } from '../utils/format';

const TYPE_LABELS = { UPI:'UPI', BANK:'Bank Account', CREDIT_CARD:'Credit Card', WALLET:'Wallet' };
const TYPE_ICONS = { UPI:'📱', BANK:'🏦', CREDIT_CARD:'💳', WALLET:'👛' };

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [netWorth, setNetWorth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await api.getAccounts();
      setAccounts(res.data.accounts);
      setNetWorth(res.data.netWorth);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAccounts(); }, []);

  const handleCreate = async (data) => {
    await api.createAccount(data);
    setModalOpen(false);
    fetchAccounts();
    emitDataChange();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this account?')) return;
    await api.deleteAccount(id);
    fetchAccounts();
    emitDataChange();
  };

  return (
    <div className="page-transition">
      <div className="header-actions">
        <div>
          <h1 className="page-title">Accounts</h1>
          <p style={{ color: 'var(--muted)', marginTop: 4, fontSize: 14 }}>Manage your financial accounts</p>
        </div>
        <button className="btn-primary" onClick={() => setModalOpen(true)}
          style={{ height: 40, padding: '0 20px', fontSize: 14, flexShrink: 0 }}>+ Add Account</button>
      </div>

      {/* Net Worth Card */}
      <div className="card anim-fade-up delay-0" style={{ padding:24, marginBottom:24, textAlign:'center' }}>
        <span className="label-text">NET WORTH</span>
        <div className="anim-number" style={{ fontFamily:'var(--font-display)', fontSize:42, fontWeight:700,
          color: netWorth >= 0 ? 'var(--green)' : 'var(--red)', marginTop:8 }}>
          {formatINR(netWorth)}
        </div>
        <p style={{ color:'var(--muted)', fontSize:12, marginTop:4 }}>{accounts.length} active accounts</p>
      </div>

      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:60 }}><div className="spinner"></div></div>
      ) : accounts.length === 0 ? (
        <div className="card" style={{ padding:40, textAlign:'center', color:'var(--muted)' }}>
          No accounts yet. Create your first account to start tracking!
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:20 }}>
          {accounts.map((acc, i) => (
            <div key={acc._id} className={`card anim-fade-up delay-${Math.min(i+1,8)}`}
              style={{ padding:24, position:'relative' }}>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
                <div style={{ width:44, height:44, borderRadius:10, background:acc.color || 'var(--card-high)',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>
                  {TYPE_ICONS[acc.type] || acc.icon}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:600, fontSize:15 }}>{acc.name}</p>
                  <p style={{ color:'var(--muted)', fontSize:12 }}>{TYPE_LABELS[acc.type]}</p>
                </div>
                <button onClick={() => handleDelete(acc._id)}
                  style={{ background:'none', border:'none', color:'var(--muted)', cursor:'pointer', fontSize:18 }}>×</button>
              </div>
              <div>
                <span className="label-text">{acc.type === 'CREDIT_CARD' ? 'Outstanding' : 'Balance'}</span>
                <p style={{ fontFamily:'var(--font-display)', fontSize:24, fontWeight:700, marginTop:4,
                  color: acc.balance >= 0 ? 'var(--green)' : 'var(--red)' }}>
                  {formatINR(acc.balance)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && <AddAccountModal onClose={() => setModalOpen(false)} onSuccess={handleCreate} />}
    </div>
  );
}

function AddAccountModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ name:'', type:'BANK', balance:'', icon:'', color:'#242c28' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.type) { setError('Name and type are required'); return; }
    try {
      setLoading(true);
      await onSuccess({ ...form, balance: parseFloat(form.balance) || 0 });
    } catch (err) { setError(err.message); setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700 }}>Add Account</h2>
          <button onClick={onClose} className="btn-ghost" style={{ width:32, height:32, padding:0 }}>✕</button>
        </div>
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <label className="label-text">Account Name</label>
            <input className="input-field" placeholder="e.g. HDFC Savings"
              value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
          </div>
          <div>
            <label className="label-text">Account Type</label>
            <select className="input-field" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
              <option value="BANK">Bank Account</option>
              <option value="UPI">UPI</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="WALLET">Wallet</option>
            </select>
          </div>
          <div>
            <label className="label-text">Initial Balance (₹)</label>
            <input className="input-field" type="number" placeholder="0.00"
              value={form.balance} onChange={e=>setForm(f=>({...f,balance:e.target.value}))} />
          </div>
          {error && <p style={{ color:'var(--red)', fontSize:12 }}>{error}</p>}
          <div style={{ display:'flex', gap:12, marginTop:4 }}>
            <button type="button" className="btn-ghost" onClick={onClose} style={{ flex:1, height:44 }}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ flex:1, height:44 }}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
