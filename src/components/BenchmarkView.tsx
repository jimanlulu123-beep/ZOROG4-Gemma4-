import React, { useState } from 'react';
import { BarChart3, Play, CheckCircle2, XCircle, Clock, Cpu } from 'lucide-react';
import { BenchmarkItem } from '../types';

export const BenchmarkView: React.FC = () => {
  const [testPrompt, setTestPrompt] = useState(
    'Explique la différence entre le calcul distribué et l\'inférence d\'IA en 3 paragraphes concis.'
  );
  const [results, setResults] = useState<BenchmarkItem[]>([]);
  const [running, setRunning] = useState(false);

  const samplePrompts = [
    'Explique la différence entre le calcul distribué et l\'inférence d\'IA en 3 paragraphes concis.',
    'Écris une fonction Python récursive pour calculer la suite de Fibonacci avec mémoïsation.',
    'Quels sont les 5 principes fondateurs de l\'architecture logicielle propre (Clean Code) ?',
  ];

  const handleRunBenchmark = async () => {
    if (!testPrompt.trim() || running) return;
    setRunning(true);
    setResults([
      { alias: 'gemma-4-flash', modelUsed: 'gemini-3.6-flash', latencyMs: 0, status: 'pending' },
      { alias: 'gemma-4-pro', modelUsed: 'gemini-3.1-pro-preview', latencyMs: 0, status: 'pending' },
    ]);

    try {
      const response = await fetch('/api/gemma/benchmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: testPrompt }),
      });

      const data = await response.json();
      if (data.results) {
        setResults(data.results);
      }
    } catch (err: any) {
      console.error('Benchmark Error:', err);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white h-[calc(100vh-61px)] font-sans transition-colors duration-200">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header Title */}
        <div className="border-b border-slate-200 dark:border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-purple-600 text-white dark:text-black font-black text-xs shadow-xs">
              G4
            </span>
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              Benchmark <span className="text-purple-600 dark:text-purple-400">Lab.</span>
            </h2>
          </div>
          <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-white/40">
            Comparatif Latence & Vitesse Inférence Flash vs Pro
          </p>
        </div>

        {/* Test Prompt Input Box */}
        <div className="rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] p-5 space-y-4 shadow-xs">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/50">
            Prompt de Test pour le Benchmark :
          </label>
          <div className="space-y-3">
            <textarea
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              rows={2}
              className="w-full rounded-sm border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-black p-3 text-xs font-sans text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-white/30"
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1">
                {samplePrompts.map((promptText, i) => (
                  <button
                    key={i}
                    onClick={() => setTestPrompt(promptText)}
                    className="rounded-sm bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2.5 py-1 text-[10px] font-mono font-bold uppercase text-slate-700 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-white/10 transition cursor-pointer"
                  >
                    Exemple #{i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={handleRunBenchmark}
                disabled={running || !testPrompt.trim()}
                className="flex items-center gap-2 rounded-sm bg-purple-600 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white dark:text-black hover:bg-purple-500 disabled:opacity-30 transition shadow-xs cursor-pointer"
              >
                {running ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white dark:border-black border-t-transparent" />
                    <span>Calcul du benchmark...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-white dark:fill-black" />
                    <span>Lancer le Test Comparatif</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Benchmark Results Side-by-Side */}
        <div className="grid gap-6 md:grid-cols-2">
          {results.length === 0 ? (
            <div className="md:col-span-2 py-12 text-center rounded-sm border border-dashed border-slate-300 dark:border-white/15 bg-white dark:bg-[#0a0a0a] p-8">
              <Clock className="mx-auto h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />
              <p className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-white/50">
                Cliquez sur "Lancer le Test Comparatif" pour exécuter les requêtes en parallèle.
              </p>
            </div>
          ) : (
            results.map((item, idx) => (
              <div
                key={idx}
                className="rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] p-5 space-y-4 shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                      {item.alias}
                    </h3>
                  </div>

                  {item.status === 'pending' && (
                    <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase text-amber-600 dark:text-amber-400">
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
                      En cours...
                    </span>
                  )}

                  {item.status === 'success' && (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase text-purple-600 dark:text-purple-400">
                      <CheckCircle2 className="h-4 w-4" />
                      Succès
                    </span>
                  )}

                  {item.status === 'failed' && (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase text-rose-600 dark:text-rose-400">
                      <XCircle className="h-4 w-4" />
                      Échec
                    </span>
                  )}
                </div>

                {item.status === 'success' && (
                  <div className="grid grid-cols-2 gap-3 rounded-sm bg-slate-50 dark:bg-black p-3 border border-slate-200 dark:border-white/10">
                    <div>
                      <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-white/40">
                        Temps Réponse
                      </p>
                      <p className="mt-0.5 text-lg font-black text-purple-600 dark:text-purple-400 font-mono">
                        {item.latencyMs} ms
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-white/40">
                        Caractères
                      </p>
                      <p className="mt-0.5 text-lg font-black text-slate-900 dark:text-white font-mono">
                        {item.length} chars
                      </p>
                    </div>
                  </div>
                )}

                {item.preview && (
                  <div className="space-y-1">
                    <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-white/40">
                      Aperçu de la réponse :
                    </p>
                    <p className="text-xs text-slate-700 dark:text-white/70 line-clamp-4 leading-relaxed font-mono bg-slate-50 dark:bg-black p-3 rounded-sm border border-slate-200 dark:border-white/10">
                      {item.preview}
                    </p>
                  </div>
                )}

                {item.error && (
                  <p className="text-xs font-mono text-rose-700 dark:text-rose-300 p-3 rounded-sm bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30">
                    {item.error}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

