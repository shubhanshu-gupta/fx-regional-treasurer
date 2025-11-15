import { useEffect, useState } from 'react';
import { fetchDailyReport, type ApiKeysPayload } from './api';
import type { DailyReport, FxEvent } from './types';
import { ExecutiveSummaryCard } from './components/ExecutiveSummaryCard';
import { EventsTable } from './components/EventsTable';
import { ActionsPanel } from './components/ActionsPanel';
import { FiltersBar } from './components/FiltersBar';

export default function App() {
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [report, setReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openaiKey, setOpenaiKey] = useState<string>('');
  const [serpapiKey, setSerpapiKey] = useState<string>('');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currencyFilter, setCurrencyFilter] = useState<string>('all');

  const loadReport = async (selectedDate?: string) => {
    try {
      if (!openaiKey || !serpapiKey) {
        setError('Please provide both OpenAI and SerpAPI API keys before running the daily briefing.');
        return;
      }
      setLoading(true);
      setError(null);
      const keys: ApiKeysPayload = {
        openaiApiKey: openaiKey || undefined,
        serpapiApiKey: serpapiKey || undefined,
      };
      const result = await fetchDailyReport(selectedDate ?? date, keys);
      setReport(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load for today
    void loadReport(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredItems: FxEvent[] = (report?.items ?? []).filter((item) => {
    if (regionFilter !== 'all' && item.region !== regionFilter) return false;
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (currencyFilter !== 'all' && !item.currencies.includes(currencyFilter)) return false;
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#e5e7eb' }}>
      <header style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #1f2937' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Treasury FX Risk Dashboard</h1>
        <p style={{ marginTop: '0.5rem', color: '#9ca3af' }}>
          Regional treasurer view focused on structural FX and liquidity developments in APAC and LATAM.
        </p>
      </header>

      <main style={{ padding: '1.5rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
        <section
          style={{
            marginBottom: '1rem',
            padding: '1rem 1.25rem',
            borderRadius: 12,
            backgroundColor: '#020617',
            border: '1px solid #1f2937',
          }}
        >
          <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>API Keys</h2>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '0.35rem' }}>
            OpenAI and SerpAPI keys are required for live runs. Arize keys are optional and can be configured
            server-side for tracing.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: 260 }}>
              <label style={{ fontSize: '0.85rem', color: '#9ca3af' }}>OpenAI API Key (required)</label>
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-..."
                style={{
                  backgroundColor: '#020617',
                  borderRadius: 8,
                  border: '1px solid #374151',
                  color: '#e5e7eb',
                  padding: '0.35rem 0.5rem',
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: 260 }}>
              <label style={{ fontSize: '0.85rem', color: '#9ca3af' }}>SerpAPI Key (required)</label>
              <input
                type="password"
                value={serpapiKey}
                onChange={(e) => setSerpapiKey(e.target.value)}
                placeholder="serpapi_key..."
                style={{
                  backgroundColor: '#020617',
                  borderRadius: 8,
                  border: '1px solid #374151',
                  color: '#e5e7eb',
                  padding: '0.35rem 0.5rem',
                }}
              />
            </div>
          </div>
        </section>

        <FiltersBar
          date={date}
          onDateChange={setDate}
          onRun={loadReport}
          loading={loading}
          regionFilter={regionFilter}
          onRegionFilterChange={setRegionFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          currencyFilter={currencyFilter}
          onCurrencyFilterChange={setCurrencyFilter}
        />

        {error && (
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', backgroundColor: '#7f1d1d', borderRadius: 8 }}>
            <span>Error: {error}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
          <ExecutiveSummaryCard report={report} />
          <ActionsPanel actions={report?.actions ?? []} />
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <EventsTable items={filteredItems} />
        </div>
      </main>
    </div>
  );
}
