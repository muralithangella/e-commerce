export default function Spinner({ size = 'md', center = false }) {
  const cls = `spinner${size === 'sm' ? ' spinner-sm' : ''}`;
  if (center) return <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}><span className={cls} /></div>;
  return <span className={cls} />;
}
