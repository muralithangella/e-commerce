
export default function ErrorMessage({ message, error }) {
  const text   = message ?? error?.message ?? 'Something went wrong.';
  const type   = error?.type;
  const status = error?.status;

  const icon = type === 'network' ? '📡'
    : status === 404              ? '🔍'
    : status >= 500               ? '🔧'
    : '⚠';

  return (
    <div role="alert" style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '14px 18px', borderRadius: 'var(--radius-sm)',
      background: '#fee2e2', color: '#991b1b',
      border: '1px solid #fca5a5', fontSize: '14px', lineHeight: 1.5,
    }}>
      <span aria-hidden="true" style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
      <span>{text}</span>
    </div>
  );
}
