import { UrgentFilter } from '@/types/room';
import { Zap, Calendar, Rocket, LayoutGrid } from 'lucide-react';

interface FilterBarProps {
  activeFilter: UrgentFilter;
  onFilterChange: (filter: UrgentFilter) => void;
  typeFilter: 'all' | 'EVENT' | 'PROJECT';
  onTypeChange: (type: 'all' | 'EVENT' | 'PROJECT') => void;
}

export function FilterBar({
  activeFilter,
  onFilterChange,
  typeFilter,
  onTypeChange,
}: FilterBarProps) {
  const urgentFilters: { id: UrgentFilter; label: string; icon: typeof Zap }[] = [
    { id: 'all', label: 'ALL', icon: LayoutGrid },
    { id: 'starting-soon', label: '⚡ LIVE', icon: Zap },
    { id: 'this-week', label: '▶ WEEK', icon: Calendar },
    { id: 'quick-project', label: '◉ QUICK', icon: Rocket },
  ];

  const typeFilters: { id: 'all' | 'EVENT' | 'PROJECT'; label: string }[] = [
    { id: 'all', label: 'ALL TYPES' },
    { id: 'EVENT', label: 'EVENTS' },
    { id: 'PROJECT', label: 'PROJECTS' },
  ];

  return (
    <div className="space-y-3">
      {/* Urgent Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {urgentFilters.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onFilterChange(id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
              activeFilter === id
                ? id === 'starting-soon'
                  ? 'badge-urgent border-transparent'
                  : 'bg-primary text-primary-foreground border-primary shadow-neon-green'
                : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary border-border/50 hover:border-primary/50'
            }`}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      {/* Type Filters */}
      <div className="flex gap-2">
        {typeFilters.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onTypeChange(id)}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-wider transition-all border ${
              typeFilter === id
                ? id === 'EVENT' 
                  ? 'bg-primary text-primary-foreground border-primary shadow-neon-green'
                  : id === 'PROJECT'
                  ? 'bg-accent text-accent-foreground border-accent shadow-neon-purple'
                  : 'bg-foreground text-background border-foreground'
                : 'text-muted-foreground hover:text-foreground border-transparent hover:border-border'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
