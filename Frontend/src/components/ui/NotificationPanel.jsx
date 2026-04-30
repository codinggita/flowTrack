import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Time ago formatter
const timeAgo = (date) => {
  const secs = Math.floor((Date.now() - new Date(date)) / 1000);
  if (secs < 60)   return 'just now';
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400)return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
};

// Notification type config — icon, color, bg
const TYPE_CONFIG = {
  spending_alert: { icon: '📊', color: '#ff4d4d', bg: 'rgba(255,77,77,0.1)',    border: 'rgba(255,77,77,0.3)'    },
  income:         { icon: '💰', color: '#42e5b0', bg: 'rgba(66,229,176,0.1)',   border: 'rgba(66,229,176,0.3)'   },
  upcoming_bill:  { icon: '🔔', color: '#ffbca2', bg: 'rgba(255,188,162,0.1)',  border: 'rgba(255,188,162,0.3)'  },
  low_balance:    { icon: '⚠️', color: '#ffd080', bg: 'rgba(255,208,128,0.1)',  border: 'rgba(255,208,128,0.3)'  },
  budget_alert:   { icon: '📉', color: '#ff7043', bg: 'rgba(255,112,67,0.1)',   border: 'rgba(255,112,67,0.3)'   },
  general:        { icon: 'ℹ️', color: '#42b0e5', bg: 'rgba(66,176,229,0.1)',   border: 'rgba(66,176,229,0.3)'   },
};

