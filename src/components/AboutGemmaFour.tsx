import React, { useState } from 'react';
import {
  Sparkles,
  Cpu,
  Zap,
  Eye,
  Code2,
  BookOpen,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Layers,
  MessageSquare,
  HelpCircle,
  Terminal,
  Sun,
  Moon,
  ArrowRight,
} from 'lucide-react';

export const AboutGemmaFour: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'models' | 'features' | 'architecture'>('overview');

  const modelsList = [
    {
      alias: '⚡ Gemma 4 Flash',
      name: 'gemma-4-flash',
      role: 'Inférence Ultra-Rapide & Streaming',
      badge: 'Vitesse & Temps Réel',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      description:
        "Conçu pour répondre en une fraction de seconde avec une latence quasi-nulle. Gemma 4 Flash excelle dans les discussions interactives, le streaming Server-Sent Events (SSE), les résumés instantanés et le traitement rapide de longs contextes textuels.",
      highlights: [
        'Réponse instantanée à faible latence (~300ms)',
        'Support natif du streaming en temps réel',
        'Optimisé pour l’expérience utilisateur conversationnelle',
      ],
    },
    {
      alias: '🧠 Gemma 4 Pro',
      name: 'gemma-4-pro',
      role: 'Raisonnement Approfondi & Logique',
      badge: 'Haute Capacité',
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
      description:
        "Le modèle phare pour les problèmes complexes exigeant une réflexion étape par étape. Idéal pour la résolution d'équations mathématiques, la logique formelle, la prise de décision stratégique et l'analyse de documents denses.",
      highlights: [
        'Raisonnement multi-étapes sophistiqué',
        'Excellente précision scientifique et mathématique',
        'Résolution de problèmes complexes et denses',
      ],
    },
    {
      alias: '💻 Gemma 4 Code',
      name: 'gemma-4-code',
      role: 'Génie Logiciel & Architecture',
      badge: 'Spécialisé Dev',
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
      description:
        "Entraîné sur des milliards de lignes de code informatique dans plus de 30 langages de programmation. Il prend en charge le refactoring, la détection de bugs critiques, l'inférence de types TypeScript stricts et la génération de tests unitaires.",
      highlights: [
        'Analyse de syntaxe et refactorisation propre',
        'Correction de bugs et failles de sécurité',
        'Génération automatique de tests (Jest / Vitest / PyTest)',
      ],
    },
    {
      alias: '👁️ Gemma 4 Vision',
      name: 'gemma-4-vision',
      role: 'Analyse Multimodale & OCR',
      badge: 'Image vers Code',
      badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
      description:
        "Permet l'analyse combinée de texte et d'images. Capable d’interpréter des schémas d'architecture, d'extraire le texte manuscrit ou imprimé (OCR) et de convertir des maquettes UI/UX en composants React et Tailwind CSS prêts à l’emploi.",
      highlights: [
        'Conversion directe de maquettes visuelles en React/Tailwind',
        'Reconnaissance optique de caractères (OCR) haute fidélité',
        'Explication de graphiques, tableaux et schémas',
      ],
    },
    {
      alias: '🎯 Gemma 4 Instruct',
      name: 'gemma-4-instruct',
      role: 'Alignement & Directives Complexes',
      badge: 'Formatage Structuré',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      description:
        "Ajusté avec précision pour suivre des consignes système explicites (System Instructions). Il garantit le respect des contraintes de formatage JSON, de traduction fidèle et de schémas de réponse personnalisés.",
      highlights: [
        'Formatage JSON strict sans dérive',
        'Respect rigoureux du rôle et du contexte imposés',
        'Parfait pour les intégrations API automatisées',
      ],
    },
  ];

  const featuresList = [
    {
      title: '1. Chat & Assistant Virtuel (Streaming SSE)',
      icon: MessageSquare,
      summary:
        "Génère du texte, des explications, des rédactions et des analyses en temps réel avec streaming continu (SSE). Permet la personnalisation des consignes système (System Instructions), la gestion de la température d'inférence et l'analyse d'images jointes.",
    },
    {
      title: '2. Vision Lab — Image vers Code & OCR',
      icon: Eye,
      summary:
        "Transforme n'importe quelle capture d'écran ou maquette UI en composant React & Tailwind CSS prêt à l'emploi. Réalise de l'extraction de texte (OCR), de la description multimodale et l'analyse de graphiques complexes.",
    },
    {
      title: '3. Code Studio — Refactoring & Tests Unitaires',
      icon: Code2,
      summary:
        "Crée du code TypeScript/Python propre, refactorise les fonctions existantes, génère des suites de tests unitaires (Jest/Vitest), applique un typage strict et détecte automatiquement les failles de sécurité.",
    },
    {
      title: '4. Prompt Library & Ingenierie',
      icon: BookOpen,
      summary:
        "Génère et propose une bibliothèque complète de prompts pré-ingéniérés (Prompt Engineering) dans 6 domaines (Développement, Rédaction, Mathématiques, Multimodal, Structuration JSON, Traduction) directement injectables dans l'assistant.",
    },
    {
      title: '5. Benchmark Lab & Inférence Local Edge',
      icon: BarChart3,
      summary:
        "Calcule et compare les latences en millisecondes et la vitesse de génération entre les déclinaisons Gemma 4. En cas de coupure réseau, bascule automatiquement sur le moteur autonome local ZoroG4 Offline.",
    },
    {
      title: '6. Mode Thème Clair / Sombre Responsive',
      icon: Sun,
      summary:
        "Permet de basculer instantanément entre un thème clair lumineux et un thème sombre haute lisibilité. Tout le contenu et les fonctionnalités s'adaptent de façon fluide.",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white h-[calc(100vh-61px)] font-sans transition-colors duration-200">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Banner Header */}
        <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600 text-white font-black text-lg shadow-md shadow-purple-600/30">
                G4
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                    Zoro<span className="text-purple-600 dark:text-purple-400">G4</span> <span className="text-xs text-slate-400 dark:text-white/40 font-mono">(gemma4)</span>
                  </h1>
                  <span className="rounded bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/40 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">
                    Projet Officiel
                  </span>
                </div>
                <p className="mt-1 text-xs font-mono uppercase tracking-[0.15em] text-purple-700 dark:text-purple-300 font-bold">
                  Créé par JIMAN LULU Zoro — Studio IA Gemma 4
                </p>
              </div>
            </div>

            {/* Navigation Pills */}
            <div className="flex flex-wrap gap-1.5 rounded-lg bg-slate-100 dark:bg-white/5 p-1 border border-slate-200 dark:border-white/10">
              <button
                onClick={() => setActiveSection('overview')}
                className={`rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                  activeSection === 'overview'
                    ? 'bg-purple-600 text-white dark:text-black font-black shadow-xs'
                    : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Vue globale
              </button>
              <button
                onClick={() => setActiveSection('models')}
                className={`rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                  activeSection === 'models'
                    ? 'bg-purple-600 text-white dark:text-black font-black shadow-xs'
                    : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Modèles (5)
              </button>
              <button
                onClick={() => setActiveSection('features')}
                className={`rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                  activeSection === 'features'
                    ? 'bg-purple-600 text-white dark:text-black font-black shadow-xs'
                    : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Ce qu'il crée (5)
              </button>
              <button
                onClick={() => setActiveSection('architecture')}
                className={`rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                  activeSection === 'architecture'
                    ? 'bg-purple-600 text-white dark:text-black font-black shadow-xs'
                    : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Architecture
              </button>
            </div>
          </div>

          <p className="text-sm text-slate-700 dark:text-white/80 leading-relaxed font-sans">
            <strong>ZoroG4 (gemma4)</strong>, conçu et développé par <strong>JIMAN LULU Zoro</strong>, est une plateforme complète d'intelligence artificielle alimentée par la famille de modèles ouverts <strong>Gemma 4 de Google DeepMind</strong>. Elle réunit au même endroit la génération de texte en temps réel, le refactoring et typage de code, la conversion de maquettes visuelles en composants React/Tailwind, une bibliothèque de prompts optimisés et un banc de test de performance.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] p-4 text-center">
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-white/40">
              ACCÉLÉRATION
            </p>
            <p className="mt-1 text-lg font-black text-purple-600 dark:text-purple-400 font-mono">
              TPU v5p
            </p>
            <p className="text-[10px] text-slate-600 dark:text-white/50 mt-0.5">Google Cloud Infra</p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] p-4 text-center">
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-white/40">
              LATENCE STREAMING
            </p>
            <p className="mt-1 text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
              ~250 - 400 ms
            </p>
            <p className="text-[10px] text-slate-600 dark:text-white/50 mt-0.5">SSE Chunk Stream</p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] p-4 text-center">
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-white/40">
              MODÈLES DISPONIBLES
            </p>
            <p className="mt-1 text-lg font-black text-blue-600 dark:text-blue-400 font-mono">
              5 Variantes
            </p>
            <p className="text-[10px] text-slate-600 dark:text-white/50 mt-0.5">Flash, Pro, Code, Vision...</p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] p-4 text-center">
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-white/40">
              SÉCURITÉ CLÉ API
            </p>
            <p className="mt-1 text-lg font-black text-purple-600 dark:text-purple-400 font-mono">
              100% Server Proxy
            </p>
            <p className="text-[10px] text-slate-600 dark:text-white/50 mt-0.5">Zéro fuite client</p>
          </div>
        </div>

        {/* Section 1: Overview */}
        {(activeSection === 'overview' || activeSection === 'features') && (
          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Ce Que Fait Cette Application (Fonctionnalités Détaillées)
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {featuresList.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={idx}
                    className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/50 p-4 space-y-2 hover:border-purple-500 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 font-bold border border-purple-200 dark:border-purple-500/30">
                        <IconComp className="h-4 w-4" />
                      </div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-white/70 leading-relaxed font-sans">
                      {item.summary}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 2: Models Detail */}
        {(activeSection === 'overview' || activeSection === 'models') && (
          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
              <Cpu className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Détail des 5 Modèles Gemma 4
              </h2>
            </div>

            <div className="space-y-4">
              {modelsList.map((m, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/40 p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-black uppercase tracking-wide text-slate-900 dark:text-white">
                        {m.alias}
                      </h3>
                      <span className="font-mono text-[10px] text-slate-500 dark:text-white/40">
                        ({m.name})
                      </span>
                    </div>
                    <span className={`rounded border px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${m.badgeColor}`}>
                      {m.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-white/80 leading-relaxed font-sans">
                    {m.description}
                  </p>

                  <div className="pt-1">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-white/40 mb-1.5">
                      Points Forts & Usages Recommandés :
                    </p>
                    <ul className="grid gap-1.5 sm:grid-cols-3">
                      {m.highlights.map((h, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700 dark:text-white/70"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Architecture & Security */}
        {(activeSection === 'overview' || activeSection === 'architecture') && (
          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
              <ShieldCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Architecture Technique & Sécurité des Données
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/40 p-4 space-y-2">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase">
                  <Terminal className="h-4 w-4" />
                  <span>1. Serveur Backend Proxy (Express + Node.js)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-white/70 leading-relaxed">
                  Toutes les requêtes d'inférence passent par des routes d'API sécurisées (<code className="font-mono text-purple-600 dark:text-purple-400">/api/gemma/stream</code> et <code className="font-mono text-purple-600 dark:text-purple-400">/api/gemma/generate</code>). La clé API reste strictement confinée sur le serveur Cloud Run et n'est jamais transmise au navigateur client.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/40 p-4 space-y-2">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase">
                  <Zap className="h-4 w-4" />
                  <span>2. Streaming Continuous SSE</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-white/70 leading-relaxed">
                  L'interface utilise le protocole Server-Sent Events (SSE) pour afficher les jetons générés mot par mot en temps réel, offrant un confort de lecture fluide sans attendre la réponse complète du serveur.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/40 p-4 space-y-2">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase">
                  <Layers className="h-4 w-4" />
                  <span>3. Stockage Local Sécurisé (localStorage)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-white/70 leading-relaxed">
                  Vos discussions, paramètres de modèle et préférences de thème (sombre/clair) sont enregistrés localement dans votre navigateur pour préserver la confidentialité de vos données et retrouver votre session instantanément.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/40 p-4 space-y-2">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase">
                  <Sun className="h-4 w-4" />
                  <span>4. Système de Thème Double (Light / Dark)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-white/70 leading-relaxed">
                  Conçu avec Tailwind CSS selon une grille typographique stricte, garantissant un contraste élevé aussi bien en thème clair minimaliste qu'en thème sombre haute précision.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
