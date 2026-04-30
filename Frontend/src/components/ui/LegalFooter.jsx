import { Link } from 'react-router-dom';

export default function LegalFooter() {
  return (
    <div style={{
      position:   'fixed',
      bottom:     0,
      left:       0,
      right:      0,
      padding:    '12px 24px',
      display:    'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap:        20,
      background: 'rgba(14,21,17,0.95)',
      backdropFilter: 'blur(8px)',
      borderTop:  '1px solid #1e2e26',
      flexWrap:   'wrap',
      zIndex:     50,
    }}>
      <span style={{ color: '#3c4a43', fontSize: 12 }}>© {new Date().getFullYear()} FlowTrack</span>
      {[
        { to: '/terms',   label: 'Terms of Service' },
        { to: '/privacy', label: 'Privacy Policy'   },
      ].map(link => (
        <Link key={link.to} to={link.to}
          style={{ color: '#85948c', fontSize: 12, textDecoration: 'none',
            transition: 'color 0.15s' }}
          onMouseOver={e => e.target.style.color = '#42e5b0'}
          onMouseOut={e  => e.target.style.color = '#85948c'}>
          {link.label}
        </Link>
      ))}
      <span style={{ color: '#3c4a43', fontSize: 12 }}>Made in India 🇮🇳</span>
    </div>
  );
}
