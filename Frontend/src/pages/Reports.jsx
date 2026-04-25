import { useState } from 'react';
import { reportStats, merchantSpending, cashFlowData, topCategories } from '../data/dummy';
import { formatINR, formatINRShort } from '../utils/format';
import AreaChart from '../components/charts/AreaChart';
import ProgressBar from '../components/charts/ProgressBar';

const periodTabs = ['This Month', 'Last Month', 'This Quarter', 'YTD'];

export default function Reports() {
  const [activePeriod, setActivePeriod] = useState('This Quarter');

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '32px' }}>
            Financial Performance
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '4px' }}>
            Comprehensive overview of your income, expenses, and savings.
          </p>
        </div>

        {/* Period Tabs */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {periodTabs.map((tab) => (
            <button
              key={tab}
              className={activePeriod === tab ? 'btn-primary' : 'btn-ghost'}
              style={{ height: '36px', padding: '0 14px', fontSize: '12px', borderRadius: '8px' }}
              onClick={() => setActivePeriod(tab)}
            >
              {tab}
            </button>
          ))}
          <button className="btn-ghost" style={{ width: '36px', height: '36px', padding: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4" />
              <path d="M8 2v4" />
              <path d="M3 10h18" />
            </svg>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {/* Total Income */}
        <div className="card anim-fade-up delay-0" style={{ padding: '24px' }}>
          <div className="label-text">Total Income</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
            <span className="currency-display anim-number" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '28px', color: 'var(--green)' }}>
              {formatINR(reportStats.totalIncome)}
            </span>
            <span className="badge badge-green">+12% ↑</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="card anim-fade-up delay-1" style={{ padding: '24px' }}>
          <div className="label-text">Total Expenses</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
            <span className="currency-display anim-number delay-1" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '28px', color: 'var(--red)' }}>
              {formatINR(reportStats.totalExpenses)}
            </span>
            <span className="badge" style={{ borderColor: 'rgba(255,77,77,0.4)', color: 'var(--red)', background: 'rgba(255,77,77,0.08)' }}>+5% ↑</span>
          </div>
        </div>

        {/* Net Savings */}
        <div className="card anim-fade-up delay-2" style={{ padding: '24px' }}>
          <div className="label-text">Net Savings</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
            <span className="currency-display anim-number delay-2" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '28px' }}>
              {formatINR(reportStats.netSavings)}
            </span>
            <span style={{ color: 'var(--muted)', fontSize: '13px' }}>{reportStats.savingsMargin}% margin</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '45% 55%', gap: '20px', marginTop: '20px' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Spending by Merchant */}
          <div className="card anim-fade-up delay-3" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '18px' }}>Spending by Merchant</h2>
              <button style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '18px' }}>⋯</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {merchantSpending.map((m, i) => (
                <div key={m.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{m.name}</span>
                    <span className="currency-display" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px' }}>
                      {formatINR(m.amount)}
                    </span>
                  </div>
                  <ProgressBar percent={m.percent} delay={i * 100} />
                </div>
              ))}
            </div>
          </div>

          {/* Top Categories */}
          <div className="card anim-fade-up delay-4" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '18px' }}>Top Categories</h2>
              <button style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
                </svg>
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {topCategories.map((cat) => (
                <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'var(--card-high)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      flexShrink: 0,
                    }}
                  >
                    {cat.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: '14px' }}>{cat.name}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '12px' }}>{cat.txCount} transactions</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="currency-display" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px' }}>
                      {formatINR(cat.amount)}
                    </div>
                    <div style={{ color: 'var(--green)', fontSize: '11px' }}>{cat.percent}% of total</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--green)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                View All Categories
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Cash Flow Trend */}
        <div className="card anim-fade-up delay-3" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '18px' }}>Cash Flow Trend</h2>
            <button style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '18px' }}>⋯</button>
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '3px', background: '#42e5b0', borderRadius: '2px' }} />
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Income</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '3px', background: '#ff9467', borderRadius: '2px' }} />
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Expenses</span>
            </div>
          </div>
          <AreaChart data={cashFlowData} width={520} height={380} />
        </div>
      </div>
    </div>
  );
}
