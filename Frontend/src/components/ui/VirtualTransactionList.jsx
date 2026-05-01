import { memo, useMemo } from 'react';
import { List } from 'react-window';

const ROW_HEIGHT = 52;

const TransactionRow = memo(({ index, style, data }) => {
  const { transactions, onDelete, formatINR, formatDate } = data;
  const tx = transactions[index];
  if (!tx) return <div style={style} />;

  return (
    <div style={{
      ...style, display:'grid', gridTemplateColumns:'130px 1fr 130px 140px',
      alignItems:'center', padding:'0 16px', borderBottom:'1px solid var(--border)',
      transition:'background 0.15s', cursor:'pointer',
    }}
    onMouseOver={e => e.currentTarget.style.background = 'var(--card-high)'}
    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ color:'var(--muted)', fontSize:13 }}>{formatDate(tx.date,'full')}</span>
      <span style={{ fontSize:14, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
        {tx.description}
      </span>
      <span>
        <span className={`badge ${['Income','Investment'].includes(tx.category)?'badge-green':''}`}>
          {tx.category}
        </span>
      </span>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{
          fontFamily:'var(--font-display)', fontWeight:600,
          color: tx.type === 'income' ? 'var(--green)' : 'var(--red)',
        }}>
          {tx.type === 'income' ? '+ ' : '- '}{formatINR(tx.amount)}
        </span>
        <button
          onClick={e => { e.stopPropagation(); onDelete(tx._id); }}
          style={{ background:'none', border:'none', color:'var(--muted)',
            cursor:'pointer', fontSize:18, padding:'0 4px', lineHeight:1 }}>
          ×
        </button>
      </div>
    </div>
  );
});

TransactionRow.displayName = 'TransactionRow';

export default function VirtualTransactionList({ transactions, onDelete, formatINR, formatDate, height = 520 }) {
  const itemData = useMemo(() => ({
    transactions, onDelete, formatINR, formatDate,
  }), [transactions, onDelete, formatINR, formatDate]);

  if (!transactions.length) {
    return (
      <div style={{ padding:'48px 0', textAlign:'center', color:'var(--muted)' }}>
        No transactions found. Add your first one!
      </div>
    );
  }

  return (
    <List
      height={height}
      itemCount={transactions.length}
      itemSize={ROW_HEIGHT}
      itemData={itemData}
      overscanCount={5}
      style={{ overflowX:'hidden' }}
    >
      {TransactionRow}
    </List>
  );
}
