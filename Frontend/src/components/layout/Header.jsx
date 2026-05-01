import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

const routeNames = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Transactions',
  '/accounts': 'Accounts',
  '/reports': 'Reports',
  '/recurring': 'Recurring',
  '/settings': 'Settings',
};

export default function Header({ setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const currentRoute = routeNames[location.pathname] || 'Dashboard';
  const { theme, changeTheme, resolvedTheme } = useTheme();
  const { language, changeLanguage, t }       = useLanguage();

  return (
    <header
      className="header-pad"
      style={{
        height: '60px',
        background: 'var(--nav)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Hamburger menu for mobile */}
      <button 
        className="header-menu-btn"
        onClick={() => setMobileOpen(true)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text)', padding: '4px', display: 'none',
          alignItems: 'center', justifyContent: 'center'
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      {/* Route name */}
      <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--green)' }}>{currentRoute}</span>

      {/* Right section */}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
        {/* Search bar */}
        <div className="header-search" style={{ position: 'relative' }}>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text" placeholder="Search..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '260px', height: '36px', background: 'var(--card)',
              border: '1px solid var(--border)', borderRadius: '8px',
              color: 'var(--text)', fontFamily: 'var(--font-body)',
              fontSize: '13px', padding: '0 14px 0 36px', outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--green)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        {/* Bell icon */}
        <button
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--muted)', transition: 'color 0.2s',
            display: 'flex', alignItems: 'center', padding: '4px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--green)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </button>

        {/* Settings icon */}
        <button
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--muted)', transition: 'color 0.2s',
            display: 'flex', alignItems: 'center', padding: '4px',
          }}
          onClick={() => navigate('/settings')}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--green)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => changeTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          title={resolvedTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            background:   'none',
            border:       '1px solid var(--border)',
            borderRadius: 8,
            width:        36,
            height:       36,
            display:      'flex',
            alignItems:   'center',
            justifyContent:'center',
            cursor:       'pointer',
            color:        'var(--muted)',
            fontSize:     16,
            transition:   'all 0.15s',
          }}
          onMouseOver={e => e.currentTarget.style.borderColor = 'var(--green)'}
          onMouseOut={e  => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          {resolvedTheme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Language Toggle */}
        <button
          onClick={() => changeLanguage(language === 'en' ? 'hi' : 'en')}
          title={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
          style={{
            background:   language === 'hi' ? 'rgba(66,229,176,0.1)' : 'none',
            border:       '1px solid var(--border)',
            borderRadius: 8,
            height:       36,
            padding:      '0 12px',
            cursor:       'pointer',
            color:        language === 'hi' ? 'var(--green)' : 'var(--muted)',
            fontSize:     12,
            fontWeight:   700,
            transition:   'all 0.15s',
            letterSpacing:'0.03em',
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor='var(--green)'; e.currentTarget.style.color='var(--green)'; }}
          onMouseOut={e  => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color=language==='hi'?'var(--green)':'var(--muted)'; }}
        >
          {language === 'en' ? 'हि' : 'EN'}
        </button>

        {/* Avatar with user initials */}
        <div
          style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'var(--green)', color: '#003828',
            fontWeight: 700, fontSize: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'transform 0.15s',
            fontFamily: 'var(--font-display)',
            overflow: 'hidden'
          }}
          onClick={() => navigate('/settings')}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {user?.avatar ? (
            <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            user?.initials || 'U'
          )}
        </div>
      </div>
    </header>
  );
}
