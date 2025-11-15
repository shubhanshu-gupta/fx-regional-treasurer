import type { FxEvent } from '../types';

interface Props {
  items: FxEvent[];
}

export function EventsTable({ items }: Props) {
  return (
    <section
      style={{
        backgroundColor: '#020617',
        borderRadius: 12,
        border: '1px solid #1f2937',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #1f2937' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Structural FX / Liquidity Developments</h2>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead style={{ backgroundColor: '#020617' }}>
            <tr>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Headline / Event</th>
              <th style={thStyle}>Region</th>
              <th style={thStyle}>Impacted Ccy(ies)</th>
              <th style={thStyle}>Source &amp; Date</th>
              <th style={thStyle}>Brief Impact Statement</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '0.75rem 1rem', color: '#9ca3af' }}>
                  No qualifying structural developments for the selected filters.
                </td>
              </tr>
            ) : (
              items.map((item, idx) => (
                <tr key={idx} style={{ borderTop: '1px solid #111827' }}>
                  <td style={tdStyle}>{item.category}</td>
                  <td style={tdStyle}>
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#60a5fa', textDecoration: 'none' }}
                      >
                        {item.headline}
                      </a>
                    ) : (
                      item.headline
                    )}
                  </td>
                  <td style={tdStyle}>{item.region}</td>
                  <td style={tdStyle}>{item.currencies.join(', ')}</td>
                  <td style={tdStyle}>
                    <div>{item.source}</div>
                    <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{item.source_date}</div>
                  </td>
                  <td style={tdStyle}>{item.impact_statement}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.5rem 0.75rem',
  fontWeight: 500,
  color: '#9ca3af',
  borderBottom: '1px solid #111827',
};

const tdStyle: React.CSSProperties = {
  padding: '0.5rem 0.75rem',
  verticalAlign: 'top',
};
