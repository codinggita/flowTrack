import { useState, useMemo } from 'react';
import { transactions } from '../data/dummy';
import { formatINR } from '../utils/format';
import Modal from '../components/ui/Modal';

const categories = ['All Categories', 'FOOD', 'TRANSPORT', 'SHOPPING', 'INCOME', 'HOUSING', 'TECH', 'SOFTWARE', 'UTILITIES', 'INVESTMENT'];
const types = ['All', 'Income', 'Expense'];

export default function Transactions() {
  const [period, setPeriod] = useState('October 2023');
  const [category, setCategory] = useState('All Categories');
  const [type, setType] = useState('All');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (category !== 'All Categories' && tx.category !== category) return false;
      if (type === 'Income' && !tx.positive) return false;
      if (type === 'Expense' && tx.positive) return false;
      if (search && !tx.desc.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [category, type, search]);

  const perPage = 7;
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const resetFilters = () => {
    setCategory('All Categories');
    setType('All');
    setSearch('');
    setPage(1);
  };

  const selectStyle = {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text)',
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    padding: '8px 12px',
    outline: 'none',
    width: '100%',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '28px' }}>
          Transactions
        </h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-ghost" style={{ height: '38px', padding: '0 16px', fontSize: '13px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17,8 12,3 7,8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            CSV Upload
          </button>
          <button className="btn-primary" style={{ height: '38px', padding: '0 20px', fontSize: '13px' }} onClick={() => setModalOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Transaction
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card anim-fade-up delay-0" style={{ padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr', gap: '12px', alignItems: 'end' }}>
          <div>
            <label className="label-text">Period</label>
            <select style={selectStyle} value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option>October 2023</option>
              <option>September 2023</option>
              <option>August 2023</option>
            </select>
          </div>
          <div>
            <label className="label-text">Category</label>
            <select style={selectStyle} value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label-text">Type</label>
            <select style={selectStyle} value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
              {types.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'end' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <label className="label-text">Search</label>
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ position: 'absolute', left: '10px', bottom: '12px' }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search transactions..."
                className="input-field"
                style={{ paddingLeft: '32px', fontSize: '13px' }}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <button className="btn-ghost" style={{ height: '40px', padding: '0 14px', fontSize: '12px', flexShrink: 0 }} onClick={resetFilters}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card anim-fade-up delay-1" style={{ marginTop: '20px', overflow: 'hidden' }}>
        <div style={{ padding: '0 24px' }}>
          <div
            className="tbl-head"
            style={{ gridTemplateColumns: '130px 1fr 130px 130px 140px' }}
          >
            <span>Date</span>
            <span>Description</span>
            <span>Category</span>
            <span>Account</span>
            <span style={{ textAlign: 'right' }}>Amount</span>
          </div>

          {paginated.map((tx, i) => (
            <div
              key={tx.id}
              className={`tbl-row anim-fade-up delay-${i}`}
              style={{ gridTemplateColumns: '130px 1fr 130px 130px 140px' }}
            >
              <span style={{ color: 'var(--muted)', fontSize: '13px' }}>{tx.date}</span>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>{tx.desc}</span>
              <span>
                <span className={`badge ${tx.category === 'INCOME' || tx.category === 'INVESTMENT' ? 'badge-green' : ''}`}>
                  {tx.category}
                </span>
              </span>
              <span style={{ color: 'var(--muted)', fontSize: '13px' }}>{tx.account}</span>
              <span
                className="currency-display"
                style={{
                  textAlign: 'right',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  color: tx.positive ? 'var(--green)' : 'var(--red)',
                }}
              >
                {formatINR(tx.amount, true)}
              </span>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            borderTop: '1px solid var(--border)',
          }}
        >
          <span style={{ color: 'var(--muted)', fontSize: '13px' }}>
            Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, filtered.length)} of {filtered.length} entries
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              className="btn-ghost"
              style={{ width: '32px', height: '32px', padding: 0, fontSize: '12px' }}
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={p === page ? 'btn-primary' : 'btn-ghost'}
                style={{ width: '32px', height: '32px', padding: 0, fontSize: '12px' }}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="btn-ghost"
              style={{ width: '32px', height: '32px', padding: 0, fontSize: '12px' }}
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px' }}>Add Transaction</h2>
          <button
            onClick={() => setModalOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '20px', padding: '4px' }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="label-text">Description</label>
            <input type="text" className="input-field" placeholder="Enter description..." />
          </div>
          <div>
            <label className="label-text">Amount</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>₹</span>
              <input type="number" className="input-field" style={{ paddingLeft: '32px' }} placeholder="0.00" />
            </div>
          </div>
          <div>
            <label className="label-text">Date</label>
            <input type="date" className="input-field" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="label-text">Category</label>
              <select style={{ ...selectStyle, background: 'var(--card-high)' }}>
                {categories.filter(c => c !== 'All Categories').map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label-text">Account</label>
              <select style={{ ...selectStyle, background: 'var(--card-high)' }}>
                <option>HDFC Bank</option>
                <option>SBI Account</option>
                <option>Credit Card</option>
                <option>UPI</option>
                <option>PayTM Wallet</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label-text">Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button className="btn-primary" style={{ height: '38px', fontSize: '13px' }}>Income</button>
              <button className="btn-ghost" style={{ height: '38px', fontSize: '13px' }}>Expense</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
          <button className="btn-ghost" style={{ height: '40px', padding: '0 20px', fontSize: '13px' }} onClick={() => setModalOpen(false)}>
            Cancel
          </button>
          <button className="btn-primary" style={{ height: '40px', padding: '0 24px', fontSize: '13px' }} onClick={() => setModalOpen(false)}>
            Save Transaction
          </button>
        </div>
      </Modal>
    </div>
  );
}
