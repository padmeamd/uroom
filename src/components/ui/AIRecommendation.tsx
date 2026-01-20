import { Sparkles } from 'lucide-react';

interface AIRecommendationProps {
  reasons: string[];
  score?: number;
  compact?: boolean;
}

export function AIRecommendation({ reasons, score, compact = false }: AIRecommendationProps) {
  if (reasons.length === 0) return null;
  
  if (compact) {
    return (
      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-uroom-sky-light/50 rounded-lg px-3 py-2">
        <Sparkles size={14} className="text-primary mt-0.5 shrink-0" />
        <span>
          <span className="font-medium text-primary">Recommended:</span>{' '}
          {reasons.slice(0, 2).join(' • ')}
        </span>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-primary" />
        <span className="text-sm font-medium text-primary">Why this Room?</span>
        {score && (
          <span className="ml-auto text-xs font-bold text-primary bg-uroom-sky-light px-2 py-0.5 rounded-full">
            {score}% match
          </span>
        )}
      </div>
      <ul className="space-y-1">
        {reasons.map((reason, i) => (
          <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary" />
            {reason}
          </li>
        ))}
      </ul>
    </div>
  );
}
