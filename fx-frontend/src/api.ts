import type { DailyReport } from './types';

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export async function fetchDailyReport(date?: string): Promise<DailyReport> {
  const res = await fetch(`${baseUrl}/api/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date: date ?? null }),
  });

  if (!res.ok) {
    throw new Error(`Backend error: ${res.status}`);
  }

  return (await res.json()) as DailyReport;
}
