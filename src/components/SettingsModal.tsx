import React from 'react';
import { Cpu, MessageSquare, Eye, Code2, BookOpen, BarChart3, Info, User } from 'lucide-react';

interface SettingsModalProps {
  hasApiKey: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ hasApiKey }) => {
  const menuModules = [
    {
      name: 'Playground Chat',
      icon: MessageSquare,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      borderColor: 'border-blue-200 dark:border-blue-500/30',
      description:
        'Discussion IA interactive avec réponse en streaming continu (SSE), configuration des consignes système (System Prompt), ajustement fin de la température et envoi de fichiers d\'images.',
    },
    {
      name: 'Vision Lab',
      icon: Eye,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
      borderColor: 'border-purple-200 dark:border-purple-500/30',
      description:
        'Analyse multimodale d\'images : convertit des maquettes UI ou captures d\'écran directement en composants React & Tailwind CSS réutilisables, réalise une extraction de texte (OCR) et analyse des graphiques.',
    },
    {
      name: 'Code Studio',
      icon: Code2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
      borderColor: 'border-emerald-200 dark:border-emerald-500/30',
      description:
        'Génération et ingénierie de code de niveau production : refactorisation propre, détection automatique de bugs, typage TypeScript strict, génération de tests unitaires et explications détaillées.',
    },
    {
      name: 'Prompt Library',
      icon: BookOpen,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/30',
      borderColor: 'border-amber-200 dark:border-amber-500/30',
      description:
        'Bibliothèque complète de prompts optimisés (Prompt Engineering) classés en 6 catégories (Développement, Rédaction, Mathématiques, Vision, JSON, Traduction) chargeables en un clic.',
    },
    {
      name: 'Benchmark Lab',
      icon: BarChart3,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/30',
      borderColor: 'border-rose-200 dark:border-rose-500/30',
      description:
        'Banc de test comparatif mesurant les latences en millisecondes et la densité de caractères entre modèles Gemma 4, avec bascule automatique vers l\'inférence autonome locale en mode hors-ligne.',
    },
    {
      name: 'À Propos',
      icon: Info,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
      borderColor: 'border-indigo-200 dark:border-indigo-500/30',
      description:
        'Vue synthétique présentant la vision globale du projet ZoroG4, la documentation d\'architecture, les fonctionnalités clés et l\'attribution explicite au créateur JIMAN LULU Zoro.',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white h-[calc(100vh-61px)] font-sans transition-colors duration-200">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-purple-600 text-white font-black text-xs shadow-xs">
              G4
            </span>
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              Guide des <span className="text-purple-600 dark:text-purple-400">Modules & Informations.</span>
            </h2>
          </div>
          <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-white/40">
            ZoroG4 (gemma4) — Architecture, Créateur & Fonctionnalités
          </p>
        </div>

        {/* Owner & Project Information Panel */}
        <div className="rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] p-5 space-y-3 shadow-xs">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
            <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span>Informations Officieuses du Projet</span>
          </h3>
          <div className="rounded-sm border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black p-4 space-y-2.5 font-mono text-xs">
            <div className="flex justify-between border-b border-slate-200 dark:border-white/10 pb-2">
              <span className="text-slate-500 dark:text-white/50">Nom du Projet :</span>
              <span className="font-bold text-slate-900 dark:text-white">ZoroG4 (gemma4)</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-white/10 pb-2">
              <span className="text-slate-500 dark:text-white/50">Créateur & Propriétaire :</span>
              <span className="font-black text-purple-600 dark:text-purple-400">Créé par JIMAN LULU Zoro</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-white/10 pb-2">
              <span className="text-slate-500 dark:text-white/50">Génération de Code & UI :</span>
              <span className="font-bold text-slate-900 dark:text-white">React, Tailwind CSS, TypeScript, Tests Unitaires</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-white/50">Support Hors Ligne (Edge) :</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Actif (Moteur Fallback Local ZoroG4)</span>
            </div>
          </div>
        </div>

        {/* What Each Menu Does Panel */}
        <div className="rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] p-5 space-y-4 shadow-xs">
          <div className="border-b border-slate-200 dark:border-white/10 pb-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span>Détail des Fonctionnalités des Menus</span>
            </h3>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-white/50 font-sans">
              Voici ce que chaque module de l'application ZoroG4 permet d'accomplir et de créer :
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {menuModules.map((m, idx) => {
              const IconComp = m.icon;
              return (
                <div
                  key={idx}
                  className={`rounded-sm border ${m.borderColor} ${m.bgColor} p-4 space-y-2 transition-all`}
                >
                  <div className="flex items-center gap-2">
                    <IconComp className={`h-4 w-4 ${m.color}`} />
                    <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">
                      {m.name}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-white/70 leading-relaxed font-sans">
                    {m.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Architecture Specs */}
        <div className="rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] p-5 space-y-4 shadow-xs">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span>Moteurs & Modèles Gemma 4 Utilisés</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="rounded-sm border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black p-3.5 space-y-1">
              <p className="font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                ⚡ Gemma 4 Flash
              </p>
              <p className="text-slate-600 dark:text-white/60 font-sans">
                Inférence ultra-rapide optimisée pour les requêtes interactives en temps réel, le résumé de documents et la génération conversationnelle.
              </p>
            </div>

            <div className="rounded-sm border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black p-3.5 space-y-1">
              <p className="font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                🧠 Gemma 4 Pro
              </p>
              <p className="text-slate-600 dark:text-white/60 font-sans">
                Dédié aux tâches de raisonnement approfondi, de mathématiques, de logique complexe et d'analyse de code de grande envergure.
              </p>
            </div>

            <div className="rounded-sm border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black p-3.5 space-y-1">
              <p className="font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                👁️ Gemma 4 Vision
              </p>
              <p className="text-slate-600 dark:text-white/60 font-sans">
                Compréhension multimodale avancée pour l'analyse d'images, l'extraction OCR et la conversion de maquettes graphiques en React/Tailwind.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


