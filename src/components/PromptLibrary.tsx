import React, { useState } from 'react';
import {
  BookOpen,
  ArrowRight,
  Code2,
  FileText,
  Eye,
  FileJson,
  BrainCircuit,
  Languages,
  Check,
  Copy,
  Truck,
} from 'lucide-react';
import { PROMPT_PRESETS } from '../data/presets';
import { PromptPreset } from '../types';

interface PromptLibraryProps {
  onSelectPreset: (preset: PromptPreset) => void;
}

export const PromptLibrary: React.FC<PromptLibraryProps> = ({ onSelectPreset }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Tous les modèles' },
    { id: 'code', label: 'Code & Tech' },
    { id: 'writing', label: 'Rédaction & Synthèse' },
    { id: 'math', label: 'Raisonnement & Math' },
    { id: 'vision', label: 'Vision & OCR' },
    { id: 'structured', label: 'Données & Logistique' },
    { id: 'translation', label: 'Traduction' },
  ];

  const filteredPresets =
    activeCategory === 'all'
      ? PROMPT_PRESETS
      : PROMPT_PRESETS.filter((p) => p.category === activeCategory);

  const getCategoryIcon = (category: string, iconName?: string) => {
    if (iconName === 'Truck') return Truck;
    switch (category) {
      case 'code':
        return Code2;
      case 'writing':
        return FileText;
      case 'vision':
        return Eye;
      case 'structured':
        return FileJson;
      case 'math':
        return BrainCircuit;
      case 'translation':
        return Languages;
      default:
        return BookOpen;
    }
  };

  const handleCopy = (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white h-[calc(100vh-61px)] font-sans transition-colors duration-200">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Title */}
        <div className="border-b border-slate-200 dark:border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-purple-600 text-white dark:text-black font-black text-xs shadow-xs">
              G4
            </span>
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              Prompt <span className="text-purple-600 dark:text-purple-400">Library.</span>
            </h2>
          </div>
          <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-white/40">
            Presets & Modèles d'Ingénierie de Prompts Optimisés
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-sm px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider transition cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-purple-600 text-white dark:text-black shadow-xs'
                  : 'bg-white dark:bg-[#0a0a0a] text-slate-700 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Presets Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredPresets.map((preset) => {
            const IconComponent = getCategoryIcon(preset.category, preset.iconName);
            return (
              <div
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className="group relative flex flex-col justify-between rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] p-5 transition hover:border-purple-500 cursor-pointer shadow-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-purple-100 dark:bg-purple-600/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                          {preset.title}
                        </h3>
                        <span className="inline-block rounded-xs bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-1.5 py-0.5 text-[9px] font-mono uppercase text-slate-500 dark:text-white/50">
                          {preset.suggestedModel}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleCopy(preset.defaultPrompt, preset.id, e)}
                      className="rounded-sm p-1.5 text-slate-400 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-purple-600 dark:hover:text-white transition cursor-pointer"
                      title="Copier le prompt"
                    >
                      {copiedId === preset.id ? (
                        <Check className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 dark:text-white/60 leading-relaxed font-sans">
                    {preset.description}
                  </p>

                  <div className="mt-3 rounded-sm bg-slate-50 dark:bg-black p-2.5 border border-slate-200 dark:border-white/10">
                    <p className="line-clamp-2 font-mono text-[10px] text-slate-700 dark:text-white/70">
                      "{preset.defaultPrompt}"
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-white/10 pt-3">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 dark:text-white/40">
                    Temp: {preset.temperature}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition">
                    <span>Ouvrir dans Chat</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

