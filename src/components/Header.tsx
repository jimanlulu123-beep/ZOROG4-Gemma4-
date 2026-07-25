import React from 'react';
import { Zap, Sparkles, Plus, ShieldCheck, Sun, Moon, Menu } from 'lucide-react';
import { Gemma4Model, AppTheme } from '../types';

interface HeaderProps {
  currentModel: Gemma4Model;
  onModelChange: (model: Gemma4Model) => void;
  onNewChat: () => void;
  hasApiKey: boolean;
  theme: AppTheme;
  onToggleTheme: () => void;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentModel,
  onModelChange,
  onNewChat,
  hasApiKey,
  theme,
  onToggleTheme,
  onOpenMobileMenu,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#050505]/95 backdrop-blur-md px-3 sm:px-5 py-2.5 sm:py-3.5 transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-4">
        {/* Left: Hamburger button (mobile) + Brand */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          {/* Mobile Drawer Trigger */}
          <button
            onClick={onOpenMobileMenu}
            className="flex md:hidden h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition cursor-pointer"
            title="Ouvrir le menu"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo & Brand Name */}
          <div className="flex items-center gap-2">
            <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-sm bg-purple-600 text-white dark:text-black font-black text-xs shadow-lg shadow-purple-600/30">
              G4
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-purple-400"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-sm sm:text-base font-black tracking-tighter uppercase text-slate-900 dark:text-white">
                  Zoro<span className="text-purple-600 dark:text-purple-400">G4</span>
                </h1>
                <span className="hidden xs:inline-block rounded-sm bg-purple-600 text-white dark:text-black px-1.5 py-0.5 text-[8px] sm:text-[9px] font-black uppercase tracking-widest">
                  gemma4
                </span>
              </div>
              <p className="hidden md:block text-[10px] font-mono uppercase tracking-[0.15em] text-slate-500 dark:text-white/40">
                Créé par JIMAN LULU Zoro
              </p>
            </div>
          </div>
        </div>

        {/* Center: Model Selector */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center rounded-sm bg-slate-100 dark:bg-white/5 px-2 py-1 border border-slate-200 dark:border-white/10 focus-within:border-purple-500 transition max-w-[150px] xs:max-w-[180px] sm:max-w-none">
            <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 mr-1 shrink-0" />
            <select
              value={currentModel}
              onChange={(e) => onModelChange(e.target.value as Gemma4Model)}
              className="bg-transparent py-0.5 text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase text-slate-800 dark:text-white focus:outline-none cursor-pointer truncate w-full"
            >
              <option value="gemma-4-flash" className="bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white">
                ⚡ Gemma 4 Flash
              </option>
              <option value="gemma-4-pro" className="bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white">
                🧠 Gemma 4 Pro
              </option>
              <option value="gemma-4-code" className="bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white">
                💻 Gemma 4 Code
              </option>
              <option value="gemma-4-vision" className="bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white">
                👁️ Gemma 4 Vision
              </option>
              <option value="gemma-4-instruct" className="bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white">
                🎯 Gemma 4 Instruct
              </option>
            </select>
          </div>
        </div>

        {/* Right Actions: Theme Switcher & New Chat */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Theme Switcher Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="flex h-8 sm:h-9 items-center justify-center gap-1.5 rounded-sm bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 border border-slate-200 dark:border-white/10 px-2 sm:px-2.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-white transition cursor-pointer"
            title={`Basculer en mode ${theme === 'dark' ? 'Clair' : 'Sombre'}`}
            aria-label="Basculer le thème"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden md:inline">Clair</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-purple-600" />
                <span className="hidden md:inline">Sombre</span>
              </>
            )}
          </button>

          {hasApiKey ? (
            <div className="hidden lg:flex items-center gap-1.5 rounded-sm bg-purple-100 dark:bg-purple-950/50 px-2.5 py-1 border border-purple-300 dark:border-purple-500/40 text-[10px] font-mono uppercase tracking-widest font-bold text-purple-700 dark:text-purple-300">
              <ShieldCheck className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              <span>API: Active</span>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-1.5 rounded-sm bg-slate-100 dark:bg-white/5 px-2.5 py-1 border border-slate-200 dark:border-white/10 text-[10px] font-mono uppercase tracking-widest font-bold text-slate-500 dark:text-white/50">
              <Zap className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              <span>Demo Mode</span>
            </div>
          )}

          <button
            onClick={onNewChat}
            className="flex h-8 sm:h-9 items-center justify-center gap-1.5 rounded-sm bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white dark:bg-white dark:hover:bg-purple-200 dark:text-black px-2.5 sm:px-3.5 text-[10px] font-black uppercase tracking-[0.1em] transition shadow-sm cursor-pointer"
            title="Nouvelle conversation"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span className="hidden sm:inline">Nouveau Chat</span>
          </button>
        </div>
      </div>
    </header>
  );
};

