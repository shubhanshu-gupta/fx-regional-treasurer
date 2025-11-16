import type { FxEvent } from '../types';

interface Props {
  items: FxEvent[];
}

export function EventsTable({ items }: Props) {
  return (
    <section className="rounded-xl border bg-card shadow-sm">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-base font-semibold text-foreground">Structured News Analysis</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Material developments with long-term FX implications from credible sources
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Category</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Headline / Event</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Region</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Currencies</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Source</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Impact Statement</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-3 text-sm text-muted-foreground">
                  No qualifying structural developments for the selected filters.
                </td>
              </tr>
            ) : (
              items.map((item, idx) => (
                <tr key={idx} className="border-t border-border">
                  <td className="px-3 py-2 align-top text-sm text-foreground">{item.category}</td>
                  <td className="px-3 py-2 align-top text-sm text-foreground">
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline-offset-2 hover:underline"
                      >
                        {item.headline}
                      </a>
                    ) : (
                      item.headline
                    )}
                  </td>
                  <td className="px-3 py-2 align-top text-sm text-foreground">{item.region}</td>
                  <td className="px-3 py-2 align-top text-sm text-foreground">{item.currencies.join(', ')}</td>
                  <td className="px-3 py-2 align-top text-sm text-foreground">
                    <div>{item.source}</div>
                    <div className="text-xs text-muted-foreground">{item.source_date}</div>
                  </td>
                  <td className="px-3 py-2 align-top text-sm text-foreground">{item.impact_statement}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
