import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BottomNav from '@/components/layout/BottomNav';
import BenefitLinkCard from '@/components/benefits/BenefitLinkCard';
import { useBenefitFavorites } from '@/hooks/useBenefitFavorites';
import { VA_LINKS, getCategoryById } from '@/lib/benefits-data';
import { ArrowLeft } from 'lucide-react';

export default function BenefitsCategory() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useBenefitFavorites();

  const category = getCategoryById(categoryId);

  if (!category) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <div className="flex flex-1 flex-col items-center justify-center px-page pb-bottom-scroll">
          <p className="text-sm text-muted-foreground font-inter">Category not found.</p>
          <Link to="/benefits" className="mt-4 text-sm font-inter font-semibold text-primary">Back to benefits</Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  const showVaLinks = category.id === 'education';
  const vaItems = showVaLinks
    ? VA_LINKS.map(link => ({
      id: link.id,
      type: 'va',
      name: link.name,
      description: link.description,
      action: link.action,
      url: link.url,
      icon: link.icon,
      categoryId: category.id,
      categoryLabel: category.label,
      categoryEmoji: category.emoji,
    }))
    : [];

  const benefitItems = category.benefits.map(b => ({
    id: b.id,
    type: 'benefit',
    name: b.name,
    description: b.description,
    action: b.action,
    url: b.url,
    categoryId: category.id,
    categoryLabel: category.label,
    categoryEmoji: category.emoji,
  }));

  return (
    <div className="flex min-h-screen max-w-full flex-col overflow-x-hidden bg-background">
      <div className="px-page pb-header-pb pt-header-pt">
        <button
          type="button"
          onClick={() => navigate('/benefits')}
          className="mb-3 flex items-center gap-1.5 text-xs font-inter font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary touch-manipulation"
        >
          <ArrowLeft className="h-4 w-4" />
          Benefits
        </button>
        <div className={`mb-3 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br ${category.tileGradient} px-4 py-3 shadow-md`}>
          <span className="text-2xl">{category.emoji}</span>
          <div>
            <h1 className="text-xl font-inter font-black uppercase tracking-tight text-white">{category.label}</h1>
            <p className="text-[10px] font-inter uppercase tracking-widest text-white/80">
              {benefitItems.length + vaItems.length} links
            </p>
          </div>
        </div>
      </div>

      <div className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-page pb-bottom-scroll">
        {showVaLinks && vaItems.length > 0 && (
          <div className="mb-5">
            <p className="mb-2 text-[10px] font-inter uppercase tracking-[0.2em] text-muted-foreground">VA &amp; TA quick links</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {vaItems.map(item => (
                <BenefitLinkCard
                  key={item.id}
                  item={item}
                  isFavorite={isFavorite(item.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </div>
        )}

        <p className="mb-2 text-[10px] font-inter uppercase tracking-[0.2em] text-muted-foreground">
          {showVaLinks ? 'All education benefits' : 'All benefits'}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {benefitItems.map(item => (
            <BenefitLinkCard
              key={item.id}
              item={item}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
