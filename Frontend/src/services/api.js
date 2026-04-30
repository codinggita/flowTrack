const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const req = async (endpoint, options = {}) => {
  const token      = localStorage.getItem('ft_token');
  const sessionToken = localStorage.getItem('ft_session');
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${BASE}${endpoint}`, {
    headers: {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(sessionToken && { 'x-session-token': sessionToken }),
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const api = {
  // Auth
  register:       d  => req('/auth/register',        { method:'POST', body:JSON.stringify(d) }),
  login:          d  => req('/auth/login',            { method:'POST', body:JSON.stringify(d) }),
  googleAuth:     d  => req('/auth/google',           { method:'POST', body:JSON.stringify(d) }),
  getMe:          () => req('/auth/me'),
  forgotPassword: d  => req('/auth/forgot-password',  { method:'POST', body:JSON.stringify(d) }),
  resetPassword: (token, d) => req(`/auth/reset-password/${token}`, { method:'POST', body:JSON.stringify(d) }),

  // Accounts
  getAccounts:    ()     => req('/accounts'),
  createAccount:  d      => req('/accounts',      { method:'POST',   body:JSON.stringify(d) }),
  updateAccount:  (id,d) => req(`/accounts/${id}`,{ method:'PUT',    body:JSON.stringify(d) }),
  deleteAccount:  id     => req(`/accounts/${id}`,{ method:'DELETE' }),

  // Transactions
  getTransactions:   p      => req(`/transactions?${new URLSearchParams(p)}`),
  createTransaction: d      => req('/transactions',      { method:'POST',   body:JSON.stringify(d) }),
  updateTransaction: (id,d) => req(`/transactions/${id}`,{ method:'PUT',    body:JSON.stringify(d) }),
  deleteTransaction: id     => req(`/transactions/${id}`,{ method:'DELETE' }),
  uploadCSV:         form   => req('/transactions/csv-upload', { method:'POST', body:form }),

  // Reports
  getDashboardStats:      ()  => req('/reports/dashboard-stats'),
  getSummary:             p   => req(`/reports/summary?period=${p}`),
  getSpendingByCategory:  p   => req(`/reports/spending-by-category?period=${p}`),
  getSpendingByMerchant:  p   => req(`/reports/spending-by-merchant?period=${p}`),
  getCashFlow:            y   => req(`/reports/cash-flow?year=${y}`),
  getTopCategories:       p   => req(`/reports/top-categories?period=${p}`),

  // Recurring
  getSubscriptions:   ()     => req('/recurring'),
  createSubscription: d      => req('/recurring',     { method:'POST',   body:JSON.stringify(d) }),
  updateSubscription: (id,d) => req(`/recurring/${id}`,{ method:'PUT',   body:JSON.stringify(d) }),
  deleteSubscription: id     => req(`/recurring/${id}`,{ method:'DELETE' }),

  // Settings
  getProfile:          () => req('/settings/profile'),
  updateProfile:       d  => req('/settings/profile',       { method:'PUT', body:JSON.stringify(d) }),
  updatePreferences:   d  => req('/settings/preferences',   { method:'PUT', body:JSON.stringify(d) }),
  changePassword:      d  => req('/settings/password',      { method:'PUT', body:JSON.stringify(d) }),
  updateNotifications: d  => req('/settings/notifications', { method:'PUT', body:JSON.stringify(d) }),
  toggle2FA:           () => req('/settings/2fa',           { method:'PUT' }),
  getSessions:         () => req('/settings/sessions'),
  revokeSession:       (id) => req(`/settings/sessions/${id}/revoke`, { method: 'DELETE' }),
  revokeAllSessions:   () => req('/settings/sessions/revoke-all', { method: 'DELETE' }),
  getActivityLog:      (p) => req(`/settings/activity?${new URLSearchParams(p || {})}`),
  getLoginHistory:     () => req('/settings/login-history'),

  // Legal & Consent
  getConsentStatus:     ()  => req('/legal/consent-status'),
  acceptConsents:       (d) => req('/legal/accept',                    { method: 'POST',   body: JSON.stringify(d) }),
  withdrawConsent:      (type) => req(`/legal/withdraw/${type}`,       { method: 'PUT'    }),
  getConsentHistory:    ()  => req('/legal/consent-history'),
  requestDataDeletion:  (d) => req('/legal/request-data-deletion',     { method: 'POST',   body: JSON.stringify(d) }),

  // Notifications
  getNotifications:   (params) => req(`/notifications?${new URLSearchParams(params || {})}`),
  getUnreadCount:     ()       => req('/notifications/unread-count'),
  markAsRead:         (id)     => req(`/notifications/${id}/read`,     { method: 'PUT' }),
  markAllAsRead:      ()       => req('/notifications/mark-all-read',  { method: 'PUT' }),
  deleteNotification: (id)     => req(`/notifications/${id}`,          { method: 'DELETE' }),
  clearAllNotifications: ()    => req('/notifications/clear-all',      { method: 'DELETE' }),

  // Support
  getSupportStats:  ()       => req('/support/stats'),
  getTickets:       (params) => req(`/support?${new URLSearchParams(params || {})}`),
  getTicket:        (id)     => req(`/support/${id}`),
  createTicket:     (d)      => req('/support',            { method: 'POST', body: JSON.stringify(d) }),
  replyToTicket:    (id, d)  => req(`/support/${id}/reply`,{ method: 'POST', body: JSON.stringify(d) }),
  rateTicket:       (id, d)  => req(`/support/${id}/rate`, { method: 'POST', body: JSON.stringify(d) }),
  closeTicket:      (id)     => req(`/support/${id}/close`,{ method: 'PUT'  }),
};
