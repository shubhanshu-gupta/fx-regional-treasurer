import type { FxAction } from '../types';

interface Props {
  actions: FxAction[];
}

export function ActionsPanel({ actions }: Props) {
  const badgeColor = (severity: FxAction['severity']) => {
    switch (severity) {
      case 'evaluate_hedging':
        return '#b91c1c';
      case 'monitor':
        return '#b45309';
      default:
        return '#065f46';
    }
  };

  const label = (severity: FxAction['severity']) => {
    switch (severity) {
      case 'evaluate_hedging':
        return 'Evaluate hedging strategies';
      case 'monitor':
        return 'Monitor for further escalation';
      default:
        return 'No immediate treasury action required';
    }
  };

  return (
    <section
      style={{
        backgroundColor: '#020617',
        borderRadius: 12,
        padding: '1.25rem 1.5rem',
        border: '1px solid #1f2937',
      }}
    >
      <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Actions / Alerts</h2>
      {actions.length === 0 ? (
        <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
          No immediate treasury action required based on currently detected structural developments.
        </p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {actions.map((action, idx) => (
            <li
              key={idx}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: 8,
                backgroundColor: '#020617',
                border: '1px solid #1f2937',
                marginBottom: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    padding: '0.15rem 0.5rem',
                    borderRadius: 999,
                    fontSize: '0.75rem',
                    backgroundColor: badgeColor(action.severity),
                  }}
                >
                  {label(action.severity)}
                </span>
                {action.currencies.length > 0 && (
                  <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                    Exposure: {action.currencies.join(', ')}
                  </span>
                )}
              </div>
              <p style={{ marginTop: '0.35rem', fontSize: '0.85rem' }}>{action.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
