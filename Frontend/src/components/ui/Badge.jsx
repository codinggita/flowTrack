export default function Badge({ children, variant = 'default', className = '' }) {
  const variantClass = variant === 'green' ? 'badge-green' : variant === 'orange' ? 'badge-orange' : '';
  return (
    <span className={`badge ${variantClass} ${className}`}>
      {children}
    </span>
  );
}
