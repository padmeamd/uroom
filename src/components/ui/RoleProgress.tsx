import { RoleRequirement } from '@/types/room';
import { User, Check } from 'lucide-react';

interface RoleProgressProps {
  roles: RoleRequirement[];
  compact?: boolean;
}

export function RoleProgress({ roles, compact = false }: RoleProgressProps) {
  if (roles.length === 0) return null;
  
  const totalRequired = roles.reduce((sum, r) => sum + r.required, 0);
  const totalFilled = roles.reduce((sum, r) => sum + r.filled, 0);
  const percentage = (totalFilled / totalRequired) * 100;
  
  if (compact) {
    const neededRoles = roles.filter(r => r.filled < r.required);
    return (
      <div className="flex flex-wrap gap-1.5">
        {neededRoles.slice(0, 3).map((role, i) => (
          <span
            key={i}
            className="text-2xs px-2 py-0.5 rounded bg-primary/20 text-primary font-mono uppercase tracking-wider border border-primary/40"
          >
            {role.role}
          </span>
        ))}
        {neededRoles.length > 3 && (
          <span className="text-2xs px-2 py-0.5 rounded bg-secondary text-muted-foreground font-mono">
            +{neededRoles.length - 3}
          </span>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-mono font-bold text-foreground uppercase tracking-wider">◈ TEAM STATUS</span>
        <span className="text-primary font-mono font-bold">
          {totalFilled}/{totalRequired}
        </span>
      </div>
      
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {roles.map((role, i) => {
          const isFilled = role.filled >= role.required;
          return (
            <div
              key={i}
              className={`flex items-center gap-2 text-sm p-2 rounded border ${
                isFilled 
                  ? 'bg-accent/10 border-accent/40' 
                  : 'bg-secondary/50 border-primary/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded flex items-center justify-center ${
                  isFilled
                    ? 'bg-accent text-accent-foreground shadow-neon-purple'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isFilled ? <Check size={12} /> : <User size={12} />}
              </div>
              <span className={`font-mono text-xs uppercase ${isFilled ? 'text-accent' : 'text-foreground'}`}>
                {role.role}
              </span>
              <span className="ml-auto text-muted-foreground text-2xs font-mono">
                {role.filled}/{role.required}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
