import type { FxAction } from '../types';

interface Props {
  actions: FxAction[];
}

export function ActionsPanel({ actions }: Props) {
  const accentColor = (severity: FxAction['severity']) => {
    switch (severity) {
      case 'evaluate_hedging':
        return '#dc2626';
      case 'monitor':
        return '#ea580c';
      default:
        return '#16a34a';
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
    <section className="rounded-xl border bg-card p-5 shadow-sm">
      <h2 className="text-base font-semibold text-foreground">Action / Alert Section</h2>
      <p className="mt-1 text-sm text-muted-foreground">Treasury recommendations based on current developments</p>
      {actions.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          No immediate treasury action required based on current developments.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {actions.map((action, idx) => (
            <li
              key={idx}
              className={`flex rounded-lg border px-4 py-3 text-sm shadow-sm ${
                action.severity === 'evaluate_hedging'
                  ? 'border-destructive/50 bg-destructive/5'
                  : action.severity === 'monitor'
                  ? 'border-warning/50 bg-warning/5'
                  : 'border-success/40 bg-success/5'
              }`}
            >
              <div className="flex w-full items-start gap-3">
                <div className="mt-0.5 h-6 w-6 flex-shrink-0 rounded-full border bg-card text-xs font-semibold" style={{ borderColor: accentColor(action.severity), color: accentColor(action.severity) }}>
                  <span className="flex h-full w-full items-center justify-center">i</span>
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {action.currencies.map((c) => (
                      <span
                        key={c}
                        className="rounded-full border border-border bg-background px-2 py-0.5 text-xs font-medium text-foreground"
                      >
                        {c}
                      </span>
                    ))}
                    <span className="text-sm font-semibold text-foreground">{label(action.severity)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{action.summary}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
