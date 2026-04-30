import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useReports } from '../hooks/useReports';
import { formatINR, formatINRShort } from '../utils/format';

const PERIODS = [
  { key:'this-month', label:'This Month' },
  { key:'last-month', label:'Last Month' },
  { key:'this-quarter', label:'This Quarter' },
  { key:'ytd', label:'YTD' },
];

const CAT_ICONS = {
  Food:'🍽️', Transport:'🚗', Shopping:'🛒', Income:'💰',
  Housing:'🏠', Utilities:'⚡', Software:'💻', Tech:'📱',
  Investment:'📈', Others:'📦',
};

const CashTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'#1a211d', border:'1px solid #3c4a43', borderRadius:8, padding:'12px 16px', minWidth:160 }}>
      <p style={{ color:'#85948c', fontSize:11, fontWeight:600, marginBottom:8 }}>{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:p.color }} />
          <span style={{ color:'#bbcac1', fontSize:12 }}>{p.name}:</span>
          <span style={{ color:p.color, fontFamily:'Manrope', fontWeight:700, fontSize:13 }}>{formatINR(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function Reports() {
  const [period, setPeriod] = useState('this-month');
  const { summary, spendingByMerchant, cashFlow, topCategories, loading, error } = useReports(period);

  if (loading) return <ReportSkeleton />;
  if (error) return <div style={{ padding:40, color:'var(--red)', textAlign:'center' }}>{error}</div>;

  const maxMerchant = spendingByMerchant[0]?.amount || 1;

  return (
    <div className="page-transition">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:700 }}>Financial Performance</h1>
          <p style={{ color:'var(--muted)', marginTop:4, fontSize:14 }}>Analyze your income and expenditure patterns.</p>
        </div>
        <div style={{ display:'flex', gap:4 }}>
          {PERIODS.map(p => (
            <button key={p.key} onClick={() => setPeriod(p.key)}
              className={period===p.key ? 'btn-primary' : 'btn-ghost'}
              style={{ height:36, padding:'0 14px', fontSize:13, fontWeight:600 }}>{p.label}</button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, marginBottom:24 }}>
        <KPI label="TOTAL INCOME" value={summary?.totalIncome||0} color="var(--green)" />
        <KPI label="TOTAL EXPENSES" value={summary?.totalExpenses||0} color="var(--red)" />
        <KPI label="NET SAVINGS" value={summary?.netSavings||0} color="var(--text)"
          badge={`${summary?.savingsMargin||0}% margin`} />
      </div>

      {/* Merchant + Categories */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:24 }}>
        <div className="card anim-fade-up delay-2" style={{ padding:24 }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:600, marginBottom:20 }}>Spending by Merchant</h3>
          {spendingByMerchant.length === 0 ? <NoData /> : spendingByMerchant.slice(0,7).map((m,i) => (
            <MerchantBar key={m.name} merchant={m} maxAmount={maxMerchant} delay={i*80} />
          ))}
        </div>
        <div className="card anim-fade-up delay-3" style={{ padding:24 }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:600, marginBottom:16 }}>Top Categories</h3>
          {topCategories.length === 0 ? <NoData /> : topCategories.map((cat,i) => (
            <div key={cat.category} className={`tbl-row anim-fade-up delay-${i}`}
              style={{ gridTemplateColumns:'36px 1fr 110px 70px', gap:12, alignItems:'center', padding:'10px 4px' }}>
              <div style={{ width:32, height:32, borderRadius:8, background:'var(--card-high)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>
                {CAT_ICONS[cat.category]||'📦'}
              </div>
              <div>
                <p style={{ fontSize:13, fontWeight:600, marginBottom:2 }}>{cat.category}</p>
                <p style={{ fontSize:11, color:'var(--muted)' }}>{cat.count} transactions</p>
              </div>
              <span style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:13 }}>{formatINR(cat.amount)}</span>
              <span style={{ color:'var(--green)', fontSize:12, textAlign:'right' }}>{cat.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cash Flow Chart */}
      <div className="card anim-fade-up delay-4" style={{ padding:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:600 }}>
            Cash Flow Trend — {new Date().getFullYear()}
          </h3>
          <div style={{ display:'flex', gap:16 }}>
            <LegDot color="#42e5b0" label="Income" />
            <LegDot color="#ff9467" label="Expenses" />
          </div>
        </div>
        {cashFlow.length === 0 ? <NoData height={280} /> : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={cashFlow} margin={{ top:10, right:10, left:10, bottom:0 }}>
              <defs>
                <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#42e5b0" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#42e5b0" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff9467" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#ff9467" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2e26" vertical={false} />
              <XAxis dataKey="month" tick={{ fill:'#85948c', fontSize:11 }} axisLine={{ stroke:'#3c4a43' }} tickLine={false} />
              <YAxis tickFormatter={v => formatINRShort(v)} tick={{ fill:'#85948c', fontSize:11 }} axisLine={false} tickLine={false} width={60} />
              <Tooltip content={<CashTooltip />} />
              <Area type="monotone" dataKey="income" name="Income" stroke="#42e5b0" strokeWidth={2} fill="url(#gIncome)"
                dot={false} activeDot={{ r:5, fill:'#42e5b0', stroke:'#0e1511', strokeWidth:2 }} animationDuration={1000} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ff9467" strokeWidth={2} fill="url(#gExpense)"
                dot={false} activeDot={{ r:5, fill:'#ff9467', stroke:'#0e1511', strokeWidth:2 }} animationDuration={1200} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function KPI({ label, value, color, badge }) {
  return (
    <div className="card anim-fade-up delay-0" style={{ padding:24 }}>
      <span className="label-text">{label}</span>
      <div style={{ display:'flex', alignItems:'baseline', gap:12, marginTop:8 }}>
        <span className="currency-display anim-number" style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:700, color }}>
          {formatINR(value)}
        </span>
        {badge && <span style={{ fontSize:11, fontWeight:600, background:'var(--card-high)', color:'var(--muted)', borderRadius:4, padding:'2px 8px' }}>{badge}</span>}
      </div>
    </div>
  );
}

function MerchantBar({ merchant, maxAmount, delay }) {
  const pct = Math.round((merchant.amount / maxAmount) * 100);
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
        <span style={{ fontSize:13, color:'var(--secondary)' }}>{merchant.name}</span>
        <span style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:13 }}>{formatINR(merchant.amount)}</span>
      </div>
      <div style={{ height:4, background:'var(--card-high)', borderRadius:2, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, background:'linear-gradient(90deg, #42e5b0, #00c896)', borderRadius:2,
          animation: `barGrow 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms both` }} />
      </div>
    </div>
  );
}

function LegDot({ color, label }) {
  return <div style={{ display:'flex', alignItems:'center', gap:6 }}>
    <div style={{ width:8, height:8, borderRadius:'50%', background:color }} />
    <span style={{ fontSize:12, color:'var(--muted)' }}>{label}</span>
  </div>;
}
function NoData({ height=80 }) {
  return <div style={{ height, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--muted)', fontSize:13 }}>No data for this period</div>;
}
function ReportSkeleton() {
  return <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
    {[100,160,320].map(h => <div key={h} className="card" style={{ height:h,
      backgroundImage:'linear-gradient(90deg,var(--card) 0%,var(--card-high) 50%,var(--card) 100%)',
      backgroundSize:'600px 100%', animation:'shimmer 1.5s infinite linear' }} />)}
  </div>;
}
