import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Star, 
  Film, 
  Image as ImageIcon,
  Layers, 
  Plus, 
  X, 
  ArrowUpDown,
  History
} from 'lucide-react';
import { PrototypeBadge } from '../components/common/PrototypeBadge';
import { StorageBlockedBanner } from '../components/common/StorageBlockedBanner';
import { HistoryCard } from '../components/history/HistoryCard';
import { HistoryDetailModal } from '../components/history/HistoryDetailModal';
import { UndoToast } from '../components/history/UndoToast';
import { SingleGeneration, Storyboard } from '../types';
import { StorageService } from '../services/storage';
import { useStudio } from '../context/StudioContext';

type FilterType = 'all' | 'video' | 'image' | 'storyboard' | 'favorites';
type SortOrder = 'newest' | 'oldest';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { reusePrompt } = useStudio();

  const [generations, setGenerations] = useState<SingleGeneration[]>([]);
  const [storyboards, setStoryboards] = useState<Storyboard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [selectedItem, setSelectedItem] = useState<SingleGeneration | Storyboard | null>(null);

  // Undo Toast state
  const [deletedRecord, setDeletedRecord] = useState<{
    item: SingleGeneration | Storyboard;
    type: 'generation' | 'storyboard';
  } | null>(null);

  const [isStorageBlocked, setIsStorageBlocked] = useState(false);

  const reloadData = () => {
    const state = StorageService.loadState();
    setGenerations(state.generations || []);
    setStoryboards(state.storyboards || []);
    setIsStorageBlocked(StorageService.isBlocked());
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    StorageService.toggleFavorite(id);
    reloadData();
  };

  // Delete with Undo
  const handleDelete = (item: SingleGeneration | Storyboard) => {
    const isStoryboard = 'shots' in item;
    if (isStoryboard) {
      StorageService.deleteStoryboard(item.id);
      setDeletedRecord({ item, type: 'storyboard' });
    } else {
      StorageService.deleteGeneration(item.id);
      setDeletedRecord({ item, type: 'generation' });
    }
    reloadData();
  };

  // Undo deletion
  const handleUndo = () => {
    if (!deletedRecord) return;
    if (deletedRecord.type === 'storyboard') {
      StorageService.saveStoryboard(deletedRecord.item as Storyboard);
    } else {
      StorageService.saveGeneration(deletedRecord.item as SingleGeneration);
    }
    setDeletedRecord(null);
    reloadData();
  };

  // Reuse prompt in Studio or Storyboard
  const handleReusePrompt = (item: SingleGeneration | Storyboard) => {
    const isStoryboard = 'shots' in item;
    if (isStoryboard) {
      navigate('/storyboard');
    } else {
      reusePrompt(item as SingleGeneration);
      navigate('/');
    }
  };

  // Combined and filtered items list
  const combinedItems: (SingleGeneration | Storyboard)[] = useMemo(() => {
    let items: (SingleGeneration | Storyboard)[] = [];

    if (activeFilter === 'all') {
      items = [...generations, ...storyboards];
    } else if (activeFilter === 'video') {
      items = generations.filter(g => g.mediaType !== 'image');
    } else if (activeFilter === 'image') {
      items = generations.filter(g => g.mediaType === 'image');
    } else if (activeFilter === 'storyboard') {
      items = [...storyboards];
    } else if (activeFilter === 'favorites') {
      items = [
        ...generations.filter(g => g.isFavorite),
        ...storyboards.filter(s => s.isFavorite),
      ];
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(item => {
        if ('shots' in item) {
          return item.masterIdea.toLowerCase().includes(q) || 
                 item.title.toLowerCase().includes(q) ||
                 item.genre.toLowerCase().includes(q);
        } else {
          return item.prompt.toLowerCase().includes(q) ||
                 item.styleId.toLowerCase().includes(q) ||
                 item.modelId.toLowerCase().includes(q);
        }
      });
    }

    // Sort order
    items.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

    return items;
  }, [generations, storyboards, activeFilter, searchQuery, sortOrder]);

  const totalCount = generations.length + storyboards.length;
  const videoCount = generations.filter(g => g.mediaType !== 'image').length;
  const imageCount = generations.filter(g => g.mediaType === 'image').length;
  const sbCount = storyboards.length;
  const favCount = generations.filter(g => g.isFavorite).length + storyboards.filter(s => s.isFavorite).length;

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Storage Warning if blocked */}
      <StorageBlockedBanner isBlocked={isStorageBlocked} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-cine-border">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              History
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-surface-raised text-text-muted border border-cine-border">
              {totalCount} Items
            </span>
          </div>
          <p className="text-sm text-text-muted mt-1">
            Saved library of single video shots and 3-shot storyboards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <PrototypeBadge variant="subtle" />
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-dark border border-cine-border shadow-md">
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search creations by prompt keywords, style look, or tags..."
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

        {/* Filter Chips & Sort */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
              activeFilter === 'all'
                ? 'bg-cine-amber/20 border-cine-amber text-cine-amber shadow-amber-sm'
                : 'bg-surface-raised/60 border-cine-border text-text-muted hover:text-text-primary'
            }`}
          >
            All ({totalCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('video')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border flex items-center gap-1.5 ${
              activeFilter === 'video'
                ? 'bg-cine-amber/20 border-cine-amber text-cine-amber shadow-amber-sm'
                : 'bg-surface-raised/60 border-cine-border text-text-muted hover:text-text-primary'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Video ({videoCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('image')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border flex items-center gap-1.5 ${
              activeFilter === 'image'
                ? 'bg-cine-amber/20 border-cine-amber text-cine-amber shadow-amber-sm'
                : 'bg-surface-raised/60 border-cine-border text-text-muted hover:text-text-primary'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Image ({imageCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('storyboard')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border flex items-center gap-1.5 ${
              activeFilter === 'storyboard'
                ? 'bg-cine-amber/20 border-cine-amber text-cine-amber shadow-amber-sm'
                : 'bg-surface-raised/60 border-cine-border text-text-muted hover:text-text-primary'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Storyboard ({sbCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('favorites')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border flex items-center gap-1.5 ${
              activeFilter === 'favorites'
                ? 'bg-cine-amber/20 border-cine-amber text-cine-amber shadow-amber-sm'
                : 'bg-surface-raised/60 border-cine-border text-text-muted hover:text-text-primary'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Favorites ({favCount})</span>
          </button>

          {/* Sort Order Toggle */}
          <button
            type="button"
            onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
            className="px-3 py-2 rounded-xl bg-surface-raised/60 hover:bg-surface-raised border border-cine-border text-text-muted hover:text-text-primary text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors"
            title={`Sort: ${sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}`}
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-cine-amber" />
            <span>{sortOrder === 'newest' ? 'Newest' : 'Oldest'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Creations */}
      {combinedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {combinedItems.map((item) => (
            <HistoryCard
              key={item.id}
              item={item}
              onSelect={setSelectedItem}
              onToggleFavorite={handleToggleFavorite}
              onDelete={handleDelete}
              onReusePrompt={handleReusePrompt}
            />
          ))}
        </div>
      ) : (
        /* Empty State with Clear Actions */
        <div className="p-8 sm:p-12 rounded-2xl bg-surface-dark border border-cine-border flex flex-col items-center justify-center text-center min-h-[380px] space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-surface-raised border border-cine-border flex items-center justify-center text-cine-amber shadow-amber-sm">
            <History className="w-8 h-8" />
          </div>

          {searchQuery || activeFilter !== 'all' ? (
            <div className="space-y-2 max-w-md">
              <h2 className="text-lg font-bold text-text-primary">No Matching Creations Found</h2>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                No items match your active search "{searchQuery}" or filter ({activeFilter}).
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                className="mt-3 px-4 py-2 rounded-xl bg-surface-raised hover:bg-surface-hover border border-cine-border text-xs font-bold text-cine-amber"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-2 max-w-md">
              <h2 className="text-lg font-bold text-text-primary">Your History is Empty</h2>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Generate a video in the Studio or plan a 3-shot sequence in Storyboard.
              </p>
              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create in Studio</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/storyboard')}
                  className="px-4 py-2.5 rounded-xl bg-surface-raised hover:bg-surface-hover border border-cine-border text-text-primary text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Layers className="w-4 h-4 text-accent" />
                  <span>Build Storyboard</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Accessible Detail Modal */}
      {selectedItem && (
        <HistoryDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onToggleFavorite={handleToggleFavorite}
          onDelete={handleDelete}
          onReusePrompt={handleReusePrompt}
        />
      )}

      {/* 5-Second Undo Toast */}
      {deletedRecord && (
        <UndoToast
          message={`Deleted ${deletedRecord.type === 'storyboard' ? '3-shot storyboard' : 'single shot'}.`}
          onUndo={handleUndo}
          onDismiss={() => setDeletedRecord(null)}
          durationMs={5000}
        />
      )}
    </div>
  );
};
