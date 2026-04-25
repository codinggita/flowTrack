import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout() {
  const location = useLocation();
  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', marginLeft: 240 }}>
        <Header />
        <main
          key={location.pathname}
          className="page-transition"
          style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
