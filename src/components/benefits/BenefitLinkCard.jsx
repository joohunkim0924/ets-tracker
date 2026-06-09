import React from 'react';
import { ExternalLink, Star } from 'lucide-react';

export default function BenefitLinkCard({ item, isFavorite, onToggleFavorite }) {
  const Icon = item.icon;

  return (
    <div className="group relative rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
      <button
        type="button"
        onClick={() => onToggleFavorite(item.id)}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 shadow-sm touch-manipulation transition-colors hover:bg-secondary"
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Star
          className={`h-4 w-4 ${isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
        />
      </button>

      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block pr-10 text-left"
      >
        <div className="flex items-start justify-between gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[9px] font-inter font-bold uppercase tracking-widest text-primary">
            {item.categoryEmoji} {item.categoryLabel}
          </span>
          {Icon ? (
            <Icon className="h-4 w-4 shrink-0 text-primary" />
          ) : (
            <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-primary" />
          )}
        </div>
        <h3 className="mt-3 text-base font-inter font-bold text-foreground leading-snug">{item.name}</h3>
        <p className="mt-1.5 line-clamp-3 text-xs font-inter text-muted-foreground leading-relaxed">{item.description}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-inter font-semibold uppercase tracking-widest text-primary">
          {item.action}
          <ExternalLink className="h-3 w-3" />
        </span>
      </a>
    </div>
  );
}
