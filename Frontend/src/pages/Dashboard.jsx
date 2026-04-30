import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboard } from '../hooks/useDashboard';
import { formatINR, formatDate } from '../utils/format';

const COLORS = {
  Food:'#42e5b0', Transport:'#ff9467', Shopping:'#ffbca2',
  Subscriptions:'#85948c', Utilities:'#3c4a43', Others:'#2a3530',
  Income:'#42b0e5', Investment:'#a0e542', Housing:'#e5b042',
  Software:'#7c42e5', Tech:'#e542a0',
};

const DonutTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { category, amount, percent } = payload[0].payload;
  return (
    <div style={{ background:'#1a211d', border:'1px solid #3c4a43', borderRadius:8, padding:'10px 14px' }}>
      <p style={{ color:'#85948c', fontSize:11 }}>{category}</p>
      <p style={{ color:'#42e5b0', fontFamily:'Manrope', fontWeight:700, fontSize:16 }}>{formatINR(amount)}</p>
      <p style={{ color:'#85948c', fontSize:11 }}>{percent}% of total</p>
    </div>
  );
};

export default function Dashboard() {
  const { summary, spendingByCategory, recentTransactions, loading, error } = useDashboard();
  const [activeIdx, setActiveIdx] = useState(null);

  if (loading) return <Skeleton />;
  if (error) return <ErrorMsg msg={error} />;

  const topCat = spendingByCategory[0]?.category || '—';

  return (
    <div className="page-transition">
      {/* KPI Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, marginBottom:20 }}>
        {[
          { label:'Total Spent',  value:summary?.totalExpenses||0, color:'var(--red)',   delay:'delay-0' },
          { label:'Total Earned', value:summary?.totalIncome||0,   color:'var(--green)', delay:'delay-1' },
          { label:'Net Savings',  value:summary?.netSavings||0,    color:'var(--text)',  delay:'delay-2' },
        ].map(({ label, value, color, delay }) => (
          <div key={label} className={`card anim-fade-up ${delay}`} style={{ padding:24 }}>
            <span className="label-text">{label}</span>
            <div className={`anim-number ${delay}`} style={{
              fontFamily:'var(--font-display)', fontSize:36, fontWeight:700, color, marginTop:12,
            }}>
              {formatINR(value)}
            </div>
          </div>
        ))}
      </div>

      {/* Donut + Alerts */}
      <div style={{ display:'grid', gridTemplateColumns:'60% 1fr', gap:20, marginBottom:20 }}>
        <div className="card anim-fade-up delay-3" style={{ padding:24 }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:18, fontWeight:600, marginBottom:20 }}>
            Spending by Category
          </h2>
          {spendingByCategory.length === 0
            ? <Empty msg="No expenses this month yet" />
            : (
              <div style={{ display:'flex', alignItems:'center', gap:24 }}>
                <div style={{ position:'relative', width:200, height:200, flexShrink:0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={spendingByCategory} dataKey="amount" nameKey="category"
                        cx="50%" cy="50%" innerRadius={68} outerRadius={96} paddingAngle={2}
                        animationBegin={0} animationDuration={900}
                        onMouseEnter={(_,i) => setActiveIdx(i)}
                        onMouseLeave={() => setActiveIdx(null)}>
                        {spendingByCategory.map((d,i) => (
                          <Cell key={d.category} fill={COLORS[d.category] || '#85948c'}
                            opacity={activeIdx === null || activeIdx === i ? 1 : 0.35} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip content={<DonutTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column',
                    alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
                    <span style={{ fontSize:10, color:'var(--muted)' }}>Top Category</span>
                    <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14 }}>{topCat}</span>
                  </div>
                </div>
                <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8 }}>
                  {spendingByCategory.map((d,i) => (
                    <div key={d.category} style={{
                      display:'flex', alignItems:'center', gap:10, padding:'4px 8px', borderRadius:6,
                      background: activeIdx===i ? 'var(--card-high)' : 'transparent', cursor:'pointer', transition:'background 0.15s',
                    }} onMouseEnter={() => setActiveIdx(i)} onMouseLeave={() => setActiveIdx(null)}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background: COLORS[d.category]||'#85948c', flexShrink:0 }} />
                      <span style={{ flex:1, fontSize:13, color:'var(--secondary)' }}>{d.category}</span>
                      <span style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:13 }}>{formatINR(d.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

        <div className="card anim-fade-up delay-4" style={{ padding:24 }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:18, fontWeight:600, marginBottom:16 }}>This Month Summary</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {spendingByCategory.length > 0 && (
              <AlertCard title={`${spendingByCategory[0].category} Spending Alert`}
                desc={`You spent ${formatINR(spendingByCategory[0].amount)} on ${spendingByCategory[0].category} — ${spendingByCategory[0].percent}% of your total.`} />
            )}
            {summary?.netSavings < 0 && (
              <AlertCard title="Spending Exceeds Income"
                desc={`Your expenses exceed income by ${formatINR(Math.abs(summary.netSavings))} this month.`} />
            )}
            {spendingByCategory.length === 0 && (
              <p style={{ color:'var(--muted)', fontSize:13 }}>Add transactions to see insights.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card anim-fade-up delay-5" style={{ padding:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:18, fontWeight:600 }}>Recent Transactions</h2>
          <a href="/transactions" style={{ color:'var(--green)', fontSize:13, textDecoration:'none' }}>View All</a>
        </div>
        <div className="tbl-head" style={{ gridTemplateColumns:'80px 1fr 130px 130px 120px' }}>
          {['DATE','DESCRIPTION','CATEGORY','ACCOUNT','AMOUNT'].map(h => <span key={h}>{h}</span>)}
        </div>
        {recentTransactions.length === 0
          ? <Empty msg="No transactions yet. Add your first one!" />
          : recentTransactions.map((tx, i) => (
            <div key={tx._id} className={`tbl-row anim-fade-up delay-${Math.min(i,8)}`}
              style={{ gridTemplateColumns:'80px 1fr 130px 130px 120px' }}>
              <span style={{ color:'var(--muted)', fontSize:13 }}>{formatDate(tx.date)}</span>
              <span style={{ fontSize:14 }}>{tx.description}</span>
              <span><span className={`badge ${['Income','Investment'].includes(tx.category)?'badge-green':''}`}>{tx.category}</span></span>
              <span style={{ color:'var(--secondary)', fontSize:13 }}>{tx.accountId?.name||'—'}</span>
              <span style={{ textAlign:'right', fontFamily:'var(--font-display)', fontWeight:600,
                color: tx.type==='income' ? 'var(--green)' : 'var(--red)' }}>
                {tx.type==='income' ? '+' : '-'}{formatINR(tx.amount)}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

function AlertCard({ title, desc }) {
  return (
    <div style={{ background:'var(--card-high)', border:'1px solid var(--border)', borderRadius:8, padding:14 }}>
      <p style={{ fontWeight:600, fontSize:13, marginBottom:4 }}>{title}</p>
      <p style={{ color:'var(--muted)', fontSize:12, lineHeight:1.6 }}>{desc}</p>
    </div>
  );
}
function Empty({ msg }) {
  return <div style={{ height:120, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--muted)', fontSize:13 }}>{msg}</div>;
}
function Skeleton() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
        {[1,2,3].map(i => <div key={i} className="card" style={{ height:100,
          backgroundImage:'linear-gradient(90deg,var(--card) 0%,var(--card-high) 50%,var(--card) 100%)',
          backgroundSize:'600px 100%', animation:'shimmer 1.5s infinite linear' }} />)}
      </div>
      <div className="card" style={{ height:300,
        backgroundImage:'linear-gradient(90deg,var(--card) 0%,var(--card-high) 50%,var(--card) 100%)',
        backgroundSize:'600px 100%', animation:'shimmer 1.5s infinite linear' }} />
    </div>
  );
}
function ErrorMsg({ msg }) {
  return <div style={{ padding:40, textAlign:'center', color:'var(--red)' }}>
    <p style={{ fontWeight:600 }}>Failed to load dashboard</p>
    <p style={{ color:'var(--muted)', fontSize:13, marginTop:8 }}>{msg}</p>
  </div>;
}
