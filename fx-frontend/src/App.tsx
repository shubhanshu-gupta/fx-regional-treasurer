import { useState } from 'react';
import { fetchDailyReport, type ApiKeysPayload } from './api';
import type { DailyReport, FxEvent } from './types';
import { ExecutiveSummaryCard } from './components/ExecutiveSummaryCard';
import { EventsTable } from './components/EventsTable';
import { ActionsPanel } from './components/ActionsPanel';
import { FiltersBar } from './components/FiltersBar';
import { TopNav } from './components/TopNav';

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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings'>('dashboard');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

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
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  const filteredItems: FxEvent[] = (report?.items ?? []).filter((item) => {
    if (regionFilter !== 'all' && item.region !== regionFilter) return false;
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (currencyFilter !== 'all' && !item.currencies.includes(currencyFilter)) return false;
    return true;
  });

  const renderDashboard = () => (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-1">FX News Monitor</h1>
            <p className="text-sm text-muted-foreground">
              Real-time currency market intelligence for treasury operations
            </p>
            {lastUpdated && (
              <p className="mt-2 text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => loadReport(date)}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 disabled:cursor-default disabled:opacity-60"
          >
            {loading ? 'Refreshing…' : 'Refresh Data'}
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Error: {error}
          </div>
        )}

        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="text-xs font-medium text-muted-foreground">Active Alerts</div>
            <div className="mt-2 text-3xl font-bold text-foreground">{report?.actions.length ?? 0}</div>
            <div className="mt-1 text-xs text-muted-foreground">Requires monitoring</div>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="text-xs font-medium text-muted-foreground">Regions Covered</div>
            <div className="mt-2 text-3xl font-bold text-foreground">2</div>
            <div className="mt-1 text-xs text-muted-foreground">APAC &amp; LATAM</div>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="text-xs font-medium text-muted-foreground">Risk Level</div>
            <div className="mt-2 inline-flex items-center gap-2">
              <span className="rounded-full border border-warning/40 bg-warning/10 px-3 py-0.5 text-xs font-semibold text-warning">
                Medium
              </span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Monitor closely</div>
          </div>
        </section>

        <section className="mt-6">
          <ExecutiveSummaryCard report={report} />
        </section>

        <section className="mt-6">
          <ActionsPanel actions={report?.actions ?? []} />
        </section>

        <section className="mt-6">
          <EventsTable items={filteredItems} />
        </section>
      </div>
    </main>
  );

  const renderSettings = () => (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure your API keys for the FX News Monitoring system.
        </p>

        <section className="mt-6 rounded-xl border bg-card p-6 shadow-md">
          <h2 className="text-base font-semibold text-foreground">API Configuration</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your OpenAI and SerpAPI keys to enable automated news monitoring and analysis.
          </p>

          <div className="mt-4 space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">OpenAI API Key</label>
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="text-xs text-muted-foreground">
                Used for AI-powered news analysis and summarization.
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">SerpAPI Key</label>
              <input
                type="password"
                value={serpapiKey}
                onChange={(e) => setSerpapiKey(e.target.value)}
                placeholder="Your SerpAPI key..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="text-xs text-muted-foreground">
                Used for automated news source monitoring and data collection.
              </span>
            </div>
          </div>

          <button
            type="button"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
          >
            Save API Keys
          </button>

          <p className="mt-3 text-xs text-muted-foreground">
            Keys are used only at runtime from your browser and are not persisted by the server.
          </p>
        </section>
      </div>
    </main>
  );

  return (
    <div className="min-h-screen bg-background">
      <TopNav activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'dashboard' ? renderDashboard() : renderSettings()}
    </div>
  );
}
