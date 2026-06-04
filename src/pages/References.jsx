import React, { useMemo, useState } from 'react';
import BottomNav from '@/components/layout/BottomNav';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Search, ExternalLink, BookOpen } from 'lucide-react';
import { ARMY_REFERENCES, REFERENCE_FILTERS } from '@/lib/army-references';
import { openExternalUrl } from '@/lib/open-external-url';

export default function References() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ARMY_REFERENCES.filter(ref => {
      const matchesFilter = filter === 'All' || ref.category === filter;
      if (!matchesFilter) return false;
      if (!q) return true;
      return (
        ref.title.toLowerCase().includes(q)
        || ref.subtitle.toLowerCase().includes(q)
        || ref.summary.toLowerCase().includes(q)
        || ref.tag.toLowerCase().includes(q)
      );
    });
  }, [query, filter]);

  return (
    <div className="flex min-h-screen max-w-full flex-col overflow-x-hidden bg-background">
      <div className="px-page pb-header-pb pt-header-pt">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="h-4 w-4 text-primary" />
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">Field reference</p>
        </div>
        <h1 className="text-2xl font-inter font-black text-foreground uppercase tracking-tight">Regulation Library</h1>
        <p className="text-xs text-muted-foreground font-inter mt-1">
          Quick reads and official Army Publishing Directorate links
        </p>
      </div>

      <div className="px-page pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search regulations..."
            className="h-12 rounded-xl border-border bg-card pl-10 font-inter shadow-sm"
          />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {REFERENCE_FILTERS.map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-4 py-2 text-[10px] font-inter font-semibold uppercase tracking-widest transition-all duration-200 ${
                filter === f
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-page pb-bottom-scroll">
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground font-inter">No references match your search.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map(ref => (
              <button
                key={ref.id}
                type="button"
                onClick={() => setSelected(ref)}
                className="group rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[9px] font-inter font-bold uppercase tracking-widest text-primary">
                    {ref.tag}
                  </span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground/40 transition-colors group-hover:text-primary" />
                </div>
                <h3 className="mt-3 text-lg font-inter font-bold text-foreground">{ref.title}</h3>
                <p className="mt-1 text-xs font-inter text-muted-foreground leading-snug">{ref.subtitle}</p>
                <p className="mt-2 line-clamp-2 text-[11px] text-muted-foreground/80 font-inter">{ref.summary}</p>
                <span className="mt-3 inline-block text-[10px] font-inter font-semibold uppercase tracking-widest text-primary">
                  Quick read →
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <DialogContent className="max-h-[min(88dvh,90svh)] overflow-y-auto rounded-2xl border-border sm:max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <span className="text-[10px] font-inter font-bold uppercase tracking-widest text-primary">{selected.tag}</span>
                <DialogTitle className="font-inter text-xl">{selected.title}</DialogTitle>
                <DialogDescription className="font-inter text-sm">{selected.subtitle}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter mb-2">Quick read</p>
                  <ul className="space-y-2.5">
                    {selected.quickRead.map((point, i) => (
                      <li key={i} className="flex gap-2 text-sm font-inter text-foreground leading-relaxed">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => openExternalUrl(selected.url)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-inter font-semibold uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Open official PDF
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
