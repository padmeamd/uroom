import { Sparkles, Cpu } from 'lucide-react';

interface AIRecommendationProps {
  reasons: string[];
  score?: number;
  compact?: boolean;
}

export function AIRecommendation({ reasons, score, compact = false }: AIRecommendationProps) {
  if (reasons.length === 0) return null;
  
  if (compact) {
    return (
      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-accent/10 rounded border border-accent/30 px-3 py-2">
        <Cpu size={14} className="text-accent mt-0.5 shrink-0 animate-neon" />
        <span className="font-mono">
          <span className="font-bold text-accent uppercase tracking-wider">AI:</span>{' '}
          {reasons.slice(0, 2).join(' • ')}
        </span>
      </div>
    );
  }
  
  return (
    <div className="space-y-2 p-3 bg-accent/10 rounded border border-accent/30">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Sparkles size={16} className="text-accent animate-neon" />
        </div>
        <span className="text-sm font-mono font-bold text-accent uppercase tracking-wider">◈ AI ANALYSIS</span>
        {score && (
          <span className="ml-auto text-xs font-mono font-bold text-primary bg-primary/20 px-2 py-0.5 rounded border border-primary/40">
            {score}% MATCH
          </span>
        )}
      </div>
      <ul className="space-y-1.5">
        {reasons.map((reason, i) => (
          <li key={i} className="text-sm text-muted-foreground flex items-center gap-2 font-mono">
            <span className="text-accent">▸</span>
            {reason}
          </li>
        ))}
      </ul>
    </div>
  );
}
