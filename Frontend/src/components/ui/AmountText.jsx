import { formatINR } from '../../utils/format';

export default function AmountText({ amount, showSign = false, className = '' }) {
  const colorClass = amount > 0 ? 'amount-positive' : amount < 0 ? 'amount-negative' : 'amount-neutral';
  return (
    <span className={`currency-display ${colorClass} ${className}`}>
      {formatINR(amount, showSign)}
    </span>
  );
}
