import React from 'react';
import {
  MessageSquare,
  Eye,
  Code2,
  BookOpen,
  BarChart3,
  Plus,
  Trash2,
  Cpu,
  Info,
  Sparkles,
} from 'lucide-react';
import { StudioTab, ChatConversation } from '../types';

interface SidebarProps {
  activeTab: StudioTab;
  onSelectTab: (tab: StudioTab) => void;
  conversations: ChatConversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}) => {
  const navItems = [
    {
      id: 'playground' as StudioTab,
      label: 'PLAYGROUND CHAT',
      icon: MessageSquare,
      badge: 'STREAM',
    },
    {
      id: 'vision' as StudioTab,
      label: 'VISION LAB',
      icon: Eye,
      badge: 'VISION',
    },
    {
      id: 'code' as StudioTab,
      label: 'CODE STUDIO',
      icon: Code2,
      badge: 'DEV',
    },
    {
      id: 'prompts' as StudioTab,
      label: 'PROMPTS LIB',
      icon: BookOpen,
      badge: 'PROMPTS',
    },
    {
      id: 'benchmark' as StudioTab,
      label: 'BENCHMARK',
      icon: BarChart3,
      badge: 'SPEED',
    },
    {
      id: 'about' as StudioTab,
      label: 'À PROPOS GEMMA 4',
      icon: Sparkles,
      badge: 'DOCS',
    },
    {
      id: 'settings' as StudioTab,
      label: 'PROFIL & INFO',
      icon: Info,
      badge: 'INFO',
    },
  ];

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#050505] text-slate-800 dark:text-white h-[calc(100vh-61px)] font-sans transition-colors duration-200">
      {/* Primary Action: New Chat Button */}
      <div className="p-3 border-b border-slate-200 dark:border-white/10">
        <button
          onClick={() => {
            onNewConversation();
            onSelectTab('playground');
          }}
          className="flex w-full items-center justify-center gap-2 rounded-sm bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white font-black text-xs uppercase tracking-wider py-2.5 px-4 shadow-md transition cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Nouveau Chat</span>
        </button>
      </div>

      {/* Studio Navigation Section */}
      <div className="p-4 border-b border-slate-200 dark:border-white/10">
        <p className="px-2 pb-3 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-white/40">
          // Espaces Gemma-4
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`group flex w-full items-center justify-between rounded-sm px-3 py-2 text-xs font-bold transition uppercase tracking-wider cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white dark:text-black shadow-md font-black'
                    : 'text-slate-700 dark:text-white/70 hover:bg-slate-200/70 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 transition ${
                      isActive ? 'text-white dark:text-black' : 'text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-white'
                    }`}
                  />
                  <span className="text-[11px]">{item.label}</span>
                </div>
                <span
                  className={`rounded-xs px-1.5 py-0.5 text-[8px] font-mono font-bold tracking-widest ${
                    isActive
                      ? 'bg-purple-900 text-purple-200 dark:bg-black dark:text-purple-400'
                      : 'bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-white/60'
                  }`}
                >
                  {item.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Conversations History */}
      <div className="flex flex-1 flex-col overflow-hidden p-4">
        <div className="mb-3 flex items-center justify-between px-1">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-white/40">
            // HISTORIQUE ({conversations.length})
          </p>
          <button
            onClick={onNewConversation}
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition cursor-pointer"
          >
            <Plus className="h-3 w-3" />
            <span>Nouveau</span>
          </button>
        </div>

        <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          {conversations.length === 0 ? (
            <div className="py-6 text-center text-xs font-mono text-slate-400 dark:text-white/30">
              Aucun historique
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = conv.id === activeConversationId && activeTab === 'playground';
              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    onSelectConversation(conv.id);
                    onSelectTab('playground');
                  }}
                  className={`group relative flex items-center justify-between rounded-sm p-2.5 text-xs transition cursor-pointer border ${
                    isActive
                      ? 'bg-purple-100 dark:bg-white/10 text-slate-900 dark:text-white border-purple-400 dark:border-purple-500/50 font-bold'
                      : 'text-slate-600 dark:text-white/60 border-transparent hover:bg-slate-200/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden pr-6">
                    <MessageSquare className="h-3.5 w-3.5 shrink-0 text-purple-600 dark:text-purple-400" />
                    <span className="truncate text-[11px]">{conv.title || 'Discussion sans titre'}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                    className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 dark:text-white/40 dark:hover:text-rose-400 transition"
                    title="Supprimer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer Specs Box */}
      <div className="m-4 rounded-sm border-l-2 border-purple-600 dark:border-purple-500 bg-slate-200/60 dark:bg-white/5 p-3.5 text-xs">
        <div className="flex items-center gap-2 font-black uppercase tracking-wider text-slate-900 dark:text-white">
          <Cpu className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <span>ZoroG4 • gemma4</span>
        </div>
        <p className="mt-1 text-[10px] font-mono leading-relaxed text-slate-600 dark:text-white/60 font-semibold">
          Créé par JIMAN LULU Zoro
        </p>
      </div>
    </aside>
  );
};

