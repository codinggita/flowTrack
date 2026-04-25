export const formatINR = (amount, showSign = false) => {
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (showSign) {
    return amount >= 0 ? `+\u20B9\u00A0${formatted}` : `-\u20B9\u00A0${formatted}`;
  }
  return `\u20B9${formatted}`;
};

export const formatINRShort = (amount) => {
  if (amount >= 10000000) return `\u20B9${(amount/10000000).toFixed(2)}Cr`;
  if (amount >= 100000)   return `\u20B9${(amount/100000).toFixed(2)}L`;
  if (amount >= 1000)     return `\u20B9${(amount/1000).toFixed(1)}K`;
  return `\u20B9${amount.toLocaleString('en-IN')}`;
};
