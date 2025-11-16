interface Props {
  date: string;
  onDateChange: (value: string) => void;
  onRun: (date?: string) => void;
  loading: boolean;
  regionFilter: string;
  onRegionFilterChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  currencyFilter: string;
  onCurrencyFilterChange: (value: string) => void;
}

export function FiltersBar({
  date,
  onDateChange,
  onRun,
  loading,
  regionFilter,
  onRegionFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  currencyFilter,
  onCurrencyFilterChange,
}: Props) {
  return (
    <section className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">Analysis Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">Region Filter</label>
        <select
          value={regionFilter}
          onChange={(e) => onRegionFilterChange(e.target.value)}
          className="min-w-[140px] rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All</option>
          <option value="APAC">APAC</option>
          <option value="LATAM">LATAM</option>
          <option value="Global">Global</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">Category Filter</label>
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="min-w-[160px] rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All</option>
          <option value="Central Bank Policy">Central Bank Policy</option>
          <option value="Geopolitical/Trade">Geopolitical/Trade</option>
          <option value="Commodity/Energy Shock">Commodity/Energy Shock</option>
          <option value="Regulatory/Structural">Regulatory/Structural</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">Currency Filter</label>
        <input
          type="text"
          placeholder="All"
          value={currencyFilter === 'all' ? '' : currencyFilter}
          onChange={(e) => onCurrencyFilterChange(e.target.value || 'all')}
          className="min-w-[80px] rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <button
        type="button"
        onClick={() => onRun(date)}
        disabled={loading}
        className="ml-auto inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 disabled:cursor-default disabled:opacity-60"
      >
        {loading ? 'Applying…' : 'Apply Filters'}
      </button>
    </section>
  );
}
