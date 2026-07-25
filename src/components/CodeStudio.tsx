import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Bug,
  Sparkles,
  Zap,
  Check,
  Copy,
  Terminal,
  FileCode2,
  ShieldCheck,
  TestTube,
} from 'lucide-react';

interface CodeStudioProps {
  onGenerateCodeAction: (
    prompt: string,
    systemInstruction: string
  ) => Promise<{ text: string; metrics?: any }>;
}

export const CodeStudio: React.FC<CodeStudioProps> = ({ onGenerateCodeAction }) => {
  const [sourceCode, setSourceCode] = useState(`// Exemple: Fonction de traitement de commande
async function processOrder(orderId, user) {
  let order = await db.orders.find(orderId);
  if (!order) return false;
  
  if (user.balance < order.total) {
    throw "Not enough money";
  }

  user.balance = user.balance - order.total;
  order.status = "PAID";
  
  await db.users.update(user);
  await db.orders.update(order);
  
  sendEmail(user.email, "Commande confirmée");
  return order;
}`);

  const [language, setLanguage] = useState('typescript');
  const [outputCode, setOutputCode] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const executeAction = async (actionType: 'refactor' | 'bugfix' | 'types' | 'tests' | 'explain') => {
    if (!sourceCode.trim()) return;
    setLoading(true);
    setOutputCode(null);
    setMetrics(null);

    let systemInst = 'Tu es Gemma 4 Code, expert en génie logiciel et sécurité.';
    let prompt = '';

    switch (actionType) {
      case 'refactor':
        systemInst += ' Ton rôle est de refactoriser le code pour le rendre moderne, performant, typé et propre.';
        prompt = `Refactorise ce code (${language}) pour suivre les meilleures pratiques modernes (gestion d'erreurs, typage, immutabilité):\n\n\`\`\`${language}\n${sourceCode}\n\`\`\``;
        break;
      case 'bugfix':
        systemInst += ' Ton rôle est de détecter les bugs, failles de sécurité, conditions de course et fuites de mémoire.';
        prompt = `Analyse ce code (${language}), identifie les risques/bugs et fournis une version corrigée et sécurisée:\n\n\`\`\`${language}\n${sourceCode}\n\`\`\``;
        break;
      case 'types':
        systemInst += ' Ton rôle est de convertir le code brut en TypeScript strict avec toutes les interfaces et types requis.';
        prompt = `Ajoute des types TypeScript stricts et des interfaces complètes pour ce code:\n\n\`\`\`${language}\n${sourceCode}\n\`\`\``;
        break;
      case 'tests':
        systemInst += ' Ton rôle est d\'écrire des tests unitaires complets avec Vitest/Jest couvrant les cas nominaux et d\'erreur.';
        prompt = `Écris une suite de tests unitaires (Vitest / Jest) pour ce code:\n\n\`\`\`${language}\n${sourceCode}\n\`\`\``;
        break;
      case 'explain':
        systemInst += ' Ton rôle est d\'expliquer de façon pédagogique le fonctionnement du code ligne par ligne.';
        prompt = `Explique en détail le fonctionnement et la logique de ce code:\n\n\`\`\`${language}\n${sourceCode}\n\`\`\``;
        break;
    }

    try {
      const res = await onGenerateCodeAction(prompt, systemInst);
      setOutputCode(res.text);
      setMetrics(res.metrics);
    } catch (err: any) {
      setOutputCode(`Erreur lors du traitement du code: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (outputCode) {
      navigator.clipboard.writeText(outputCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white h-[calc(100vh-61px)] font-sans transition-colors duration-200">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-purple-600 text-white dark:text-black font-black text-xs shadow-xs">
                G4
              </span>
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                Code <span className="text-purple-600 dark:text-purple-400">Studio.</span>
              </h2>
            </div>
            <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-white/40">
              Refactorisation, Typage Strict & Génération de Tests
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-white/50">
              Langage:
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-sm border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0a0a0a] px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white focus:outline-none cursor-pointer shadow-xs"
            >
              <option value="typescript" className="bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white">TypeScript / React</option>
              <option value="javascript" className="bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white">JavaScript</option>
              <option value="python" className="bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white">Python</option>
              <option value="sql" className="bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white">SQL</option>
              <option value="html" className="bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white">HTML / CSS / Tailwind</option>
            </select>
          </div>
        </div>

        {/* Action ToolBar */}
        <div className="flex flex-wrap gap-2 rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] p-3 shadow-xs">
          <button
            onClick={() => executeAction('refactor')}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-sm bg-purple-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-white dark:text-black hover:bg-purple-500 disabled:opacity-30 transition shadow-xs cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Refactoriser</span>
          </button>

          <button
            onClick={() => executeAction('bugfix')}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-sm border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-black disabled:opacity-30 transition cursor-pointer"
          >
            <Bug className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400" />
            <span>Détecter Bugs</span>
          </button>

          <button
            onClick={() => executeAction('types')}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-sm border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-black disabled:opacity-30 transition cursor-pointer"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span>Types TS</span>
          </button>

          <button
            onClick={() => executeAction('tests')}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-sm border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-black disabled:opacity-30 transition cursor-pointer"
          >
            <TestTube className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Tests Unitaires</span>
          </button>

          <button
            onClick={() => executeAction('explain')}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-sm border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-black disabled:opacity-30 transition cursor-pointer"
          >
            <FileCode2 className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>Explication</span>
          </button>
        </div>

        {/* Dual Editor Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Source Code Panel */}
          <div className="flex flex-col rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] overflow-hidden h-[500px] shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                  Code Source Input
                </span>
              </div>
              <button
                onClick={() => setSourceCode('')}
                className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-white/40 hover:text-rose-600 dark:hover:text-white transition cursor-pointer"
              >
                Vider
              </button>
            </div>
            <textarea
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              placeholder="Collez votre code ici..."
              className="flex-1 w-full p-4 font-mono text-xs text-slate-900 dark:text-white bg-slate-50 dark:bg-black focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* AI Output Panel */}
          <div className="flex flex-col rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] overflow-hidden h-[500px] shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                  Sortie Gemma 4
                </span>
                {metrics && (
                  <span className="flex items-center gap-1 rounded-xs bg-purple-50 dark:bg-white/5 px-2 py-0.5 font-mono text-[10px] text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-white/10 font-bold">
                    <Zap className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                    {metrics.latencyMs}ms
                  </span>
                )}
              </div>

              {outputCode && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-white/50 hover:text-purple-600 dark:hover:text-white transition cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                      <span className="text-purple-600 dark:text-purple-400">COPIÉ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>COPIER</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-black/40">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full space-y-3 text-purple-600 dark:text-purple-400 font-mono text-xs font-bold">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple-600 dark:border-purple-500 border-t-transparent" />
                  <span>Compilation et analyse par Gemma 4...</span>
                </div>
              ) : outputCode ? (
                <div className="markdown-body prose dark:prose-invert prose-sm max-w-none text-xs font-sans text-slate-800 dark:text-slate-100">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {outputCode}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-center font-mono text-xs text-slate-400 dark:text-white/30">
                  Sélectionnez une action ci-dessus pour exécuter l'analyse.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

