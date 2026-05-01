import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout() {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden', position: 'relative' }}>
      <Sidebar isMobileOpen={isMobileOpen} setMobileOpen={setIsMobileOpen} />
      
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'margin-left 0.3s ease' }}>
        <Header setMobileOpen={setIsMobileOpen} />
        <main
          key={location.pathname}
          className="page-transition main-content-pad"
          style={{ flex: 1, overflowY: 'auto' }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
