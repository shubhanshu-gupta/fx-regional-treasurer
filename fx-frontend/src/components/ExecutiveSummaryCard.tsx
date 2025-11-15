import type { DailyReport } from '../types';

interface Props {
  report: DailyReport | null;
}

export function ExecutiveSummaryCard({ report }: Props) {
  return (
    <section
      style={{
        backgroundColor: '#020617',
        borderRadius: 12,
        padding: '1.25rem 1.5rem',
        border: '1px solid #1f2937',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Executive Summary</h2>
        <span style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
          {report ? `As of ${report.date}` : 'No data loaded yet'}
        </span>
      </div>
      <p style={{ marginTop: '0.75rem', fontSize: '0.95rem', lineHeight: 1.5, color: '#e5e7eb' }}>
        {report?.executive_summary ??
          'Run the daily briefing to see medium- to long-term structural FX and liquidity developments.'}
      </p>
      {report && (
        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#9ca3af' }}>
          Items: {report.items.length} • Actions: {report.actions.length}
        </p>
      )}
    </section>
  );
}
