import React, { useMemo, useState } from 'react';
import BottomNav from '@/components/layout/BottomNav';
import { Input } from '@/components/ui/input';
import BenefitLinkCard from '@/components/benefits/BenefitLinkCard';
import CategoryTile from '@/components/benefits/CategoryTile';
import { useBenefitFavorites } from '@/hooks/useBenefitFavorites';
import { CATEGORIES, TOTAL_BENEFITS, searchBenefitItems } from '@/lib/benefits-data';
import { Search, Star } from 'lucide-react';

export default function Benefits() {
  const [query, setQuery] = useState('');
  const { favoriteItems, isFavorite, toggleFavorite } = useBenefitFavorites();

  const isSearching = query.trim().length > 0;

  const searchResults = useMemo(
    () => searchBenefitItems(query),
    [query],
  );

  return (
    <div className="flex min-h-screen max-w-full flex-col overflow-x-hidden bg-background">
      <div className="px-page pb-header-pb pt-header-pt">
        <div className="mb-1 flex items-center gap-2">
          <Star className="h-4 w-4 text-primary" />
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">U.S. Army</p>
        </div>
        <h1 className="text-2xl font-inter font-black text-foreground uppercase tracking-tight">Soldier Benefits</h1>
        <p className="mt-1 text-xs text-muted-foreground font-inter">
          {TOTAL_BENEFITS} benefits · star your go-to links
        </p>
      </div>

      <div className="px-page pb-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search benefits (BAH, GI Bill, TRICARE...)"
            className="h-12 rounded-xl border-border bg-card pl-10 font-inter shadow-sm"
          />
        </div>
      </div>

      <div className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-page pb-bottom-scroll">
        {isSearching ? (
          searchResults.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground font-inter">
              No benefits match your search.
            </p>
          ) : (
            <>
              <p className="mb-3 text-[10px] font-inter uppercase tracking-widest text-muted-foreground">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {searchResults.map(item => (
                  <BenefitLinkCard
                    key={item.id}
                    item={item}
                    isFavorite={isFavorite(item.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </>
          )
        ) : (
          <>
            {favoriteItems.length > 0 && (
              <div className="mb-6">
                <div className="mb-2 flex items-center gap-2">
                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                  <p className="text-[10px] font-inter uppercase tracking-[0.2em] text-muted-foreground">Favorites</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {favoriteItems.map(item => (
                    <BenefitLinkCard
                      key={item.id}
                      item={item}
                      isFavorite
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              </div>
            )}

            <p className="mb-3 text-[10px] font-inter uppercase tracking-[0.2em] text-muted-foreground">Browse categories</p>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map(cat => (
                <CategoryTile key={cat.id} category={cat} />
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
