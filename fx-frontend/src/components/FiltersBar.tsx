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
    <section
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        alignItems: 'flex-end',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          style={{
            backgroundColor: '#020617',
            borderRadius: 8,
            border: '1px solid #374151',
            color: '#e5e7eb',
            padding: '0.35rem 0.5rem',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Region</label>
        <select
          value={regionFilter}
          onChange={(e) => onRegionFilterChange(e.target.value)}
          style={selectStyle}
        >
          <option value="all">All</option>
          <option value="APAC">APAC</option>
          <option value="LATAM">LATAM</option>
          <option value="Global">Global</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Category</label>
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          style={selectStyle}
        >
          <option value="all">All</option>
          <option value="Central Bank Policy">Central Bank Policy</option>
          <option value="Geopolitical/Trade">Geopolitical/Trade</option>
          <option value="Commodity/Energy Shock">Commodity/Energy Shock</option>
          <option value="Regulatory/Structural">Regulatory/Structural</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Currency</label>
        <input
          type="text"
          placeholder="All"
          value={currencyFilter === 'all' ? '' : currencyFilter}
          onChange={(e) => onCurrencyFilterChange(e.target.value || 'all')}
          style={{
            backgroundColor: '#020617',
            borderRadius: 8,
            border: '1px solid #374151',
            color: '#e5e7eb',
            padding: '0.35rem 0.5rem',
            minWidth: 80,
          }}
        />
      </div>

      <button
        type="button"
        onClick={() => onRun(date)}
        disabled={loading}
        style={{
          marginLeft: 'auto',
          padding: '0.5rem 1rem',
          borderRadius: 999,
          border: 'none',
          backgroundColor: loading ? '#374151' : '#2563eb',
          color: '#e5e7eb',
          cursor: loading ? 'default' : 'pointer',
          fontWeight: 500,
        }}
      >
        {loading ? 'Running…' : 'Run Daily Briefing'}
      </button>
    </section>
  );
}

const selectStyle: React.CSSProperties = {
  backgroundColor: '#020617',
  borderRadius: 8,
  border: '1px solid #374151',
  color: '#e5e7eb',
  padding: '0.35rem 0.5rem',
  minWidth: 140,
};
