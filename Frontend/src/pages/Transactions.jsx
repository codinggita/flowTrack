import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { emitDataChange } from '../hooks/useChartRefresh';
import { formatINR, formatDate } from '../utils/format';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState({ period:'', category:'', type:'', search:'' });
  const [pagination, setPagination] = useState({ page:1, total:0, totalPages:1 });

  useEffect(() => {
    api.getAccounts().then(r => setAccounts(r.data.accounts)).catch(console.error);
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page: pagination.page, limit: 10, ...filters };
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const res = await api.getTransactions(params);
      setTransactions(res.data);
      setPagination(p => ({ ...p, total: res.pagination.total, totalPages: res.pagination.totalPages }));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [filters, pagination.page]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const handleAdd = async (formData) => {
    await api.createTransaction(formData);
    setModalOpen(false);
    fetchTransactions();
    emitDataChange();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this transaction?')) return;
    await api.deleteTransaction(id);
    fetchTransactions();
    emitDataChange();
  };

  return (
    <div className="page-transition">
      <div className="header-actions">
        <h1 className="page-title">Transactions</h1>
        <button className="btn-primary" onClick={() => setModalOpen(true)}
          style={{ height: 40, padding: '0 20px', fontSize: 14, flexShrink: 0 }}>
          + Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, alignItems: 'end' }}>
          <div>
            <label className="label-text">Category</label>
            <select className="input-field" value={filters.category}
              onChange={e => setFilters(f=>({...f,category:e.target.value}))}>
              <option value="">All Categories</option>
              {['Food','Transport','Shopping','Income','Housing','Utilities','Software','Tech','Investment','Others'].map(c =>
                <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label-text">Type</label>
            <select className="input-field" value={filters.type}
              onChange={e => setFilters(f=>({...f,type:e.target.value}))}>
              <option value="">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label className="label-text">Search</label>
            <input className="input-field" placeholder="Description..."
              value={filters.search}
              onChange={e => setFilters(f=>({...f,search:e.target.value}))} />
          </div>
          <div>
            <button className="btn-ghost" onClick={() => setFilters({ period:'',category:'',type:'',search:'' })}
              style={{ height: 40, padding: '0 16px', fontSize: 13, width: '100%' }}>Reset</button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="tbl-scroll-wrap">
          <div className="tbl-head" style={{ gridTemplateColumns: '100px 1fr 120px 100px', padding: '12px 16px', minWidth: 520 }}>
            {['Date','Description','Category','Amount'].map(h => <span key={h}>{h}</span>)}
          </div>
          {loading ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted)' }}>Loading...</div>
          ) : transactions.length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted)' }}>No transactions found.</div>
          ) : transactions.map((tx, i) => (
            <div key={tx._id} className={`tbl-row anim-fade-up delay-${Math.min(i,8)}`}
              style={{ gridTemplateColumns: '100px 1fr 120px 100px', padding: '0 16px', minWidth: 520 }}>
              <span style={{ color: 'var(--muted)', fontSize: 13 }}>{formatDate(tx.date,'full')}</span>
              <span className="text-ellipsis" style={{ fontSize: 14 }}>{tx.description}</span>
              <span><span className={`badge ${['Income','Investment'].includes(tx.category)?'badge-green':''}`}>{tx.category}</span></span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600,
                  color: tx.type==='income' ? 'var(--green)' : 'var(--red)' }}>
                  {tx.type==='income' ? '+ ' : '- '}{formatINR(tx.amount)}
                </span>
                <button onClick={() => handleDelete(tx._id)}
                  style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 16, padding: '0 4px' }}>×</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ color: 'var(--muted)', fontSize: 13 }}>
            Showing {transactions.length} of {pagination.total} entries
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className="btn-ghost" style={{ width: 32, height: 32, padding: 0, fontSize: 14 }}
              disabled={pagination.page===1} onClick={() => setPagination(p=>({...p,page:p.page-1}))}>‹</button>
            {Array.from({ length: Math.min(pagination.totalPages,5) }, (_,i) => i+1).map(p => (
              <button key={p} className={pagination.page===p ? 'btn-primary' : 'btn-ghost'}
                style={{ width: 32, height: 32, padding: 0, fontSize: 13 }}
                onClick={() => setPagination(prev=>({...prev,page:p}))}>{p}</button>
            ))}
            <button className="btn-ghost" style={{ width: 32, height: 32, padding: 0, fontSize: 14 }}
              disabled={pagination.page>=pagination.totalPages} onClick={() => setPagination(p=>({...p,page:p.page+1}))}>›</button>
          </div>
        </div>
      </div>
</div>

      {modalOpen && <AddTransactionModal accounts={accounts} onClose={() => setModalOpen(false)} onSuccess={handleAdd} />}
    </div>
  );
}

function AddTransactionModal({ accounts, onClose, onSuccess }) {
  const [form, setForm] = useState({
    description:'', amount:'', type:'expense', category:'Food',
    accountId: accounts[0]?._id || '', date: new Date().toISOString().split('T')[0], notes:'',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.description || !form.amount || !form.accountId) { setError('Description, amount and account are required'); return; }
    try {
      setLoading(true);
      await onSuccess({ ...form, amount: parseFloat(form.amount) });
    } catch (err) { setError(err.message); setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700 }}>Add Transaction</h2>
          <button onClick={onClose} className="btn-ghost" style={{ width:32, height:32, padding:0 }}>✕</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:20 }}>
          {['expense','income'].map(t => (
            <button key={t} className={form.type===t ? 'btn-primary' : 'btn-ghost'}
              style={{ height:40, fontSize:14, textTransform:'capitalize',
                ...(form.type===t && t==='expense' ? { background:'var(--red)', color:'white' } : {}) }}
              onClick={() => setForm(f=>({...f,type:t}))}>{t}</button>
          ))}
        </div>
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <label className="label-text">Description</label>
            <input className="input-field" placeholder="e.g. Swiggy Order"
              value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label className="label-text">Amount (₹)</label>
              <input className="input-field" type="number" placeholder="0.00" min="0.01" step="0.01"
                value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} />
            </div>
            <div>
              <label className="label-text">Date</label>
              <input className="input-field" type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} />
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label className="label-text">Category</label>
              <select className="input-field" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                {['Food','Transport','Shopping','Income','Housing','Utilities','Software','Tech','Investment','Others'].map(c =>
                  <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label-text">Account</label>
              <select className="input-field" value={form.accountId} onChange={e=>setForm(f=>({...f,accountId:e.target.value}))}>
                <option value="">Select account</option>
                {accounts.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label-text">Notes (optional)</label>
            <input className="input-field" placeholder="Add a note..."
              value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} />
          </div>
          {error && <p style={{ color:'var(--red)', fontSize:12 }}>{error}</p>}
          <div style={{ display:'flex', gap:12, marginTop:4 }}>
            <button type="button" className="btn-ghost" onClick={onClose} style={{ flex:1, height:44 }}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ flex:1, height:44 }}>
              {loading ? 'Saving...' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
