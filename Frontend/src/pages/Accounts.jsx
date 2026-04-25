import { accounts, netWorth } from '../data/dummy';
import { formatINR } from '../utils/format';

export default function Accounts() {
  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '28px' }}>
            Active Accounts
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '4px' }}>
            Manage your linked financial sources.
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="label-text" style={{ marginBottom: '4px' }}>NET WORTH</div>
          <div
            className="currency-display anim-number"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '40px',
              color: 'var(--green)',
            }}
          >
            {formatINR(netWorth)}
          </div>
        </div>
      </div>

      {/* Accounts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '32px' }}>
        {accounts.map((acc, i) => (
          <div
            key={acc.id}
            className={`card anim-fade-up delay-${i}`}
            style={{
              padding: '24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              cursor: 'pointer',
              transition: 'border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1e2922';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--card)';
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                background: 'var(--card-high)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '14px',
                color: 'var(--green)',
                flexShrink: 0,
              }}
            >
              {acc.icon}
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '20px' }}>
                {acc.name}
              </div>
              <span className="badge" style={{ marginTop: '6px' }}>{acc.type}</span>
            </div>

            {/* Balance */}
            <div style={{ textAlign: 'right' }}>
              <div
                className="currency-display"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: '18px',
                  color: acc.positive ? 'var(--green)' : 'var(--red)',
                }}
              >
                {formatINR(acc.balance)}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '2px' }}>
                {acc.balanceLabel}
              </div>
            </div>
          </div>
        ))}

        {/* Add Account Card */}
        <div
          className="anim-fade-up delay-4"
          style={{
            border: '2px dashed var(--border)',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            transition: 'all 0.2s ease',
            minHeight: '140px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--green)';
            e.currentTarget.style.color = 'var(--green)';
            e.currentTarget.style.background = 'rgba(66,229,176,0.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.color = 'var(--muted)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <div style={{ fontSize: '32px', color: 'var(--muted)', marginBottom: '8px', transition: 'color 0.2s' }}>+</div>
          <div style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 500, transition: 'color 0.2s' }}>Add Account</div>
        </div>
      </div>
    </div>
  );
}
