import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Upload,
  Eye,
  FileCode,
  FileText,
  Sparkles,
  Zap,
  Copy,
  Check,
  HelpCircle,
} from 'lucide-react';

interface VisionLabProps {
  onAnalyzeImage: (
    prompt: string,
    imageBase64: string
  ) => Promise<{ text: string; metrics?: any }>;
}

export const VisionLab: React.FC<VisionLabProps> = ({ onAnalyzeImage }) => {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [resultText, setResultText] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const sampleImages = [
    {
      name: 'Schéma & Data',
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
      prompt: 'Analyse ce graphique de données et décris les tendances principales et anomalies observées.',
    },
    {
      name: 'UI Mockup',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      prompt: 'Convertis ce concept visuel en composant React fonctionnel structuré avec Tailwind CSS.',
    },
    {
      name: 'Document & OCR',
      url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80',
      prompt: 'Extrais l\'intégralité du texte lisible sur cette image et remets-le au propre en Markdown.',
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAnalysis = async (promptToUse?: string) => {
    if (!imageBase64) return;
    setLoading(true);
    setResultText(null);
    setMetrics(null);

    const activePrompt = promptToUse || customPrompt || 'Décris cette image en détail.';

    try {
      const res = await onAnalyzeImage(activePrompt, imageBase64);
      setResultText(res.text);
      setMetrics(res.metrics);
    } catch (err: any) {
      setResultText(`Erreur lors de l'analyse visuelle: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (resultText) {
      navigator.clipboard.writeText(resultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white h-[calc(100dvh-57px)] sm:h-[calc(100vh-61px)] font-sans transition-colors duration-200">
      <div className="mx-auto max-w-5xl space-y-4 sm:space-y-6">
        {/* Header Title */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-purple-600 text-white dark:text-black font-black text-xs shadow-xs">
                G4
              </span>
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                Vision <span className="text-purple-600 dark:text-purple-400">Lab.</span>
              </h2>
            </div>
            <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-white/40">
              Analyse Multimodale & Conversion Visuelle
            </p>
          </div>
        </div>

        {/* Upload & Sample Section */}
        <div className="grid gap-6 md:grid-cols-12">
          {/* Left Column: Image Upload Area */}
          <div className="md:col-span-5 space-y-4">
            <div className="relative flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-slate-300 dark:border-white/20 bg-white dark:bg-[#0a0a0a] p-6 text-center">
              {imageBase64 ? (
                <div className="space-y-3 w-full">
                  <img
                    src={imageBase64}
                    alt="Visuel sélectionné"
                    className="max-h-64 w-full rounded-sm object-contain bg-slate-100 dark:bg-black border border-slate-200 dark:border-white/10"
                  />
                  <div className="flex justify-center gap-2">
                    <label className="cursor-pointer rounded-sm bg-slate-200 dark:bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-white/20 transition">
                      Changer Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={() => setImageBase64(null)}
                      className="rounded-sm bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-500/40 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900 transition cursor-pointer"
                    >
                      Effacer
                    </button>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer space-y-3 py-6">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm bg-purple-600 text-white dark:text-black font-black shadow-xs">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      Téléverser une image
                    </p>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-white/40 mt-1">
                      PNG, JPG, WEBP (Max 10Mo)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Sample Image Presets */}
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-white/40 mb-2">
                // Exemples pré-chargés
              </p>
              <div className="grid grid-cols-3 gap-2">
                {sampleImages.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setImageBase64(sample.url);
                      setCustomPrompt(sample.prompt);
                    }}
                    className="group overflow-hidden rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] text-left transition hover:border-purple-500 cursor-pointer shadow-xs"
                  >
                    <img
                      src={sample.url}
                      alt={sample.name}
                      className="h-16 w-full object-cover group-hover:scale-105 transition duration-200"
                    />
                    <div className="p-2">
                      <p className="truncate text-[9px] font-black uppercase tracking-wider text-slate-800 dark:text-white/80">
                        {sample.name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Actions & Prompt Input */}
          <div className="md:col-span-7 space-y-4">
            <div className="rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] p-5 space-y-4 shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span>Modules d'Analyse</span>
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    handleRunAnalysis('Décris cette image avec précision et détaille tous les éléments majeurs.')
                  }
                  disabled={!imageBase64 || loading}
                  className="flex items-center gap-2 rounded-sm border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-3 text-left text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-black disabled:opacity-30 transition cursor-pointer"
                >
                  <Eye className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>Description</span>
                </button>

                <button
                  onClick={() =>
                    handleRunAnalysis('Extrais tout le texte présent sur cette image (OCR) sous forme de texte brut propre.')
                  }
                  disabled={!imageBase64 || loading}
                  className="flex items-center gap-2 rounded-sm border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-3 text-left text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-black disabled:opacity-30 transition cursor-pointer"
                >
                  <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>OCR Text</span>
                </button>

                <button
                  onClick={() =>
                    handleRunAnalysis('Convertis l\'interface ou le design visible sur l\'image en un composant React et Tailwind CSS prêt à l\'emploi.')
                  }
                  disabled={!imageBase64 || loading}
                  className="flex items-center gap-2 rounded-sm border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-3 text-left text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-black disabled:opacity-30 transition cursor-pointer"
                >
                  <FileCode className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>UI vers React</span>
                </button>

                <button
                  onClick={() =>
                    handleRunAnalysis('Analyse les problèmes, schémas ou données présentés et propose une résolution claire étape par étape.')
                  }
                  disabled={!imageBase64 || loading}
                  className="flex items-center gap-2 rounded-sm border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-3 text-left text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-black disabled:opacity-30 transition cursor-pointer"
                >
                  <HelpCircle className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>Résolution Schéma</span>
                </button>
              </div>

              {/* Custom Prompt Box */}
              <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-white/10">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/50">
                  Instruction Personnalisée Vision :
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Ex: Analyse les données du graphique..."
                    className="flex-1 rounded-sm border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-black px-3 py-2 text-xs font-sans text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-white/30"
                  />
                  <button
                    onClick={() => handleRunAnalysis()}
                    disabled={!imageBase64 || loading}
                    className="rounded-sm bg-purple-600 px-5 py-2 text-xs font-black uppercase tracking-widest text-white dark:text-black hover:bg-purple-500 disabled:opacity-30 transition shadow-xs cursor-pointer"
                  >
                    {loading ? 'Analyse...' : 'Lancer'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Output Results Area */}
        {(loading || resultText) && (
          <div className="rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-purple-600 text-white dark:text-black font-black text-xs">
                  G4
                </span>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                  Rapport Inférence Visuelle
                </h3>
                {metrics && (
                  <span className="flex items-center gap-1 rounded-xs bg-purple-50 dark:bg-white/5 px-2 py-0.5 font-mono text-[10px] text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-white/10 font-bold">
                    <Zap className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                    {metrics.latencyMs}ms
                  </span>
                )}
              </div>

              {resultText && (
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

            {loading ? (
              <div className="flex items-center justify-center py-12 space-x-3 text-purple-600 dark:text-purple-400 font-mono text-xs font-bold">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple-600 dark:border-purple-500 border-t-transparent" />
                <span>Analyse des vecteurs visuels en cours...</span>
              </div>
            ) : (
              <div className="markdown-body prose dark:prose-invert prose-sm max-w-none text-xs sm:text-sm font-sans text-slate-800 dark:text-slate-100">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {resultText || ''}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

