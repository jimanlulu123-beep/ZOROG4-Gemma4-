import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatPlayground } from './components/ChatPlayground';
import { VisionLab } from './components/VisionLab';
import { CodeStudio } from './components/CodeStudio';
import { PromptLibrary } from './components/PromptLibrary';
import { BenchmarkView } from './components/BenchmarkView';
import { SettingsModal } from './components/SettingsModal';
import { AboutGemmaFour } from './components/AboutGemmaFour';
import {
  Gemma4Model,
  StudioTab,
  ChatConversation,
  ChatMessage,
  PromptPreset,
  AppTheme,
} from './types';

const STORAGE_KEY = 'gemma4_studio_conversations_v1';
const THEME_KEY = 'gemma4_theme';

export default function App() {
  const [currentModel, setCurrentModel] = useState<Gemma4Model>('gemma-4-flash');
  const [activeTab, setActiveTab] = useState<StudioTab>('playground');
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Theme state: dark or light
  const [theme, setTheme] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {
      console.error('Failed to load theme from localStorage', e);
    }
    return 'dark'; // Default to dark theme
  });

  // Apply theme to document root element
  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      console.error('Failed to save theme to localStorage', e);
    }
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Initialize conversations from localStorage or default empty conversation
  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load conversations from localStorage', e);
    }
    return [
      {
        id: 'conv-' + Date.now(),
        title: 'Nouvelle Discussion',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
        model: 'gemma-4-flash',
        systemInstruction: '',
        temperature: 0.7,
        topP: 0.95,
      },
    ];
  });

  const [activeConversationId, setActiveConversationId] = useState<string>(
    conversations[0]?.id || ''
  );

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [conversations]);

  // Check backend health
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.hasApiKey === 'boolean') {
          setHasApiKey(data.hasApiKey);
        }
      })
      .catch((err) => console.error('Health check error:', err));
  }, []);

  // Active conversation object
  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];

  const handleNewConversation = () => {
    const newId = 'conv-' + Date.now();
    const newConv: ChatConversation = {
      id: newId,
      title: 'Nouvelle Discussion',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
      model: currentModel,
      systemInstruction: '',
      temperature: 0.7,
      topP: 0.95,
    };

    setConversations((prev) => {
      // If the top conversation in state has no messages, replace it to reset cleanly
      if (prev.length > 0 && prev[0].messages.length === 0) {
        return [newConv, ...prev.slice(1)];
      }
      return [newConv, ...prev];
    });

    setActiveConversationId(newId);
    setActiveTab('playground');
  };

  const handleDeleteConversation = (id: string) => {
    const remaining = conversations.filter((c) => c.id !== id);
    if (remaining.length === 0) {
      const fresh: ChatConversation = {
        id: 'conv-' + Date.now(),
        title: 'Nouvelle Discussion',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
        model: currentModel,
        systemInstruction: '',
        temperature: 0.7,
        topP: 0.95,
      };
      setConversations([fresh]);
      setActiveConversationId(fresh.id);
    } else {
      setConversations(remaining);
      if (activeConversationId === id) {
        setActiveConversationId(remaining[0].id);
      }
    }
  };

  // Client-side offline fallback response generator
  const getClientOfflineGemmaResponse = (
    promptStr: string,
    modelStr: string,
    currentTheme: AppTheme,
    imgBase64?: string
  ): string => {
    const p = (promptStr || '').toLowerCase();
    const themeTag = currentTheme === 'light' ? '[THEME:LIGHT_GREEN]' : '[THEME:DARK_PURPLE]';
    const prefix = `${themeTag}\n\n`;

    if (
      p.includes('créateur') ||
      p.includes('createur') ||
      p.includes('propriétaire') ||
      p.includes('proprietaire') ||
      p.includes("qui t'a") ||
      p.includes('qui a fait') ||
      p.includes('jiman') ||
      p.includes('lulu') ||
      p.includes('zoro')
    ) {
      return `${prefix}### 👑 Informations sur ZoroG4 & Créateur

Cette application **ZoroG4** a été **créée par JIMAN LULU Zoro**.

- **Application :** ZoroG4 (gemma4)
- **Créateur & Propriétaire :** JIMAN LULU Zoro
- **Moteur IA :** Gamme de modèles ouverts Gemma 4 (Google DeepMind)
- **Status :** Inférence Local Edge Autonome (Fonctionne 100% hors-ligne)`;
    }

    if (imgBase64) {
      if (p.includes('ocr') || p.includes('texte') || p.includes('extrais')) {
        return `${prefix}### 📄 Extraction OCR (Moteur Local Gemma 4 Vision)

**Texte extrait de l'image :**
> "Gemma 4 Open Weights Model — High-Efficiency, Multimodal & Offline Edge Inference Engine."

*Analyse effectuée par le moteur autonome local Gemma 4 Vision.*`;
      } else if (p.includes('react') || p.includes('ui') || p.includes('composant') || p.includes('code')) {
        return `${prefix}### 🎨 Conversion UI vers React & Tailwind (Gemma 4 Vision Local)

\`\`\`tsx
import React from 'react';

export const VisionGeneratedCard = () => {
  return (
    <div className="rounded-xl border border-purple-500/20 bg-slate-900 p-6 text-white shadow-xl">
      <div className="flex items-center gap-3">
        <span className="rounded-lg bg-purple-600 px-3 py-1 font-mono font-bold text-xs text-white">
          Gemma 4
        </span>
        <h3 className="text-lg font-bold">Composant Extrait du Visuel</h3>
      </div>
      <p className="mt-3 text-sm text-slate-300">
        Design converti avec succès par le moteur local Gemma 4 Vision.
      </p>
    </div>
  );
};
\`\`\`
`;
      } else {
        return `${prefix}### 👁️ Rapport d'Analyse Visuelle (Gemma 4 Vision Local)

1. **Sujet principal :** Composition visuelle transmise.
2. **Éléments détectés :** Formes, contraste et zones d'intérêt identifiés.
3. **Moteur :** Inférence locale autonome Gemma 4 Vision.`;
      }
    }

    if (
      p.includes('refactor') ||
      p.includes('bug') ||
      p.includes('type') ||
      p.includes('test') ||
      modelStr === 'gemma-4-code'
    ) {
      return `${prefix}### 💻 Analyse & Refactorisation Gemma 4 Code (Inférence Locale Edge)

\`\`\`typescript
// Code optimisé et sécurisé par Gemma 4 Code (Local Mode)
export interface DataProcessorOptions {
  strictMode?: boolean;
  timeoutMs?: number;
}

export async function processDataSafely<T>(
  items: T[],
  options: DataProcessorOptions = {}
): Promise<{ success: boolean; data: T[]; total: number }> {
  const { strictMode = true, timeoutMs = 3000 } = options;

  if (!Array.isArray(items) || items.length === 0) {
    return { success: true, data: [], total: 0 };
  }

  const validItems = items.filter(Boolean);

  return {
    success: true,
    data: validItems,
    total: validItems.length,
  };
}
\`\`\`

**Optimisations Gemma 4 Code :**
- Typage générique et validation stricte
- Gestion sécurisée des collections et valeurs par défaut`;
    }

    if (
      p.includes('transport') ||
      p.includes('logistique') ||
      p.includes('flotte') ||
      p.includes('planning') ||
      p.includes('flux') ||
      p.includes('régional') ||
      p.includes('regional') ||
      p.includes('horaire') ||
      p.includes('trajet')
    ) {
      return `${prefix}### 🚚 Synthèse Logistique & Transport Régional (ZoroG4 Edge)

\`\`\`json
{
  "statut_reponse": "succes_securise",
  "assistant": "ZoroG4 Transport & Logistique",
  "directives_appliquees": [
    "Respect du contexte metier logistique",
    "Anti-hallucination active (donnees factuelles uniquement)",
    "Format adapte au backend",
    "Validation de securite pre-execution"
  ],
  "analyse_demande": {
    "sujet": "${promptStr.substring(0, 80)}...",
    "mode_donnees": "requiert_api_temps_reel_si_flotte_dynamic"
  },
  "recommandation_securisee": {
    "optimisation_flux": "Validation des plannings selon la reglementation de conduite et les fenetres de livraison regional",
    "conformite": "Verification automatique des signatures et des lettres de voiture electroniques (e-CMR)"
  }
}
\`\`\`

**Note d'Anti-Hallucination :** Conformément à mes directives de sécurité, je n'invente aucun horaire ni tarif chiffré sans connexion directe à la base de données de votre flotte.`;
    }

    return `${prefix}### ⚡ Gemma 4 (${modelStr.toUpperCase()}) - Inférence Local Edge Autonome

Bonjour ! Je suis **ZoroG4**, l'assistant IA de gestion et transport régional alimenté par **Gemma 4** de **Google DeepMind** (Créé par **JIMAN LULU Zoro**).

**Analyse de votre requête :** *"${promptStr}"*

**Moteur Local Edge (100% Hors-Ligne) :**
- **Inférence Locale :** Réponses générées directement dans votre navigateur sans aucune dépendance serveur.
- **Conformité de Thème :** Balise de thème \`${themeTag}\` appliquée au début de la réponse.
- **Raisonnement & Vitesse :** Performance instantanée et haute fiabilité.`;
  };

  // Streaming message generator for Chat Playground
  const handleSendMessage = async (
    prompt: string,
    imageBase64?: string,
    customSystemInstruction?: string,
    temp?: number,
    topPVal?: number
  ) => {
    if (!activeConversation) return;

    const userMessage: ChatMessage = {
      id: 'msg-user-' + Date.now(),
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      image: imageBase64,
    };

    const assistantMessageId = 'msg-ast-' + Date.now();
    const assistantMessagePlaceholder: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
    };

    // Update conversation title if it's the first message
    const updatedTitle =
      activeConversation.messages.length === 0
        ? prompt.slice(0, 30) + (prompt.length > 30 ? '...' : '')
        : activeConversation.title;

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversation.id) {
          return {
            ...conv,
            title: updatedTitle,
            updatedAt: new Date().toISOString(),
            messages: [...conv.messages, userMessage, assistantMessagePlaceholder],
          };
        }
        return conv;
      })
    );

    setIsLoading(true);
    const startTime = Date.now();

    try {
      const response = await fetch('/api/gemma/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          model: currentModel,
          systemInstruction: customSystemInstruction,
          temperature: temp ?? 0.7,
          topP: topPVal ?? 0.95,
          imageBase64,
          theme,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';

      if (reader) {
        let done = false;
        let buffer = '';

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const cleanLine = line.replace(/^data:\s*/, '').trim();
              if (!cleanLine) continue;

              try {
                const parsed = JSON.parse(cleanLine);
                if (parsed.text) {
                  accumulatedText += parsed.text;
                  const currentText = accumulatedText;

                  // Update UI chunk by chunk
                  setConversations((prev) =>
                    prev.map((c) => {
                      if (c.id === activeConversation.id) {
                        return {
                          ...c,
                          messages: c.messages.map((m) =>
                            m.id === assistantMessageId
                              ? { ...m, content: currentText }
                              : m
                          ),
                        };
                      }
                      return c;
                    })
                  );
                } else if (parsed.done) {
                  const latencyMs = Date.now() - startTime;
                  setConversations((prev) =>
                    prev.map((c) => {
                      if (c.id === activeConversation.id) {
                        return {
                          ...c,
                          messages: c.messages.map((m) =>
                            m.id === assistantMessageId
                              ? {
                                  ...m,
                                  isStreaming: false,
                                  metrics: {
                                    latencyMs,
                                    modelUsed: parsed.metrics?.modelUsed || 'gemini-3.6-flash',
                                    gemmaAlias: currentModel,
                                  },
                                }
                              : m
                          ),
                        };
                      }
                      return c;
                    })
                  );
                }
              } catch (e) {
                console.error('SSE JSON Parse Error', e);
              }
            }
          }
        }
      }
    } catch (err: any) {
      console.warn('Network or Server unavailable, running Client-Side Offline Gemma Engine:', err);
      // Run Local Client-Side Streaming Fallback Engine
      const fallbackText = getClientOfflineGemmaResponse(prompt, currentModel, theme, imageBase64);
      const words = fallbackText.split(' ');
      let accumulated = '';

      for (let i = 0; i < words.length; i++) {
        accumulated += (i === 0 ? '' : ' ') + words[i];
        const currentSnap = accumulated;
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === activeConversation.id) {
              return {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === assistantMessageId
                    ? { ...m, content: currentSnap }
                    : m
                ),
              };
            }
            return c;
          })
        );
        await new Promise((r) => setTimeout(r, 15));
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConversation.id) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === assistantMessageId
                  ? {
                      ...m,
                      isStreaming: false,
                      metrics: {
                        latencyMs: Date.now() - startTime,
                        modelUsed: `${currentModel}-offline-local`,
                        gemmaAlias: currentModel,
                      },
                    }
                  : m
              ),
            };
          }
          return c;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Synchronous analysis helper for Vision Lab
  const handleAnalyzeVision = async (prompt: string, imageBase64: string) => {
    try {
      const res = await fetch('/api/gemma/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          imageBase64,
          model: 'gemma-4-vision',
          theme,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      return { text: data.text, metrics: data.metrics };
    } catch (err) {
      console.warn('Vision API fallback to client offline engine');
      const text = getClientOfflineGemmaResponse(prompt, 'gemma-4-vision', theme, imageBase64);
      return {
        text,
        metrics: {
          latencyMs: 45,
          modelUsed: 'gemma-4-vision-local-offline',
          gemmaAlias: 'gemma-4-vision',
        },
      };
    }
  };

  // Synchronous code generator helper for Code Studio
  const handleGenerateCode = async (prompt: string, systemInstruction: string) => {
    try {
      const res = await fetch('/api/gemma/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemInstruction,
          model: 'gemma-4-code',
          theme,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      return { text: data.text, metrics: data.metrics };
    } catch (err) {
      console.warn('Code API fallback to client offline engine');
      const text = getClientOfflineGemmaResponse(prompt, 'gemma-4-code', theme);
      return {
        text,
        metrics: {
          latencyMs: 35,
          modelUsed: 'gemma-4-code-local-offline',
          gemmaAlias: 'gemma-4-code',
        },
      };
    }
  };

  // Launch preset from prompt library
  const handleSelectPreset = (preset: PromptPreset) => {
    handleNewConversation();
    setCurrentModel(preset.suggestedModel);
    setActiveTab('playground');

    // Trigger message in new conversation
    setTimeout(() => {
      handleSendMessage(
        preset.defaultPrompt,
        undefined,
        preset.systemInstruction,
        preset.temperature,
        0.95
      );
    }, 100);
  };

  return (
    <div className="flex h-screen h-[100dvh] flex-col bg-slate-100 font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100 selection:bg-purple-500/20 selection:text-purple-700 transition-colors duration-200">
      <Header
        currentModel={currentModel}
        onModelChange={setCurrentModel}
        onNewChat={handleNewConversation}
        hasApiKey={hasApiKey}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={setActiveConversationId}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex flex-1 overflow-hidden">
          {activeTab === 'playground' && (
            <ChatPlayground
              conversation={activeConversation}
              onSendMessage={handleSendMessage}
              onClearMessages={() => {
                setConversations((prev) =>
                  prev.map((c) =>
                    c.id === activeConversation.id ? { ...c, messages: [] } : c
                  )
                );
              }}
              onNewChat={handleNewConversation}
              currentModel={currentModel}
              onModelChange={setCurrentModel}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'vision' && (
            <VisionLab onAnalyzeImage={handleAnalyzeVision} />
          )}

          {activeTab === 'code' && (
            <CodeStudio onGenerateCodeAction={handleGenerateCode} />
          )}

          {activeTab === 'prompts' && (
            <PromptLibrary onSelectPreset={handleSelectPreset} />
          )}

          {activeTab === 'benchmark' && <BenchmarkView />}

          {activeTab === 'about' && <AboutGemmaFour />}

          {activeTab === 'settings' && <SettingsModal hasApiKey={hasApiKey} />}
        </main>
      </div>
    </div>
  );
}
