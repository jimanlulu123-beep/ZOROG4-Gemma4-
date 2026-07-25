import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Send,
  Sliders,
  Sparkles,
  Paperclip,
  X,
  Copy,
  Check,
  Bot,
  User,
  Zap,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
} from 'lucide-react';
import { ChatConversation, Gemma4Model } from '../types';

interface ChatPlaygroundProps {
  conversation: ChatConversation;
  onSendMessage: (
    prompt: string,
    imageBase64?: string,
    customSystemInstruction?: string,
    temp?: number,
    topPVal?: number
  ) => Promise<void>;
  onClearMessages: () => void;
  onNewChat?: () => void;
  currentModel: Gemma4Model;
  onModelChange: (model: Gemma4Model) => void;
  isLoading: boolean;
}

export const ChatPlayground: React.FC<ChatPlaygroundProps> = ({
  conversation,
  onSendMessage,
  onClearMessages,
  onNewChat,
  currentModel,
  isLoading,
}) => {
  const [prompt, setPrompt] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [systemInstruction, setSystemInstruction] = useState(
    conversation?.systemInstruction || ''
  );
  const [temperature, setTemperature] = useState(conversation?.temperature || 0.7);
  const [topP, setTopP] = useState(conversation?.topP || 0.95);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSystemInstruction(conversation?.systemInstruction || '');
    setTemperature(conversation?.temperature || 0.7);
    setTopP(conversation?.topP || 0.95);
    setPrompt('');
    setSelectedImage(null);
  }, [conversation?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages, isLoading]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!prompt.trim() && !selectedImage) || isLoading) return;

    const currentPrompt = prompt;
    const currentImg = selectedImage || undefined;

    setPrompt('');
    setSelectedImage(null);

    await onSendMessage(
      currentPrompt,
      currentImg,
      systemInstruction,
      temperature,
      topP
    );
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    { label: '🧠 Expliquer un concept', text: 'Explique le fonctionnement des réseaux de neurones de manière simple et intuitive.' },
    { label: '💻 Générer du code React', text: 'Écris un composant React TypeScript moderne pour une carte de produit e-commerce avec Tailwind CSS.' },
    { label: '📝 Résumer un sujet', text: 'Quels sont les principes clés de l\'ingénierie de prompts pour maximiser les résultats des LLM ?' },
    { label: '🌐 Traduire en Anglais', text: 'Traduis ce paragraphe dans un anglais professionnel fluide : "Gemma 4 apporte des performances exceptionnelles sur mobile et serveur."' },
  ];

  return (
    <div className="flex flex-1 flex-col h-[calc(100dvh-57px)] sm:h-[calc(100vh-61px)] bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white transition-colors duration-200 overflow-hidden">
      {/* Parameter Controls Accordion & Actions */}
      <div className="border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] px-3 sm:px-5 py-2 sm:py-2.5 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="flex flex-1 items-center justify-between text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition cursor-pointer min-w-[200px]"
        >
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span className="truncate text-[11px] sm:text-xs">Paramètres & Instruction</span>
            <span className="hidden md:inline-block rounded-sm bg-slate-100 dark:bg-white/5 px-2 py-0.5 text-[10px] font-mono font-bold text-purple-700 dark:text-purple-300 border border-slate-200 dark:border-white/10">
              Temp: {temperature} | TopP: {topP}
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 dark:text-white/40">
            {showConfig ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {onNewChat && (
            <button
              onClick={onNewChat}
              className="flex items-center gap-1.5 rounded-sm bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-500 dark:hover:bg-purple-600 dark:text-black px-2.5 sm:px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition shadow-xs cursor-pointer min-h-[36px]"
              title="Nouvelle conversation"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Nouveau Chat</span>
            </button>
          )}
          {conversation?.messages?.length > 0 && (
            <button
              onClick={onClearMessages}
              className="flex items-center gap-1.5 rounded-sm bg-slate-100 dark:bg-white/5 hover:bg-rose-100 dark:hover:bg-rose-950/50 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-white/10 px-2 sm:px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-white/60 transition cursor-pointer min-h-[36px]"
              title="Vider la discussion actuelle"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Effacer</span>
            </button>
          )}
        </div>

        {showConfig && (
          <div className="mt-3 grid gap-4 rounded-sm border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4 text-xs sm:grid-cols-12">
            <div className="sm:col-span-8 space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/50">
                Persona / Instruction Système Gemma 4
              </label>
              <textarea
                value={systemInstruction}
                onChange={(e) => setSystemInstruction(e.target.value)}
                placeholder="Ex: Tu es un assistant expert en programmation, précis, direct et pédagogue..."
                rows={2}
                className="w-full rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-black/60 p-2.5 font-mono text-xs text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-white/30"
              />
            </div>

            <div className="sm:col-span-4 space-y-3">
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/50">
                  <span>Température</span>
                  <span className="text-purple-600 dark:text-purple-400 font-mono font-bold">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer mt-1"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/50">
                  <span>Top-P</span>
                  <span className="text-purple-600 dark:text-purple-400 font-mono font-bold">{topP}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={topP}
                  onChange={(e) => setTopP(parseFloat(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer mt-1"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Messages List Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
        {conversation.messages.length === 0 ? (
          <div className="mx-auto my-4 sm:my-10 max-w-2xl text-center space-y-4 sm:space-y-8">
            <div className="inline-block bg-purple-600 text-white dark:text-black px-2.5 py-1 font-black text-[10px] sm:text-xs uppercase tracking-widest rounded-xs shadow-xs">
              Gemma-4 Inference Engine
            </div>
            <div>
              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-tight">
                Gemma <span className="text-purple-600 dark:text-purple-400">Four.</span>
              </h1>
              <p className="mt-2 text-[10px] sm:text-xs font-mono tracking-widest uppercase text-slate-500 dark:text-white/50 max-w-lg mx-auto px-2">
                Inférence conversationnelle haute fidélité & raisonnement multimodal.
              </p>
            </div>

            {/* Quick Prompts Grid */}
            <div className="grid gap-2.5 text-left grid-cols-1 sm:grid-cols-2 pt-2 sm:pt-4">
              {quickPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(item.text)}
                  className="group flex flex-col justify-between rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-3 sm:p-4 text-left transition hover:border-purple-500 hover:shadow-xs dark:hover:bg-white/10 cursor-pointer min-h-[75px]"
                >
                  <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-white">
                    {item.label}
                  </span>
                  <span className="mt-1.5 line-clamp-2 text-[11px] font-mono text-slate-600 dark:text-white/60">
                    "{item.text}"
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          conversation.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 sm:gap-3 max-w-4xl mx-auto ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-sm bg-purple-600 text-white dark:text-black font-black text-[10px] sm:text-xs shadow-xs mt-0.5">
                  G4
                </div>
              )}

              <div
                className={`group relative rounded-sm p-3.5 sm:p-5 text-xs sm:text-sm leading-relaxed max-w-[92%] sm:max-w-[88%] border overflow-hidden ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white border-purple-600 dark:bg-purple-600/20 dark:border-purple-500 dark:text-white'
                    : 'bg-white dark:bg-[#0a0a0a] border-slate-200 dark:border-white/10 text-slate-800 dark:text-white/90 shadow-xs'
                }`}
              >
                {/* User uploaded image preview if present */}
                {msg.image && (
                  <div className="mb-2.5 overflow-hidden rounded-sm border border-slate-200 dark:border-white/20">
                    <img
                      src={msg.image}
                      alt="Pièce jointe"
                      className="max-h-48 sm:max-h-60 w-auto object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap font-sans text-white text-xs sm:text-sm">{msg.content}</p>
                ) : (
                  <div className="markdown-body prose dark:prose-invert prose-xs sm:prose-sm max-w-none font-sans text-slate-800 dark:text-slate-100 overflow-x-auto">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content || (msg.isStreaming ? 'Calcul de la réponse Gemma 4...' : '')}
                    </ReactMarkdown>
                  </div>
                )}

                {/* Metrics / Copy Toolbar */}
                {msg.role === 'assistant' && (
                  <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-white/10 pt-2 text-[10px] font-mono text-slate-400 dark:text-white/40">
                    <div className="flex items-center gap-2">
                      <span className="uppercase tracking-widest text-slate-500 dark:text-white/50 truncate max-w-[110px] sm:max-w-none">
                        {msg.metrics?.gemmaAlias || currentModel}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="flex items-center gap-1 text-slate-500 dark:text-white/50 hover:text-purple-600 dark:hover:text-white transition uppercase tracking-widest font-bold cursor-pointer p-1"
                      title="Copier la réponse"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                          <span className="text-purple-600 dark:text-purple-400">COPIÉ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>COPIER</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-sm bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white font-mono font-bold text-xs border border-slate-300 dark:border-white/10 mt-0.5">
                  <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview Box before submitting */}
      {selectedImage && (
        <div className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] p-2.5 px-4 sm:px-6">
          <div className="relative inline-block">
            <img
              src={selectedImage}
              alt="Aperçu"
              className="h-14 w-14 sm:h-16 sm:w-16 rounded-sm object-cover border border-purple-500"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Input Form Bar */}
      <div className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] p-2.5 sm:p-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
          <div className="relative flex items-center rounded-sm border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-black p-1.5 sm:p-2 focus-within:border-purple-500 transition">
            {/* Attachment Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-sm text-slate-400 dark:text-white/50 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-purple-600 dark:hover:text-purple-400 transition cursor-pointer"
              title="Joindre une image (Multimodal)"
            >
              <Paperclip className="h-4 w-4" />
            </button>

            {/* Prompt Textarea */}
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Envoyer une requête à Gemma 4..."
              rows={1}
              className="flex-1 bg-transparent px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-sans text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none resize-none max-h-32 min-h-[38px]"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={(!prompt.trim() && !selectedImage) || isLoading}
              className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-sm bg-purple-600 text-white hover:bg-purple-500 dark:bg-white dark:text-black dark:hover:bg-purple-500 disabled:opacity-30 transition font-black cursor-pointer shadow-xs ml-1"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