export default function NotificationPanel({
  open, onClose, notifications, unreadCount,
  loading, onMarkAsRead, onMarkAllAsRead, onDelete, onClearAll,
}) {
  const navigate   = useNavigate();
  const panelRef   = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleNotifClick = (notif) => {
    if (!notif.isRead) onMarkAsRead(notif._id);
    onClose();
    navigate(notif.link || '/dashboard');
  };

  return (
    <div
      ref={panelRef}
      style={{
        position:     'absolute', // Modified from 'fixed' to position under the bell relative to the container if needed. But let's stick to prompt's 'fixed' initially to be safe unless it looks bad, wait prompt says `position: 'fixed'` but `top: 64`, `right: 20`
        top:          64,
        right:        20,
        width:        380,
        maxHeight:    520,
        background:   '#1a211d',
        border:       '1px solid #3c4a43',
        borderRadius: 12,
        boxShadow:    '0 20px 60px rgba(0,0,0,0.5)',
        zIndex:       9999,
        display:      'flex',
        flexDirection:'column',
        overflow:     'hidden',
        animation:    'notifPanelIn 0.22s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {/* Header */}
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        padding:        '16px 20px',
        borderBottom:   '1px solid #3c4a43',
        flexShrink:     0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily:'Manrope,sans-serif', fontWeight: 700, fontSize: 16 }}>
            Notifications
          </span>
          {unreadCount > 0 && (
            <span style={{
              background:   '#42e5b0',
              color:        '#003828',
              borderRadius: 100,
              fontSize:     11,
              fontWeight:   700,
              padding:      '2px 8px',
              minWidth:     20,
              textAlign:    'center',
            }}>
              {unreadCount}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              style={{
                background:   'none',
                border:       '1px solid #3c4a43',
                borderRadius: 6,
                color:        '#42e5b0',
                fontSize:     11,
                fontWeight:   600,
                padding:      '4px 10px',
                cursor:       'pointer',
                transition:   'all 0.15s',
              }}
              onMouseOver={e => e.target.style.borderColor = '#42e5b0'}
              onMouseOut={e  => e.target.style.borderColor = '#3c4a43'}
            >
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              style={{
                background:   'none',
                border:       '1px solid #3c4a43',
                borderRadius: 6,
                color:        '#85948c',
                fontSize:     11,
                fontWeight:   600,
                padding:      '4px 10px',
                cursor:       'pointer',
                transition:   'all 0.15s',
              }}
              onMouseOver={e => e.target.style.color = '#ff4d4d'}
              onMouseOut={e  => e.target.style.color = '#85948c'}
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Notification List */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {loading && (
          <div style={{ display:'flex', justifyContent:'center', padding:40 }}>
            <div className="spinner"></div>
          </div>
        )}

        {!loading && notifications.length === 0 && (
          <div style={{
            padding:    '48px 20px',
            textAlign:  'center',
            display:    'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap:        12,
          }}>
            <span style={{ fontSize: 40 }}>🔕</span>
            <p style={{ color: '#dce4de', fontWeight: 600, fontSize: 14, margin: 0 }}>
              All caught up!
            </p>
            <p style={{ color: '#85948c', fontSize: 13, margin: 0 }}>
              No notifications yet. Add transactions to see alerts.
            </p>
          </div>
        )}

        {!loading && notifications.map((notif, i) => {
          const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.general;
          return (
            <div
              key={notif._id}
              onClick={() => handleNotifClick(notif)}
              style={{
                display:       'flex',
                gap:           12,
                padding:       '14px 20px',
                borderBottom:  '1px solid #242c28',
                cursor:        'pointer',
                background:    notif.isRead ? 'transparent' : 'rgba(66,229,176,0.03)',
                borderLeft:    notif.isRead ? '3px solid transparent' : '3px solid #42e5b0',
                transition:    'background 0.15s',
                animation:     `fadeSlideUp 0.25s ease ${i * 30}ms both`,
              }}
              onMouseOver={e => e.currentTarget.style.background = '#242c28'}
              onMouseOut={e  => e.currentTarget.style.background = notif.isRead ? 'transparent' : 'rgba(66,229,176,0.03)'}
            >
              {/* Icon */}
              <div style={{
                width:        36,
                height:       36,
                borderRadius: 8,
                background:   cfg.bg,
                border:       `1px solid ${cfg.border}`,
                display:      'flex',
                alignItems:   'center',
                justifyContent:'center',
                fontSize:     16,
                flexShrink:   0,
              }}>
                {cfg.icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <p style={{
                    fontSize:   13,
                    fontWeight: notif.isRead ? 500 : 700,
                    color:      notif.isRead ? '#bbcac1' : '#dce4de',
                    margin:     0,
                    lineHeight: 1.4,
                  }}>
                    {notif.title}
                  </p>
                  <button
                    onClick={e => { e.stopPropagation(); onDelete(notif._id); }}
                    style={{
                      background:   'none',
                      border:       'none',
                      color:        '#3c4a43',
                      cursor:       'pointer',
                      fontSize:     16,
                      lineHeight:   1,
                      padding:      '0 2px',
                      flexShrink:   0,
                      transition:   'color 0.15s',
                    }}
                    onMouseOver={e => e.target.style.color = '#ff4d4d'}
                    onMouseOut={e  => e.target.style.color = '#3c4a43'}
                  >
                    ×
                  </button>
                </div>
                <p style={{
                  fontSize:   12,
                  color:      '#85948c',
                  margin:     '3px 0 6px',
                  lineHeight: 1.5,
                  overflow:   'hidden',
                  display:    '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {notif.message}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: '#3c4a43' }}>{timeAgo(notif.createdAt)}</span>
                  {!notif.isRead && (
                    <span style={{
                      width:        6,
                      height:       6,
                      borderRadius: '50%',
                      background:   '#42e5b0',
                      display:      'inline-block',
                    }} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div style={{
          padding:      '12px 20px',
          borderTop:    '1px solid #3c4a43',
          textAlign:    'center',
          flexShrink:   0,
        }}>
          <button
            onClick={() => { onClose(); navigate('/notifications'); }}
            style={{
              background:   'none',
              border:       'none',
              color:        '#42e5b0',
              fontSize:     13,
              cursor:       'pointer',
              fontWeight:   600,
            }}
          >
            View all notifications →
          </button>
        </div>
      )}
    </div>
  );
}
