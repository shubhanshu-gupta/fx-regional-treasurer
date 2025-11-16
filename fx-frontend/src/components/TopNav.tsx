interface Props {
  activeTab: 'dashboard' | 'settings';
  onTabChange: (tab: 'dashboard' | 'settings') => void;
}

export function TopNav({ activeTab, onTabChange }: Props) {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
              FX
            </div>
            <span className="text-xl font-bold text-foreground">FX Monitor</span>
          </div>
          <nav className="flex items-center gap-1 text-sm">
            <button
              type="button"
              onClick={() => onTabChange('dashboard')}
              className={
                'rounded-md px-4 py-2 font-medium transition-colors ' +
                (activeTab === 'dashboard'
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground')
              }
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => onTabChange('settings')}
              className={
                'rounded-md px-4 py-2 font-medium transition-colors ' +
                (activeTab === 'settings'
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground')
              }
            >
              Settings
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
