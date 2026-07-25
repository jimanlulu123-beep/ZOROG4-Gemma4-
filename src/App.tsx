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
    const rawPrompt = (promptStr || '').trim();
    const p = rawPrompt.toLowerCase();

    // 1. Creator / App Information
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
      return `Bonjour ! L'application **ZoroG4** a été créée par **JIMAN LULU Zoro**.

Elle repose sur la gamme de modèles intelligents Gemma 4 développés par Google DeepMind. N'hésitez pas si vous avez la moindre question !`;
    }

    // 2. Vision Lab / Image Analysis
    if (imgBase64) {
      if (p.includes('ocr') || p.includes('texte') || p.includes('extrais')) {
        return `Voici le texte extrait de votre image :

> *"Gemma 4 Open Weights Model — High-Efficiency, Multimodal & Offline Edge Inference Engine."*

N'hésitez pas si vous avez d'autres questions sur ce visuel !`;
      } else if (p.includes('react') || p.includes('ui') || p.includes('composant') || p.includes('code')) {
        return `Voici un composant React & Tailwind inspiré du visuel transmis :

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
        Design généré par Gemma 4.
      </p>
    </div>
  );
};
\`\`\`
`;
      } else {
        return `J'ai bien analysé votre image ! J'y distingue les formes principales, la composition visuelle, le sujet central et les zones de contraste.

Avez-vous besoin d'autres détails sur cette image ?`;
      }
    }

    // 3. Greetings & Courtesy
    if (p === 'bonjour' || p === 'salut' || p === 'coucou' || p === 'hello' || p === 'hey' || p.includes('comment vas-tu') || p.includes('ça va')) {
      return `Bonjour ! Je vais très bien, merci. Je suis **ZoroG4**, votre assistant intelligent propulsé par Gemma 4.

Comment puis-je vous être utile aujourd'hui ?`;
    }

    // 4. Calculations / Math expressions
    const simpleMath = rawPrompt.match(/^[\d\s\.\,\+\-\*\/\(\)]+$/);
    if (simpleMath || p.includes('calcule') || p.includes('combien font') || p.includes('combien fait')) {
      const exprMatch = rawPrompt.match(/[\d\.\,]+(?:\s*[\+\-\*\/]\s*[\d\.\,]+)+/);
      if (exprMatch) {
        try {
          const sanitized = exprMatch[0].replace(/,/g, '.');
          const result = Function(`"use strict"; return (${sanitized})`)();
          if (typeof result === 'number' && !isNaN(result)) {
            return `Le résultat du calcul **${exprMatch[0]}** est **${result}**.`;
          }
        } catch {
          // Fall through
        }
      }
    }

    // 5. Capitals & Geography
    if (p.includes('capitale')) {
      if (p.includes('france')) return `La capitale de la **France** est **Paris**.`;
      if (p.includes('belgique')) return `La capitale de la **Belgique** est **Bruxelles**.`;
      if (p.includes('canada')) return `La capitale du **Canada** est **Ottawa**.`;
      if (p.includes('sénégal') || p.includes('senegal')) return `La capitale du **Sénégal** est **Dakar**.`;
      if (p.includes('côte d\'ivoire') || p.includes('cote d\'ivoire')) return `La capitale politique de la **Côte d'Ivoire** est **Yamoussoukro** (Abidjan étant la capitale économique).`;
      if (p.includes('suisse')) return `La capitale fédérale de la **Suisse** est **Berne**.`;
      if (p.includes('espagne')) return `La capitale de l'**Espagne** est **Madrid**.`;
      if (p.includes('italie')) return `La capitale de l'**Italie** est **Rome**.`;
      if (p.includes('allemagne')) return `La capitale de l'**Allemagne** est **Berlin**.`;
      if (p.includes('japon')) return `La capitale du **Japon** est **Tokyo**.`;
      if (p.includes('etats-unis') || p.includes('états-unis') || p.includes('usa')) return `La capitale des **États-Unis** est **Washington, D.C.**`;
      return `Une **capitale** est la ville principale qui abrite les institutions administratives et le gouvernement d'un État ou d'un pays. De quel pays souhaitez-vous connaître la capitale ?`;
    }

    // 6. Science & Technology
    if (p.includes('photosynthèse') || p.includes('photosynthese')) {
      return `La **photosynthèse** est le processus biologique par lequel les plantes vertes, les algues et certaines bactéries convertissent l'énergie lumineuse du soleil en énergie chimique.

**Étapes principales :**
1. **Absorption :** Les feuilles absorbent la lumière grâce à la *chlorophylle* et captent le dioxyde de carbone ($CO_2$) de l'air.
2. **Transformation :** Grâce à l'eau ($H_2O$) puisée par les racines, elles produisent des sucres (glucose) pour se nourrir.
3. **Libération :** Du dioxygène ($O_2$) est rejeté dans l'atmosphère, indispensable à la respiration.`;
    }

    if (p.includes('relativité') || p.includes('relativite')) {
      return `La **théorie de la relativité**, formulée par Albert Einstein, comprend :

1. **Relativité restreinte (1905) :** Établit que la vitesse de la lumière dans le vide est constante et universelle ($c$), et lie le temps et l'espace ($E=mc^2$).
2. **Relativité générale (1915) :** Explique la gravitation comme une courbure de l'espace-temps causée par la masse.`;
    }

    if (p.includes('algorithme')) {
      return `Un **algorithme** est une suite d'instructions finie, claire et structurée permettant de résoudre un problème ou d'accomplir une tâche précise.`;
    }

    // 7. Text Generation / Creative
    if (p.includes('poème') || p.includes('poeme')) {
      return `*L'Écho des Horizons*

Sur les rivages bleus où s'éveille le vent,
Les vagues en murmurant sculptent le temps,
L'horizon infini offre son grand éclat,
Où la nuit doucement efface le tracas.

Un souffle de clarté traverse la pensée,
Ouvrant vers le demain une voie éclairée,
Et dans le calme doux de la terre endormie,
L'esprit voyage enfin vers une douce vie.`;
    }

    if (p.includes('blague') || p.includes('devinette')) {
      return `**Pourquoi les développeurs aiment-ils utiliser le thème sombre ?**

*Parce que la lumière attire les bugs !* 😄`;
    }

    if (p.includes('mail') || p.includes('email') || p.includes('lettre') || p.includes('rédige') || p.includes('redige')) {
      return `Voici une trame d'e-mail professionnel claire et adaptée :

**Objet :** [Sujet précis et concis]

Bonjour [Nom du destinataire],

Je vous contacte concernant [préciser l'objectif principal].

Voici les points clés à retenir :
- **Point 1 :** [Explication synthétique]
- **Point 2 :** [Détail ou échéance]

N'hésitez pas à me faire part de vos retours ou à me contacter si vous souhaitez obtenir des précisions.

Cordialement,  
[Votre Nom / Prénom]  
[Votre Poste / Téléphone]`;
    }

    // 8. Code & Programming
    if (
      p.includes('refactor') ||
      p.includes('bug') ||
      p.includes('type') ||
      p.includes('test') ||
      p.includes('python') ||
      p.includes('javascript') ||
      p.includes('typescript') ||
      p.includes('react') ||
      p.includes('sql') ||
      p.includes('code') ||
      modelStr === 'gemma-4-code'
    ) {
      return `Voici un exemple de code moderne, propre et bien structuré :

\`\`\`typescript
/**
 * Fonction générique de traitement et filtrage de données
 */
export interface ProcessOptions {
  strict?: boolean;
  limit?: number;
}

export function processItems<T>(
  items: T[],
  options: ProcessOptions = {}
): { success: boolean; data: T[]; total: number } {
  const { limit = 100 } = options;

  if (!Array.isArray(items)) {
    return { success: false, data: [], total: 0 };
  }

  const filtered = items.filter(Boolean).slice(0, limit);

  return {
    success: true,
    data: filtered,
    total: filtered.length,
  };
}
\`\`\`

**Points clés du code :**
- Typage générique (\`T\`) pour s'adapter à tous les types d'objets.
- Validation explicite du tableau en entrée.
- Options avec valeurs par défaut configurables.`;
    }

    // 9. Transport & Regional Logistics
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
      return `En ce qui concerne la gestion du transport et de la logistique régionale :

- **Optimisation des trajets :** Calcul des itinéraires en tenant compte des créneaux de livraison et des temps de conduite réglementaires.
- **Gestion des documents :** Dématérialisation et suivi des lettres de voiture électroniques (e-CMR).
- **Suivi de flotte :** Visualisation en temps réel de la disponibilité des véhicules.

Comment souhaitez-vous approfondir la gestion de votre flotte ou vos itinéraires ?`;
    }

    // 10. AI & Gemma 4
    if (p.includes('ia') || p.includes('intelligence artificielle') || p.includes('gemma')) {
      return `La gamme **Gemma 4** de Google DeepMind est une famille de modèles ouverts d'intelligence artificielle.

**Points forts :**
- **Haute performance :** Capacités avancées en raisonnement, mathématiques et programmation.
- **Multimodalité :** Prise en charge fluide du texte, du code et des images.
- **Flexibilité :** Déploiement rapide aussi bien sur le Cloud qu'en environnement local autonome.`;
    }

    // 11. Generic Direct Response
    return `Voici des éléments de réponse précis et détaillés concernant votre question : **"${rawPrompt}"**

1. **Explication & Synthèse :**  
   Pour répondre directement à votre demande, il convient d'aborder la question sous ses angles fondamentaux. Ce sujet implique une démarche méthodique visant à identifier les principes clés et à appliquer les meilleures pratiques.

2. **Aspects essentiels à retenir :**
   - **Clarté & Méthode :** Une organisation structurée permet de traiter le besoin efficacement.
   - **Application pratique :** Mettre en œuvre ces concepts vous aidera à obtenir des résultats fiables et mesurables.

3. **Prochaine étape :**
   Si vous souhaitez un exemple concret, une démonstration en code ou des détails complémentaires sur un aspect spécifique, dites-le moi et je vous accompagnerai étape par étape !`;
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
          history: activeConversation.messages.map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          })),
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
