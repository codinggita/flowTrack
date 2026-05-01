import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

// ── Time formatter ──────────────────────────────────────────────────────
const timeAgo = (date) => {
  if (!date) return 'Never';
  const secs = Math.floor((Date.now() - new Date(date)) / 1000);
  if (secs < 60)    return 'Just now';
  if (secs < 3600)  return `${Math.floor(secs/60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs/3600)}h ago`;
  return new Date(date).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
};

// ── Full date formatter ─────────────────────────────────────────────────
const fullDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-IN', {
    day:'2-digit', month:'short', year:'numeric',
    hour:'2-digit', minute:'2-digit',
  });
};

// ── Device icon ─────────────────────────────────────────────────────────
const DeviceIcon = ({ device = '' }) => {
  const d = device.toLowerCase();
  if (d.includes('iphone') || d.includes('android') || d.includes('mobile'))
    return <span style={{ fontSize:18 }}>📱</span>;
  if (d.includes('ipad') || d.includes('tablet'))
    return <span style={{ fontSize:18 }}>📱</span>;
  if (d.includes('macbook') || d.includes('mac'))
    return <span style={{ fontSize:18 }}>💻</span>;
  return <span style={{ fontSize:18 }}>🖥️</span>;
};

// ── Action icon ─────────────────────────────────────────────────────────
const ActionIcon = ({ action }) => {
  const icons = {
    login:'🔑', logout:'🚪', register:'🎉', password_change:'🔐',
    profile_update:'✏️', preferences_update:'⚙️', '2fa_enabled':'🛡️',
    '2fa_disabled':'🔓', session_revoked:'❌', transaction_add:'💸',
    transaction_delete:'🗑️', account_add:'🏦', account_delete:'🗑️',
    subscription_add:'🔔', subscription_delete:'❌', csv_import:'📄',
  };
  return <span style={{ fontSize:16 }}>{icons[action] || 'ℹ️'}</span>;
};

// ── Toggle Switch ───────────────────────────────────────────────────────
const Toggle = ({ checked, onChange, disabled }) => (
  <label style={{ position:'relative', width:44, height:24, cursor:disabled?'not-allowed':'pointer', display:'block' }}>
    <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled}
      style={{ opacity:0, width:0, height:0, position:'absolute' }} />
    <div style={{
      position:'absolute', inset:0,
      background: checked ? 'var(--green)' : 'var(--card-high)',
      border: `1px solid ${checked ? 'var(--green)' : 'var(--border)'}`,
      borderRadius:12, transition:'all 0.2s',
    }}>
      <div style={{
        position:'absolute', top:3, left: checked ? 23 : 3,
        width:16, height:16, borderRadius:'50%', background:'white',
        transition:'left 0.2s cubic-bezier(0.34,1.56,0.64,1)',
      }} />
    </div>
  </label>
);

// ── Card component ──────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div className="card" style={{ padding:24, ...style }}>{children}</div>
);

const SectionTitle = ({ children }) => (
  <h3 style={{ fontFamily:'var(--font-display)', fontSize:18, fontWeight:700,
    color:'var(--text)', marginBottom:20 }}>{children}</h3>
);

const FieldLabel = ({ children }) => (
  <label className="label-text" style={{ marginBottom:6, display:'block' }}>{children}</label>
);

const Divider = () => (
  <div style={{ height:1, background:'var(--border)', margin:'16px 0' }} />
);

