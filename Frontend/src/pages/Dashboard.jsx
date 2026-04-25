import { useNavigate } from 'react-router-dom';
import { dashboardStats, spendingByCategory, monthSummaryAlerts, recentTransactions } from '../data/dummy';
import { formatINR } from '../utils/format';
import StatCard from '../components/ui/StatCard';
import DonutChart from '../components/charts/DonutChart';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <StatCard
          label="Total Spent"
          amount={dashboardStats.totalSpent}
          color="var(--red)"
          delay={0}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23,18 13.5,8.5 8.5,13.5 1,6" />
              <polyline points="17,18 23,18 23,12" />
            </svg>
          }
        />
        <StatCard
          label="Total Earned"
          amount={dashboardStats.totalEarned}
          color="var(--green)"
          delay={1}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
              <polyline points="17,6 23,6 23,12" />
            </svg>
          }
        />
        <StatCard
          label="Net Savings"
          amount={dashboardStats.netSavings}
          color="var(--text)"
          delay={2}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21V5a2 2 0 012-2h14a2 2 0 012 2v16" />
              <path d="M3 21h18" />
              <path d="M9 8h6" />
              <path d="M9 12h6" />
              <path d="M9 16h6" />
            </svg>
          }
        />
      </div>

      {/* Two-column: Donut + Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '20px', marginTop: '20px' }}>
        {/* Spending by Category */}
        <div className="card anim-fade-up delay-3" style={{ padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '18px', marginBottom: '24px' }}>
            Spending by Category
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <DonutChart data={spendingByCategory} size={200} strokeWidth={22} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {spendingByCategory.map((cat) => (
                <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', flex: 1 }}>{cat.name}</span>
                  <span
                    className="currency-display"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px' }}
                  >
                    {formatINR(cat.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* This Month Summary */}
        <div className="card anim-fade-up delay-4" style={{ padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '18px', marginBottom: '16px' }}>
            This Month Summary
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {monthSummaryAlerts.map((alert, i) => (
              <div
                key={alert.id}
                className={`anim-fade-up delay-${i + 3}`}
                style={{
                  background: 'var(--card-high)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: alert.type === 'warning' ? 'rgba(255,188,162,0.12)' : 'rgba(66,229,176,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {alert.type === 'warning' ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
                        <polyline points="17,6 23,6 23,12" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23,4 23,10 17,10" />
                        <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{alert.title}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: 1.5 }}>{alert.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card anim-fade-up delay-5" style={{ marginTop: '20px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '18px' }}>
            Recent Transactions
          </h2>
          <span
            style={{ color: 'var(--green)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => navigate('/transactions')}
          >
            View All
          </span>
        </div>

        {/* Table Header */}
        <div
          className="tbl-head"
          style={{ gridTemplateColumns: '80px 1fr 140px 140px 120px' }}
        >
          <span>Date</span>
          <span>Description</span>
          <span>Category</span>
          <span>Account</span>
          <span style={{ textAlign: 'right' }}>Amount</span>
        </div>

        {/* Table Rows */}
        {recentTransactions.map((tx, i) => (
          <div
            key={i}
            className={`tbl-row anim-fade-up delay-${i}`}
            style={{ gridTemplateColumns: '80px 1fr 140px 140px 120px' }}
          >
            <span style={{ color: 'var(--muted)', fontSize: '13px' }}>{tx.date}</span>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>{tx.desc}</span>
            <span>
              <span className={`badge ${tx.category === 'Income' || tx.category === 'Investment' ? 'badge-green' : ''}`}>
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
                fontSize: '14px',
                color: tx.positive ? 'var(--green)' : 'var(--red)',
              }}
            >
              {formatINR(tx.amount, true)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
