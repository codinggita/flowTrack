export const formatINR = (amount = 0) => {
  const abs = Math.abs(amount);
  return `₹${abs.toLocaleString('en-IN', { minimumFractionDigits:2, maximumFractionDigits:2 })}`;
};

export const formatINRShort = (value = 0) => {
  const abs = Math.abs(value);
  if (abs >= 10000000) return `₹${(abs/10000000).toFixed(1)}Cr`;
  if (abs >= 100000)   return `₹${(abs/100000).toFixed(1)}L`;
  if (abs >= 1000)     return `₹${(abs/1000).toFixed(0)}K`;
  return `₹${abs.toLocaleString('en-IN')}`;
};

export const formatDate = (date, fmt = 'short') => {
  const d = new Date(date);
  if (fmt === 'short')  return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short' });
  if (fmt === 'full')   return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
  return d.toISOString().split('T')[0];
};
