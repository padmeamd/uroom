import { UrgentFilter } from '@/types/room';
import { Zap, Calendar, Rocket, Clock, LayoutGrid } from 'lucide-react';

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
    { id: 'all', label: 'All', icon: LayoutGrid },
    { id: 'starting-soon', label: 'Starting Soon', icon: Zap },
    { id: 'this-week', label: 'This Week', icon: Calendar },
    { id: 'quick-project', label: 'Quick Projects', icon: Rocket },
  ];

  const typeFilters: { id: 'all' | 'EVENT' | 'PROJECT'; label: string }[] = [
    { id: 'all', label: 'All Types' },
    { id: 'EVENT', label: 'Events' },
    { id: 'PROJECT', label: 'Projects' },
  ];

  return (
    <div className="space-y-3">
      {/* Urgent Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {urgentFilters.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onFilterChange(id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeFilter === id
                ? id === 'starting-soon'
                  ? 'badge-urgent'
                  : 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            <Icon size={14} />
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
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              typeFilter === id
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
