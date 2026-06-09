import { useCallback, useEffect, useState } from 'react';
import { getFavoriteIds, toggleFavorite as toggleFavoriteStore } from '@/lib/benefit-favorites';
import { getBenefitItemById } from '@/lib/benefits-data';

export function useBenefitFavorites() {
  const [favoriteIds, setFavoriteIds] = useState(() => getFavoriteIds());

  useEffect(() => {
    const refresh = () => setFavoriteIds(getFavoriteIds());
    window.addEventListener('benefit-favorites-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('benefit-favorites-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const toggleFavorite = useCallback((id) => {
    setFavoriteIds(toggleFavoriteStore(id));
  }, []);

  const isFavorite = useCallback((id) => favoriteIds.includes(id), [favoriteIds]);

  const favoriteItems = favoriteIds
    .map(id => getBenefitItemById(id))
    .filter(Boolean);

  return { favoriteIds, favoriteItems, isFavorite, toggleFavorite };
}
