import React, { useState } from 'react';
import { Sparkles, Shuffle, X } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { DEFAULT_PROMPTS } from '../../data/defaultPrompts';
import { STYLE_PRESETS } from '../../data/presets';
import { enhancePromptLocally } from '../../services/promptEnhancer';

const MAX_CHARS = 600;

export const PromptBox: React.FC<{ onGenerate: () => void; isGenerating: boolean }> = ({ onGenerate, isGenerating }) => {
  const { draft, updateDraft } = useStudio();
  const [isEnhancing, setIsEnhancing] = useState(false);

  const charCount = draft.prompt.length;
  const isOverLimit = charCount > MAX_CHARS;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (draft.prompt.trim() && !isGenerating && !isOverLimit) {
        onGenerate();
      }
    }
  };

  const handleSurpriseMe = () => {
    const random = DEFAULT_PROMPTS[Math.floor(Math.random() * DEFAULT_PROMPTS.length)];
    updateDraft({
      prompt: random.prompt,
      styleId: random.styleId,
    });
  };

  const handleEnhance = () => {
    if (!draft.prompt.trim()) return;
    setIsEnhancing(true);
    const currentStyle = STYLE_PRESETS.find(s => s.id === draft.styleId);
    const enhanced = enhancePromptLocally(draft.prompt, currentStyle);

    setTimeout(() => {
      updateDraft({ prompt: enhanced.slice(0, MAX_CHARS) });
      setIsEnhancing(false);
    }, 200);
  };

  return (
    <div className="space-y-3">
      {/* Label and Helper Shortcuts */}
      <div className="flex items-center justify-between">
        <label htmlFor="prompt-input" className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <span>Creative Prompt</span>
          <span className="text-[11px] font-normal text-text-dim hidden sm:inline">
            (Describe scenes, lighting, mood, subjects)
          </span>
        </label>
        <span className="text-xs text-text-dim flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-surface-raised border border-cine-border text-[10px] text-text-muted font-mono">
            ⌘/Ctrl + Enter
          </kbd>
          <span className="hidden sm:inline">to render</span>
        </span>
      </div>

      {/* Main Textarea Container */}
      <div className="relative rounded-2xl bg-surface-dark border border-cine-border focus-within:border-cine-amber focus-within:ring-1 focus-within:ring-cine-amber transition-all shadow-inner">
        <textarea
          id="prompt-input"
          value={draft.prompt}
          onChange={e => updateDraft({ prompt: e.target.value })}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Rain-slicked cyber-city alleyway with amber neon reflections, an operative in a trenchcoat walking past holographic signs..."
          rows={4}
          className="w-full bg-transparent p-4 pb-12 text-sm sm:text-base text-text-primary placeholder:text-text-dim focus:outline-none resize-none leading-relaxed"
          maxLength={MAX_CHARS + 50}
          aria-label="Generation Prompt"
        />

        {/* Bottom Toolbar inside Textarea */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between gap-2 pt-1 border-t border-cine-border/40">
          <div className="flex items-center gap-1.5">
            {/* Improve My Prompt */}
            <button
              type="button"
              onClick={handleEnhance}
              disabled={!draft.prompt.trim() || isEnhancing}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-cine-amber bg-cine-amber/10 hover:bg-cine-amber/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all min-h-[32px]"
              title="Enhance prompt with cinematic lighting, camera lens and atmosphere"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
              <span>Improve my prompt</span>
            </button>

            {/* Surprise Me (Randomize) */}
            <button
              type="button"
              onClick={handleSurpriseMe}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-text-muted bg-surface-raised hover:text-text-primary hover:bg-surface-hover transition-colors min-h-[32px]"
              title="Insert a sample cinematic scene"
            >
              <Shuffle className="w-3.5 h-3.5 text-text-dim" />
              <span className="hidden sm:inline">Surprise Me</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {draft.prompt && (
              <button
                type="button"
                onClick={() => updateDraft({ prompt: '' })}
                className="p-1 rounded text-text-dim hover:text-text-primary transition-colors"
                title="Clear prompt"
                aria-label="Clear prompt"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <span
              className={`text-xs font-mono tabular-nums ${
                isOverLimit ? 'text-status-danger font-semibold' : 'text-text-dim'
              }`}
            >
              {charCount} / {MAX_CHARS}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
