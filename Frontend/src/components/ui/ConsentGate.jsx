import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

export default function ConsentGate({ onAccepted }) {
  const [marketing, setMarketing]   = useState(false);
  const [analytics, setAnalytics]   = useState(true);
  const [loading,   setLoading]     = useState(false);
  const [error,     setError]       = useState('');

  const handleAccept = async () => {
    setError('');
    setLoading(true);
    try {
      await api.acceptConsents({
        termsOfService: true,
        privacyPolicy:  true,
        dataRetention:  true,
        marketing,
        analytics,
      });
      onAccepted();
    } catch (err) {
      setError(err.message || 'Failed to record consent. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      position:       'fixed',
      inset:          0,
      background:     'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
      zIndex:         10000,
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        20,
      animation:      'fadeIn 0.3s ease',
    }}>
      <div style={{
        background:   '#1a211d',
        border:       '1px solid #3c4a43',
        borderRadius: 16,
        padding:      40,
        maxWidth:     540,
        width:        '100%',
        animation:    'scaleIn 0.3s cubic-bezier(0.22,1,0.36,1)',
      }}>
        {/* Logo + Title */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 12,
            background: '#42e5b0', margin: '0 auto 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24,
          }}>💧</div>
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 22,
            fontWeight: 800, color: '#dce4de', marginBottom: 8 }}>
            Before you continue
          </h2>
          <p style={{ color: '#85948c', fontSize: 13, lineHeight: 1.6 }}>
            Please review and accept our terms to use FlowTrack.
            We've kept them short and honest.
          </p>
        </div>

        {/* Required consents */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#85948c',
            letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 10 }}>
            Required (cannot use app without these)
          </p>

          {[
            {
              icon: '📋',
              label: 'Terms of Service',
              desc: 'I agree to the terms governing my use of FlowTrack.',
              link: '/terms',
            },
            {
              icon: '🔒',
              label: 'Privacy Policy',
              desc: 'I understand how FlowTrack collects and uses my data.',
              link: '/privacy',
            },
          ].map(item => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '14px 16px', marginBottom: 8,
              background: 'rgba(66,229,176,0.06)',
              border: '1px solid rgba(66,229,176,0.2)',
              borderRadius: 8,
            }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{item.label}</p>
                <p style={{ color: '#85948c', fontSize: 12, lineHeight: 1.5 }}>{item.desc}</p>
                <Link to={item.link} target="_blank"
                  style={{ color: '#42e5b0', fontSize: 12, textDecoration: 'none' }}>
                  Read full {item.label} →
                </Link>
              </div>
              <span style={{ color: '#42e5b0', fontSize: 20, flexShrink: 0 }}>✓</span>
            </div>
          ))}
        </div>

        {/* Optional consents */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#85948c',
            letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 10 }}>
            Optional (you can change these anytime)
          </p>

          {[
            {
              key:   'marketing',
              state: marketing,
              set:   setMarketing,
              icon:  '📧',
              label: 'Marketing Emails',
              desc:  'Weekly spending reports, product updates, tips. No spam.',
            },
            {
              key:   'analytics',
              state: analytics,
              set:   setAnalytics,
              icon:  '📊',
              label: 'Anonymous Analytics',
              desc:  'Help us improve the app with anonymous usage data. No personal info shared.',
            },
          ].map(item => (
            <div key={item.key}
              onClick={() => item.set(v => !v)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '14px 16px', marginBottom: 8, cursor: 'pointer',
                background: item.state ? 'rgba(66,229,176,0.04)' : 'var(--card-high)',
                border: `1px solid ${item.state ? 'rgba(66,229,176,0.2)' : '#3c4a43'}`,
                borderRadius: 8, transition: 'all 0.15s',
              }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{item.label}</p>
                <p style={{ color: '#85948c', fontSize: 12, lineHeight: 1.5 }}>{item.desc}</p>
              </div>
              <div style={{
                width: 22, height: 22, borderRadius: 4, flexShrink: 0,
                background:  item.state ? '#42e5b0'      : 'transparent',
                border:      `2px solid ${item.state ? '#42e5b0' : '#3c4a43'}`,
                display:     'flex', alignItems: 'center', justifyContent: 'center',
                transition:  'all 0.15s',
              }}>
                {item.state && <span style={{ color: '#003828', fontSize: 14, fontWeight: 700 }}>✓</span>}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div style={{
            background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.3)',
            borderRadius: 8, padding: '10px 14px', marginBottom: 16,
            color: '#ff4d4d', fontSize: 13,
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleAccept}
          disabled={loading}
          style={{
            width: '100%', height: 48,
            background: '#42e5b0', color: '#003828',
            border: 'none', borderRadius: 8,
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
            transition: 'all 0.15s',
          }}>
          {loading ? 'Recording consent...' : 'I Accept — Continue to FlowTrack →'}
        </button>

        <p style={{ textAlign: 'center', color: '#3c4a43', fontSize: 12, marginTop: 12 }}>
          By continuing, you confirm you are 18+ and agree to our terms.
        </p>
      </div>
    </div>
  );
}