// ── SUCCESS / ERROR toast ───────────────────────────────────────────────
const Toast = ({ msg, type }) => {
  if (!msg) return null;
  return (
    <div style={{
      position:'fixed', bottom:24, right:24, zIndex:9999,
      background: type==='error' ? '#2d1111' : '#112d1f',
      border: `1px solid ${type==='error' ? 'var(--red)' : 'var(--green)'}`,
      borderRadius:10, padding:'14px 20px',
      color: type==='error' ? 'var(--red)' : 'var(--green)',
      fontSize:13, fontWeight:600,
      animation:'fadeSlideUp 0.3s ease',
      maxWidth:320,
    }}>
      {type==='error' ? '❌' : '✅'} {msg}
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────
export default function Settings() {
  // Global state
  const [profile,       setProfile]       = useState(null);
  const [sessions,      setSessions]      = useState([]);
  const [activityLogs,  setActivityLogs]  = useState([]);
  const [loginHistory,  setLoginHistory]  = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [activeTab,     setActiveTab]     = useState('profile');
  const [toast,         setToast]         = useState({ msg:'', type:'success' });
  const [saving,        setSaving]        = useState({});
  const [revokingId,    setRevokingId]    = useState(null);
  const { updateUser }  = useAuth();

  // Notification toggles state
  const [notifPrefs, setNotifPrefs] = useState({
    newTransaction: true,
    weeklyReport:   true,
    subRenewal:     true,
  });

  // Theme state
  const [theme, setTheme] = useState('dark');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:'', type:'success' }), 3500);
  };

  const setSavingKey = (key, val) => setSaving(s => ({ ...s, [key]: val }));

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return showToast('Image must be less than 2MB', 'error');
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          setSavingKey('avatar', true);
          const res = await api.updateProfile({ avatar: reader.result });
          setProfile(p => ({ ...p, avatar: res.data.avatar }));
          updateUser({ avatar: res.data.avatar });
          showToast('Avatar updated successfully');
        } catch (err) {
          showToast(err.message || 'Failed to update avatar', 'error');
        } finally {
          setSavingKey('avatar', false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // ── Fetch all settings data ───────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [profileRes, sessionsRes, activityRes, loginRes] = await Promise.all([
          api.getProfile(),
          api.getSessions(),
          api.getActivityLog({ limit: 20 }),
          api.getLoginHistory(),
        ]);
        setProfile(profileRes.data);
        setSessions(sessionsRes.data?.sessions || []);
        setActivityLogs(activityRes.data?.logs || []);
        setLoginHistory(loginRes.data || []);
        if (profileRes.data?.notifications) setNotifPrefs(profileRes.data.notifications);
        if (profileRes.data?.preferences?.theme) setTheme(profileRes.data.preferences.theme);
      } catch (err) {
        showToast('Failed to load settings', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Profile form (Formik + Yup) ───────────────────────────────────────
  const profileForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: profile?.fullName || '',
      phone:    profile?.phone    || '',
    },
    validationSchema: Yup.object({
      fullName: Yup.string().min(2,'Min 2 chars').required('Name is required'),
      phone:    Yup.string().optional(),
    }),
    onSubmit: async (values) => {
      try {
        setSavingKey('profile', true);
        const res = await api.updateProfile(values);
        setProfile(p => ({ ...p, ...res.data }));
        updateUser({ fullName: res.data.fullName, avatar: res.data.avatar });
        showToast('Profile updated successfully');
      } catch (err) {
        showToast(err.message || 'Failed to update profile', 'error');
      } finally {
        setSavingKey('profile', false);
      }
    },
  });

  // ── Password form (Formik + Yup) ──────────────────────────────────────
  const passwordForm = useFormik({
    initialValues: { currentPassword:'', newPassword:'', confirmPassword:'' },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required('Current password is required'),
      newPassword:     Yup.string().min(8,'Min 8 characters').required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords do not match')
        .required('Please confirm your password'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setSavingKey('password', true);
        await api.changePassword({
          currentPassword: values.currentPassword,
          newPassword:     values.newPassword,
        });
        resetForm();
        showToast('Password changed. Other sessions have been logged out.');
        // Refresh sessions list
        const sessRes = await api.getSessions();
        setSessions(sessRes.data?.sessions || []);
      } catch (err) {
        showToast(err.message || 'Failed to change password', 'error');
      } finally {
        setSavingKey('password', false);
      }
    },
  });

  // ── Toggle notification preference ────────────────────────────────────
  const handleNotifToggle = async (key) => {
    const newVal = !notifPrefs[key];
    setNotifPrefs(p => ({ ...p, [key]: newVal }));
    try {
      await api.updateNotifications({ ...notifPrefs, [key]: newVal });
      showToast('Notification preference saved');
    } catch (err) {
      setNotifPrefs(p => ({ ...p, [key]: !newVal })); // revert on error
      showToast('Failed to save preference', 'error');
    }
  };

  // ── Toggle 2FA ────────────────────────────────────────────────────────
  const handle2FAToggle = async () => {
    try {
      const res = await api.toggle2FA();
      setProfile(p => ({ ...p, twoFAEnabled: res.data?.twoFAEnabled }));
      showToast(res.message);
    } catch (err) {
      showToast(err.message || 'Failed to toggle 2FA', 'error');
    }
  };

  // ── Change theme ──────────────────────────────────────────────────────
  const handleThemeChange = async (newTheme) => {
    setTheme(newTheme);
    try {
      await api.updatePreferences({ theme: newTheme });
      showToast('Theme preference saved');
    } catch (err) {
      showToast('Failed to save theme', 'error');
    }
  };

  // ── Revoke session ────────────────────────────────────────────────────
  const handleRevokeSession = async (sessionId) => {
    if (!confirm('Revoke this session? That device will be logged out.')) return;
    try {
      setRevokingId(sessionId);
      await api.revokeSession(sessionId);
      setSessions(s => s.filter(sess => sess._id !== sessionId));
      showToast('Session revoked successfully');
    } catch (err) {
      showToast(err.message || 'Failed to revoke session', 'error');
    } finally {
      setRevokingId(null);
    }
  };

  // ── Revoke all other sessions ─────────────────────────────────────────
  const handleRevokeAll = async () => {
    if (!confirm('Log out all other sessions?')) return;
    try {
      const res = await api.revokeAllOtherSessions();
      setSessions(s => s.filter(sess => sess.isCurrent));
      showToast(res.message);
    } catch (err) {
      showToast(err.message || 'Failed to revoke sessions', 'error');
    }
  };

  if (loading) return <SettingsSkeleton />;

  const tabs = [
    { id:'profile',     label:'Profile'         },
    { id:'security',    label:'Security'         },
    { id:'sessions',    label:'Active Sessions'  },
    { id:'activity',    label:'Activity Log'     },
    { id:'notifications',label:'Notifications'   },
    { id:'preferences', label:'Preferences'      },
    { id:'privacy',     label:'Privacy & Consent'},
  ];

  return (
    <div className="page-transition" style={{ maxWidth: 960, margin: '0 auto' }}>
      <Toast msg={toast.msg} type={toast.type} />

      {/* Page Header */}
      <div className="header-actions" style={{ marginBottom: 28 }}>
        <div>
          <h1 className="page-title">Settings</h1>
          <p style={{ color: 'var(--muted)', marginTop: 4, fontSize: 14 }}>
            Manage your profile, security, sessions and preferences.
          </p>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{
        display:        'flex',
        gap:            4,
        borderBottom:   '1px solid var(--border)',
        marginBottom:   28,
        overflowX:      'auto',
        paddingBottom:  1,
      }}>
        {tabs.map(tab => (
          <button key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background:    'none',
              border:        'none',
              borderBottom:  activeTab===tab.id ? '2px solid var(--green)' : '2px solid transparent',
              color:         activeTab===tab.id ? 'var(--green)' : 'var(--muted)',
              padding:       '10px 16px',
              cursor:        'pointer',
              fontSize:      13,
              fontWeight:    600,
              whiteSpace:    'nowrap',
              transition:    'all 0.15s',
              marginBottom:  -1,
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: PROFILE ─────────────────────────────────────────────── */}
      {activeTab === 'profile' && (
        <div className="grid-2">
          {/* Profile Info */}
          <Card>
            <SectionTitle>Profile Information</SectionTitle>

            {/* Avatar */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:24 }}>
              <label style={{ cursor: 'pointer', position: 'relative' }}>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} disabled={saving.avatar} />
                <div style={{
                  width:80, height:80, borderRadius:'50%',
                  background:'var(--green)', color:'#003828',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:'var(--font-display)', fontWeight:800, fontSize:28,
                  border:'3px solid var(--border)',
                  overflow:'hidden',
                  opacity: saving.avatar ? 0.5 : 1
                }}>
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    profile?.initials || 'U'
                  )}
                </div>
                <div style={{
                  position: 'absolute', bottom: -5, right: -5,
                  background: 'var(--card)', border: '1px solid var(--border)',
                  borderRadius: '50%', padding: 4, display: 'flex', color: 'var(--green)'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                </div>
              </label>
              <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, marginTop:12 }}>
                {profile?.fullName}
              </p>
              <p style={{ color:'var(--muted)', fontSize:12 }}>{profile?.accountId}</p>
            </div>

            <form onSubmit={profileForm.handleSubmit}
              style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <FieldLabel>FULL NAME</FieldLabel>
                <input className="input-field"
                  name="fullName"
                  value={profileForm.values.fullName}
                  onChange={profileForm.handleChange}
                  onBlur={profileForm.handleBlur}
                  placeholder="Your full name" />
                {profileForm.touched.fullName && profileForm.errors.fullName && (
                  <p style={{ color:'var(--red)', fontSize:11, marginTop:4 }}>{profileForm.errors.fullName}</p>
                )}
              </div>
              <div>
                <FieldLabel>EMAIL ADDRESS</FieldLabel>
                <input className="input-field"
                  value={profile?.email || ''}
                  disabled
                  style={{ opacity:0.5, cursor:'not-allowed' }}
                  placeholder="Email (cannot be changed)" />
                <p style={{ color:'var(--muted)', fontSize:11, marginTop:4 }}>Email cannot be changed for security reasons.</p>
              </div>
              <div>
                <FieldLabel>PHONE NUMBER</FieldLabel>
                <input className="input-field"
                  name="phone"
                  value={profileForm.values.phone}
                  onChange={profileForm.handleChange}
                  placeholder="+91 98765 43210" />
              </div>
              <button type="submit" className="btn-primary"
                disabled={saving.profile || !profileForm.dirty}
                style={{ height:44, fontSize:14, marginTop:4 }}>
                {saving.profile ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </Card>

          {/* Account Info */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <Card>
              <SectionTitle>Account Details</SectionTitle>
              {[
                { label:'Member Since',  value: fullDate(profile?.createdAt) },
                { label:'Last Login',    value: fullDate(profile?.lastLoginAt) },
                { label:'Account ID',    value: profile?.accountId },
                { label:'Current Plan',  value: profile?.plan === 'pro' ? '⭐ Pro Plan' : 'Free Plan' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display:'flex', justifyContent:'space-between',
                  alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
                  <span style={{ color:'var(--muted)', fontSize:13 }}>{label}</span>
                  <span style={{ fontSize:13, fontWeight:600 }}>{value}</span>
                </div>
              ))}
            </Card>

            <Card>
              <SectionTitle>Plan</SectionTitle>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                <div>
                  <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:20 }}>
                    {profile?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
                  </p>
                  <p style={{ color:'var(--muted)', fontSize:12, marginTop:4 }}>
                    {profile?.plan === 'pro' ? 'Billed annually' : 'Upgrade for more features'}
                  </p>
                </div>
                <span style={{
                  background: profile?.plan==='pro' ? 'rgba(66,229,176,0.1)' : 'var(--card-high)',
                  color:      profile?.plan==='pro' ? 'var(--green)'          : 'var(--muted)',
                  border:     `1px solid ${profile?.plan==='pro' ? 'rgba(66,229,176,0.3)' : 'var(--border)'}`,
                  borderRadius:4, padding:'4px 12px', fontSize:11, fontWeight:700, textTransform:'uppercase',
                }}>
                  {profile?.plan === 'pro' ? 'Active' : 'Free'}
                </span>
              </div>
              {profile?.plan !== 'pro' && (
                <button className="btn-primary" style={{ width:'100%', height:40, fontSize:14 }}>
                  ⭐ Upgrade to Pro
                </button>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* ── TAB: SECURITY ────────────────────────────────────────────── */}
      {activeTab === 'security' && (
        <div className="grid-2">
          {/* Change Password */}
          <Card>
            <SectionTitle>Change Password</SectionTitle>
            <form onSubmit={passwordForm.handleSubmit}
              style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {[
                { name:'currentPassword', label:'CURRENT PASSWORD', placeholder:'Enter current password' },
                { name:'newPassword',     label:'NEW PASSWORD',     placeholder:'Min 8 characters'       },
                { name:'confirmPassword', label:'CONFIRM PASSWORD', placeholder:'Repeat new password'    },
              ].map(field => (
                <div key={field.name}>
                  <FieldLabel>{field.label}</FieldLabel>
                  <input className="input-field"
                    type="password"
                    name={field.name}
                    placeholder={field.placeholder}
                    value={passwordForm.values[field.name]}
                    onChange={passwordForm.handleChange}
                    onBlur={passwordForm.handleBlur}
                  />
                  {passwordForm.touched[field.name] && passwordForm.errors[field.name] && (
                    <p style={{ color:'var(--red)', fontSize:11, marginTop:4 }}>
                      {passwordForm.errors[field.name]}
                    </p>
                  )}
                </div>
              ))}
              <div style={{
                background:'rgba(255,188,162,0.08)', border:'1px solid rgba(255,188,162,0.2)',
                borderRadius:8, padding:'12px 14px', fontSize:12, color:'var(--orange)', marginTop:4,
              }}>
                ⚠️ Changing your password will log out all other active sessions for security.
              </div>
              <button type="submit" className="btn-primary"
                disabled={saving.password}
                style={{ height:44, fontSize:14 }}>
                {saving.password ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </Card>

          {/* 2FA */}
          <Card>
            <SectionTitle>Two-Factor Authentication</SectionTitle>
            <div style={{
              display:'flex', alignItems:'flex-start', justifyContent:'space-between',
              padding:'16px', background:'var(--card-high)', borderRadius:8, border:'1px solid var(--border)',
            }}>
              <div style={{ flex:1, marginRight:16 }}>
                <p style={{ fontWeight:600, fontSize:14, marginBottom:4 }}>
                  🛡️ Two-Factor Authentication
                </p>
                <p style={{ color:'var(--muted)', fontSize:12, lineHeight:1.6 }}>
                  Add an extra layer of security to your account.
                  When enabled, you'll need to verify your identity on new devices.
                </p>
                <p style={{ marginTop:10, fontSize:12,
                  color: profile?.twoFAEnabled ? 'var(--green)' : 'var(--muted)' }}>
                  Status: <strong>{profile?.twoFAEnabled ? '✅ Enabled' : '❌ Disabled'}</strong>
                </p>
              </div>
              <Toggle
                checked={!!profile?.twoFAEnabled}
                onChange={handle2FAToggle}
              />
            </div>

            <Divider />

            {/* Password last changed */}
            <div style={{ padding:'12px 0' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <p style={{ fontWeight:600, fontSize:14 }}>🔐 Password</p>
                  <p style={{ color:'var(--muted)', fontSize:12, marginTop:2 }}>
                    {profile?.passwordChangedAt
                      ? `Last changed ${timeAgo(profile.passwordChangedAt)}`
                      : 'Never changed'}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('security')}
                  className="btn-ghost"
                  style={{ height:36, padding:'0 16px', fontSize:13 }}>
                  Change
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB: ACTIVE SESSIONS ─────────────────────────────────────── */}
      {activeTab === 'sessions' && (
        <Card>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <div>
              <SectionTitle>Active Sessions</SectionTitle>
              <p style={{ color:'var(--muted)', fontSize:13, marginTop:-12 }}>
                {sessions.length} active session{sessions.length !== 1 ? 's' : ''} found across your devices.
              </p>
            </div>
            {sessions.filter(s => !s.isCurrent).length > 0 && (
              <button className="btn-ghost"
                onClick={handleRevokeAll}
                style={{ height:36, padding:'0 16px', fontSize:13,
                  color:'var(--red)', borderColor:'rgba(255,77,77,0.3)' }}>
                🔴 Revoke All Others
              </button>
            )}
          </div>

          {sessions.length === 0 ? (
            <div style={{ padding:'40px 0', textAlign:'center', color:'var(--muted)' }}>
              No active sessions found.
            </div>
          ) : (
            sessions.map((session, i) => (
              <div key={session._id}
                className={`anim-fade-up delay-${i}`}
                style={{
                  display:       'flex',
                  alignItems:    'flex-start',
                  gap:           16,
                  padding:       '16px',
                  borderRadius:  8,
                  border:        `1px solid ${session.isCurrent ? 'rgba(66,229,176,0.3)' : 'var(--border)'}`,
                  background:    session.isCurrent ? 'rgba(66,229,176,0.04)' : 'var(--card-high)',
                  marginBottom:  10,
                  borderLeft:    `3px solid ${session.isCurrent ? 'var(--green)' : 'var(--border)'}`,
                }}>

                {/* Device icon */}
                <div style={{
                  width:44, height:44, borderRadius:10,
                  background:'var(--card)', border:'1px solid var(--border)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  flexShrink:0,
                }}>
                  <DeviceIcon device={session.device} />
                </div>

                {/* Session info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <span style={{ fontWeight:700, fontSize:14 }}>{session.device}</span>
                    {session.isCurrent && (
                      <span style={{
                        background:'rgba(66,229,176,0.1)', color:'var(--green)',
                        border:'1px solid rgba(66,229,176,0.3)',
                        borderRadius:4, fontSize:10, fontWeight:700,
                        padding:'2px 8px', textTransform:'uppercase', letterSpacing:'0.05em',
                      }}>
                        Current Session
                      </span>
                    )}
                  </div>
                  <div className="session-meta">
                    {[
                      { icon:'📍', label: session.location?.city || 'Unknown location' },
                      { icon:'🌐', label: session.ipAddress || '—' },
                      { icon:'🕐', label: session.lastActiveAgo || 'Unknown' },
                      { icon:'💻', label: session.os || '—' },
                      { icon:'🌍', label: session.browser || '—' },
                      { icon:'📅', label: `Login: ${fullDate(session.createdAt)}` },
                    ].map((item, j) => (
                      <div key={j} style={{ display:'flex', alignItems:'center', gap:4 }}>
                        <span style={{ fontSize:11 }}>{item.icon}</span>
                        <span style={{ color:'var(--muted)', fontSize:12, overflow:'hidden',
                          whiteSpace:'nowrap', textOverflow:'ellipsis' }}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revoke button */}
                {!session.isCurrent && (
                  <button
                    onClick={() => handleRevokeSession(session._id)}
                    disabled={revokingId === session._id}
                    style={{
                      background:   'none',
                      border:       '1px solid rgba(255,77,77,0.3)',
                      borderRadius: 6,
                      color:        'var(--red)',
                      fontSize:     12,
                      fontWeight:   600,
                      padding:      '6px 14px',
                      cursor:       'pointer',
                      flexShrink:   0,
                      transition:   'all 0.15s',
                    }}
                    onMouseOver={e => e.target.style.background = 'rgba(255,77,77,0.1)'}
                    onMouseOut={e  => e.target.style.background = 'none'}
                  >
                    {revokingId === session._id ? '...' : 'Revoke'}
                  </button>
                )}
              </div>
            ))
          )}
        </Card>
      )}

      {/* ── TAB: ACTIVITY LOG ────────────────────────────────────────── */}
      {activeTab === 'activity' && (
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

          {/* Login History */}
          <Card>
            <SectionTitle>Login History</SectionTitle>
            <p style={{ color:'var(--muted)', fontSize:13, marginBottom:16, marginTop:-12 }}>
              Your last {loginHistory.length} login{loginHistory.length !== 1 ? 's' : ''} across all devices.
            </p>
            {loginHistory.length === 0 ? (
              <div style={{ padding:'24px 0', textAlign:'center', color:'var(--muted)' }}>No login history yet.</div>
            ) : (
              loginHistory.map((log, i) => (
                <div key={log._id}
                  style={{
                    display:'flex', alignItems:'center', gap:14,
                    padding:'12px 0', borderBottom:'1px solid var(--border)',
                  }}>
                  <div style={{
                    width:36, height:36, borderRadius:8,
                    background:'rgba(66,229,176,0.1)',
                    border:'1px solid rgba(66,229,176,0.2)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:16, flexShrink:0,
                  }}>
                    🔑
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:13, fontWeight:600, marginBottom:2 }}>Signed in</p>
                    <p style={{ fontSize:12, color:'var(--muted)' }}>
                      {log.device} · {log.ipAddress}
                    </p>
                  </div>
                  <span style={{ fontSize:12, color:'var(--muted)', flexShrink:0 }}>
                    {fullDate(log.createdAt)}
                  </span>
                </div>
              ))
            )}
          </Card>

          {/* Full Activity Log */}
          <Card>
            <SectionTitle>Full Activity Log</SectionTitle>
            <p style={{ color:'var(--muted)', fontSize:13, marginBottom:16, marginTop:-12 }}>
              Complete audit trail of all actions on your account.
            </p>
            {activityLogs.length === 0 ? (
              <div style={{ padding:'24px 0', textAlign:'center', color:'var(--muted)' }}>No activity yet.</div>
            ) : (
              activityLogs.map((log, i) => (
                <div key={log._id}
                  className={`anim-fade-up delay-${Math.min(i,8)}`}
                  style={{
                    display:'flex', alignItems:'flex-start', gap:14,
                    padding:'12px 0', borderBottom:'1px solid var(--border)',
                  }}>
                  <div style={{
                    width:36, height:36, borderRadius:8,
                    background:'var(--card-high)', border:'1px solid var(--border)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:15, flexShrink:0,
                  }}>
                    <ActionIcon action={log.action} />
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:13, fontWeight:600, marginBottom:2 }}>{log.description}</p>
                    <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                      <span style={{ fontSize:11, color:'var(--muted)' }}>
                        📍 {log.ipAddress}
                      </span>
                      <span style={{ fontSize:11, color:'var(--muted)' }}>
                        💻 {log.device}
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize:11, color:'var(--muted)', flexShrink:0 }}>
                    {timeAgo(log.createdAt)}
                  </span>
                </div>
              ))
            )}
          </Card>
        </div>
      )}

      {/* ── TAB: NOTIFICATIONS ───────────────────────────────────────── */}
      {activeTab === 'notifications' && (
        <Card>
          <SectionTitle>Notification Preferences</SectionTitle>
          <p style={{ color:'var(--muted)', fontSize:13, marginBottom:24, marginTop:-12 }}>
            Choose which notifications you want to receive in-app and via email.
          </p>

          {[
            {
              key:   'newTransaction',
              title: 'New Transaction Alerts',
              desc:  'Get notified for every inflow or outflow on your accounts. Includes large expense alerts and income received.',
              icon:  '💸',
            },
            {
              key:   'weeklyReport',
              title: 'Weekly Report',
              desc:  'A summary of your spending and income sent every Sunday morning. Helps you track your financial health.',
              icon:  '📊',
            },
            {
              key:   'subRenewal',
              title: 'Subscription Renewal Reminders',
              desc:  'Alert 3–7 days before any tracked subscription renews. Never be surprised by a charge again.',
              icon:  '🔔',
            },
          ].map(({ key, title, desc, icon }) => (
            <div key={key} style={{
              display:'flex', alignItems:'flex-start', justifyContent:'space-between',
              gap:16, padding:'20px', marginBottom:12,
              background:'var(--card-high)', border:'1px solid var(--border)',
              borderRadius:8, transition:'border-color 0.2s',
            }}>
              <div style={{ display:'flex', gap:12, flex:1 }}>
                <span style={{ fontSize:22, flexShrink:0 }}>{icon}</span>
                <div>
                  <p style={{ fontWeight:600, fontSize:14, marginBottom:4 }}>{title}</p>
                  <p style={{ color:'var(--muted)', fontSize:12, lineHeight:1.6 }}>{desc}</p>
                </div>
              </div>
              <Toggle
                checked={!!notifPrefs[key]}
                onChange={() => handleNotifToggle(key)}
              />
            </div>
          ))}
        </Card>
      )}

      {/* ── TAB: PREFERENCES ─────────────────────────────────────────── */}
      {activeTab === 'preferences' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
          <Card>
            <SectionTitle>Interface Theme</SectionTitle>
            <div style={{ display:'flex', gap:8 }}>
              {['dark','light','system'].map(t => (
                <button key={t}
                  onClick={() => handleThemeChange(t)}
                  className={theme===t ? 'btn-primary' : 'btn-ghost'}
                  style={{
                    flex:1, height:44, fontSize:13, fontWeight:600,
                    textTransform:'capitalize',
                  }}>
                  {t==='dark' ? '🌙' : t==='light' ? '☀️' : '💻'} {t.charAt(0).toUpperCase()+t.slice(1)}
                </button>
              ))}
            </div>
            <p style={{ color:'var(--muted)', fontSize:12, marginTop:12 }}>
              Current theme: <strong style={{ color:'var(--green)' }}>{theme}</strong>
            </p>
          </Card>

          <Card>
            <SectionTitle>Currency & Language</SectionTitle>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <FieldLabel>BASE CURRENCY</FieldLabel>
                <select className="input-field"
                  defaultValue="INR"
                  onChange={async (e) => {
                    try {
                      await api.updatePreferences({ currency: e.target.value });
                      showToast('Currency preference saved');
                    } catch { showToast('Failed to save currency','error'); }
                  }}>
                  <option value="INR">₹ INR — Indian Rupee</option>
                  <option value="USD">$ USD — US Dollar</option>
                  <option value="EUR">€ EUR — Euro</option>
                  <option value="GBP">£ GBP — British Pound</option>
                </select>
                <p style={{ color:'var(--muted)', fontSize:11, marginTop:4 }}>
                  All dashboard figures will use this currency.
                </p>
              </div>
              <div>
                <FieldLabel>LANGUAGE</FieldLabel>
                <select className="input-field"
                  defaultValue="en-IN"
                  onChange={async (e) => {
                    try {
                      await api.updatePreferences({ language: e.target.value });
                      showToast('Language preference saved');
                    } catch { showToast('Failed to save','error'); }
                  }}>
                  <option value="en-IN">English (India)</option>
                  <option value="en-US">English (US)</option>
                  <option value="hi-IN">हिंदी</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB: PRIVACY & CONSENT ────────────────────────────────────── */}
      {activeTab === 'privacy' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Current Consents Status */}
          <Card>
            <SectionTitle>Your Consent Status</SectionTitle>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20, marginTop: -12 }}>
              Review and manage what data you've allowed FlowTrack to use.
            </p>

            {[
              {
                type:     'termsOfService',
                label:    'Terms of Service',
                icon:     '📋',
                required: true,
                link:     '/terms',
              },
              {
                type:     'privacyPolicy',
                label:    'Privacy Policy',
                icon:     '🔒',
                required: true,
                link:     '/privacy',
              },
              {
                type:     'marketing',
                label:    'Marketing Emails',
                icon:     '📧',
                required: false,
              },
              {
                type:     'analytics',
                label:    'Anonymous Analytics',
                icon:     '📊',
                required: false,
              },
            ].map(item => (
              <div key={item.type} style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
                padding:        '16px',
                marginBottom:   8,
                background:     'var(--card-high)',
                border:         '1px solid var(--border)',
                borderRadius:   8,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{item.label}</p>
                    <p style={{ color: 'var(--muted)', fontSize: 12 }}>
                      {item.required ? 'Required to use FlowTrack' : 'Optional — withdraw anytime'}
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noreferrer"
                          style={{ color: 'var(--green)', marginLeft: 8, fontSize: 12 }}>
                          View →
                        </a>
                      )}
                    </p>
                  </div>
                </div>
                {item.required ? (
                  <span style={{
                    background: 'rgba(66,229,176,0.1)', color: 'var(--green)',
                    border: '1px solid rgba(66,229,176,0.3)',
                    borderRadius: 4, fontSize: 11, fontWeight: 700,
                    padding: '4px 12px', textTransform: 'uppercase',
                  }}>✓ Accepted</span>
                ) : (
                  <button
                    onClick={async () => {
                      try {
                        await api.withdrawConsent(item.type);
                        showToast(`${item.label} consent withdrawn`);
                      } catch (err) {
                        showToast(err.message, 'error');
                      }
                    }}
                    style={{
                      background: 'none', border: '1px solid rgba(255,77,77,0.3)',
                      borderRadius: 6, color: 'var(--red)', fontSize: 12,
                      fontWeight: 600, padding: '6px 14px', cursor: 'pointer',
                    }}>
                    Withdraw
                  </button>
                )}
              </div>
            ))}
          </Card>

          {/* Data Deletion */}
          <Card style={{ border: '1px solid rgba(255,77,77,0.2)' }}>
            <SectionTitle>Delete My Account & Data</SectionTitle>
            <div style={{
              background: 'rgba(255,77,77,0.06)', border: '1px solid rgba(255,77,77,0.2)',
              borderRadius: 8, padding: '16px', marginBottom: 16,
            }}>
              <p style={{ color: '#ffbca2', fontSize: 13, lineHeight: 1.6 }}>
                ⚠️ This will permanently delete your account and all associated data including
                transactions, accounts, subscriptions and reports. This action cannot be undone.
                We will process deletion within 30 days as required by Indian law.
              </p>
            </div>
            <button
              onClick={async () => {
                const reason = prompt('Please tell us why you want to delete your account (optional):');
                if (reason === null) return; // user cancelled
                try {
                  await api.requestDataDeletion({ reason });
                  showToast('Deletion request submitted. We will process it within 30 days.');
                } catch (err) {
                  showToast(err.message, 'error');
                }
              }}
              style={{
                background: 'none', border: '1px solid rgba(255,77,77,0.4)',
                borderRadius: 8, color: 'var(--red)', fontSize: 14,
                fontWeight: 600, padding: '12px 24px', cursor: 'pointer',
                transition: 'all 0.15s',
              }}>
              🗑️ Request Account Deletion
            </button>
          </Card>
        </div>
      )}
    </div>
  );
}

// ── Skeleton loader ────────────────────────────────────────────────────
function SettingsSkeleton() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ height:32, width:200, background:'var(--card-high)', borderRadius:6,
        backgroundImage:'linear-gradient(90deg,var(--card) 0%,var(--card-high) 50%,var(--card) 100%)',
        backgroundSize:'600px 100%', animation:'shimmerLoad 1.5s infinite linear' }} />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        {[1,2].map(i => <div key={i} className="card" style={{ height:400,
          backgroundImage:'linear-gradient(90deg,var(--card) 0%,var(--card-high) 50%,var(--card) 100%)',
          backgroundSize:'600px 100%', animation:'shimmerLoad 1.5s infinite linear' }} />)}
      </div>
    </div>
  );
}
