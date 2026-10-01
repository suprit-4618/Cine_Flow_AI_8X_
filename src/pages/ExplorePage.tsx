import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Search, 
  X, 
  SlidersHorizontal 
} from 'lucide-react';
import { PrototypeBadge } from '../components/common/PrototypeBadge';
import { ExploreCard } from '../components/explore/ExploreCard';
import { ExploreDetailModal } from '../components/explore/ExploreDetailModal';
import { EXPLORE_ITEMS } from '../data/exploreData';
import { ExploreItem, GenreCategory } from '../types';
import { useStudio } from '../context/StudioContext';

type CategoryFilter = 'all' | GenreCategory;

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const { updateDraft } = useStudio();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [selectedItem, setSelectedItem] = useState<ExploreItem | null>(null);

  // Filter items by category and search keyword
  const filteredItems = useMemo(() => {
    let items = [...EXPLORE_ITEMS];

    if (activeCategory !== 'all') {
      items = items.filter(item => item.genre === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.prompt.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return items;
  }, [activeCategory, searchQuery]);

  // Remix in Single-Shot Studio
  const handleRemixStudio = (item: ExploreItem) => {
    updateDraft({
      prompt: item.prompt,
      styleId: item.styleId,
      modelId: item.modelId,
      aspectRatio: item.aspectRatio,
      cameraMotion: item.cameraMotion,
      durationSec: item.durationSec,
    });
    navigate('/');
  };

  // Direct 3-Shot Storyboard
  const handleRemixStoryboard = (_item: ExploreItem) => {
    navigate('/storyboard');
  };

  const categories: { key: CategoryFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All Looks', count: EXPLORE_ITEMS.length },
    { key: 'neon_city', label: 'Neon Noir', count: EXPLORE_ITEMS.filter(i => i.genre === 'neon_city').length },
    { key: 'alpine_nature', label: 'Alpine Vista', count: EXPLORE_ITEMS.filter(i => i.genre === 'alpine_nature').length },
    { key: 'deep_space', label: 'Deep Space', count: EXPLORE_ITEMS.filter(i => i.genre === 'deep_space').length },
    { key: 'macro_abstract', label: 'Macro Prism', count: EXPLORE_ITEMS.filter(i => i.genre === 'macro_abstract').length },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-cine-border">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight flex items-center gap-2">
              <Compass className="w-7 h-7 text-cine-amber" />
              <span>Explore Showcase</span>
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-surface-raised text-cine-amber border border-cine-border">
              {EXPLORE_ITEMS.length} Curated Masters
            </span>
          </div>
          <p className="text-sm text-text-muted mt-1">
            Discover community-curated prompt recipes, camera movements, and multi-angle scene choreography.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <PrototypeBadge />
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-dark border border-cine-border shadow-md">
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search showcase prompts by keyword, mood, or camera motion..."
            className="w-full pl-10 pr-9 py-2.5 bg-surface-raised/70 border border-cine-border rounded-xl text-xs sm:text-sm text-text-primary placeholder-text-muted/60 focus:outline-none focus:border-cine-amber focus:ring-1 focus:ring-cine-amber transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-text-muted shrink-0 ml-1 hidden lg:inline" />
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                activeCategory === cat.key
                  ? 'bg-cine-amber/20 border-cine-amber text-cine-amber shadow-amber-sm'
                  : 'bg-surface-raised/60 border-cine-border text-text-muted hover:text-text-primary'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Showcase Cards */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {filteredItems.map((item) => (
            <ExploreCard
              key={item.id}
              item={item}
              onSelect={setSelectedItem}
              onRemixStudio={handleRemixStudio}
              onRemixStoryboard={handleRemixStoryboard}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-8 sm:p-12 rounded-2xl bg-surface-dark border border-cine-border flex flex-col items-center justify-center text-center min-h-[320px] space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-surface-raised border border-cine-border flex items-center justify-center text-cine-amber shadow-amber-sm">
            <Compass className="w-7 h-7" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-text-primary">No Matching Prompts Found</h2>
          <p className="text-xs sm:text-sm text-text-muted max-w-sm leading-relaxed">
            No showcase items match "{searchQuery}" under the selected category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="mt-2 px-4 py-2 rounded-xl bg-surface-raised hover:bg-surface-hover border border-cine-border text-xs font-bold text-cine-amber"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Accessible Detail Modal */}
      {selectedItem && (
        <ExploreDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onRemixStudio={handleRemixStudio}
          onRemixStoryboard={handleRemixStoryboard}
        />
      )}
    </div>
  );
};
