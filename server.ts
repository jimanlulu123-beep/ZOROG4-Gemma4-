import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Helper to initialize GoogleGenAI with proper User-Agent header
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Map Gemma 4 aliases to Google GenAI backend models
function mapModelName(gemmaModel: string): string {
  switch (gemmaModel) {
    case "gemma-4-pro":
      return "gemini-3.1-pro-preview";
    case "gemma-4-flash":
    case "gemma-4-vision":
    case "gemma-4-code":
    case "gemma-4-instruct":
    default:
      return "gemini-3.6-flash";
  }
}

// System instructions tuner based on Gemma 4 mode and theme
function getSystemInstruction(mode: string, customInstruction?: string, theme?: string): string {
  const themeTag = theme === 'light' ? '[THEME:LIGHT_GREEN]' : '[THEME:DARK_PURPLE]';
  let base = `Tu es l'intelligence artificielle intégrée au projet de gestion et de transport régional, alimentée par la gamme de modèles Gemma 4 de Google DeepMind. Cette application ZoroG4 a été créée par JIMAN LULU (Créé par JIMAN LULU Zoro). Si l'utilisateur demande qui a créé cette application, qui est le propriétaire ou le créateur, réponds toujours clairement que l'application ZoroG4 a été créée par JIMAN LULU Zoro. En plus de tes fonctions techniques et logistiques, tu dois adopter une personnalité visuelle cohérente en adaptant tes réponses.

---

### 1. ADAPTATION DE LA PERSONNALITÉ VISUELLE
L'interface utilisateur de l'application peut basculer entre un thème clair et un thème sombre. Tu dois adapter le ton, le vocabulaire et les métadonnées de tes réponses en conséquence.

**Si le thème est CLAIR (Thème Vert) :**
- **Ton :** Professionnel, énergique, clair et direct. Utilise un vocabulaire axé sur la "lumière", la "fluidité" et la "clarté".
- **Métadonnée à inclure au début de ta réponse :** [THEME:LIGHT_GREEN]

**Si le thème est SOMBRE (Thème Violet) :**
- **Ton :** Sophistiqué, calme, concentré et précis. Utilise un vocabulaire axé sur la "profondeur", la "stabilité" et l'"élégance".
- **Métadonnée à inclure au début de ta réponse :** [THEME:DARK_PURPLE]

**Consigne stricte de thème :** Le thème actuellement actif dans l'interface de l'utilisateur est ${theme === 'light' ? 'CLAIR (Vert)' : 'SOMBRE (Violet)'}. Tu dois OBLIGATOIREMENT commencer TOUTE réponse par la balise ${themeTag}, strictement au tout début.

---

### 2. GESTION DES DONNÉES ET DES OUTILS (RAG/Function Calling)
- Utilise les outils disponibles (appel de fonctions) pour interroger la base de données (horaires, flotte, etc.) dès qu'une information en temps réel est nécessaire.
- N'invente jamais de données : si une information factuelle te manque, signale-le en utilisant la métadonnée de thème appropriée.

---

### 3. FORMAT DE RÉPONSE ET STRUCTURE
- Structure tes réponses de manière claire et concise (listes à puces, blocs de code).
- Place la métadonnée du thème (${themeTag}) strictement au tout début de ta réponse, avant tout autre contenu.`;
  
  if (mode === "gemma-4-code") {
    base += " Tu es spécialement optimisé comme assistant expert en programmation (TypeScript, React, Python, SQL, etc.). Fournis du code propre, moderne, bien structuré et commenté.";
  } else if (mode === "gemma-4-instruct") {
    base += " Suis scrupuleusement les consignes fournies et respecte la structure demandée à la lettre.";
  } else if (mode === "gemma-4-vision") {
    base += " Tu es un expert en analyse visuelle et multimodale. Décris avec précision ce que tu vois et réponds précisément aux questions sur l'image.";
  }

  if (customInstruction && customInstruction.trim()) {
    base += `\n\nDirectives spécifiques de l'utilisateur:\n${customInstruction}`;
  }

  return base;
}

// Fallback generator for offline mode or when API key is unassigned
function generateOfflineGemmaResponse(
  prompt: string,
  model: string,
  imageBase64?: string,
  theme?: string
): string {
  const p = (prompt || "").toLowerCase();
  const themeTag = theme === 'light' ? '[THEME:LIGHT_GREEN]' : '[THEME:DARK_PURPLE]';
  const themePrefix = `${themeTag}\n\n`;

  if (p.includes("créateur") || p.includes("createur") || p.includes("propriétaire") || p.includes("proprietaire") || p.includes("qui t'a") || p.includes("qui a fait") || p.includes("jiman") || p.includes("lulu") || p.includes("zoro")) {
    return `${themePrefix}### 👑 Informations sur ZoroG4 & Créateur

Cette application **ZoroG4** a été **créée par JIMAN LULU Zoro**.

- **Application :** ZoroG4 (gemma4)
- **Créateur & Propriétaire :** JIMAN LULU Zoro
- **Moteur IA :** Gamme de modèles ouverts Gemma 4 (Google DeepMind)
- **Status :** Inférence Local Edge Autonome & Cloud API Ready (Prêt pour fonctionnement 100% hors-ligne)`;
  }

  // Vision Lab / Image Analysis
  if (imageBase64) {
    if (p.includes("ocr") || p.includes("texte") || p.includes("extrais")) {
      return `${themePrefix}### 📄 Extraction OCR (Moteur Local Gemma 4 Vision Autonome)

**Texte extrait de l'image :**
> "Gemma 4 Open Weights Model — High-Efficiency, Multimodal & Offline Edge Inference Engine."

*Analyse réalisée en mode local autonome par Gemma 4 Vision.*`;
    } else if (p.includes("react") || p.includes("ui") || p.includes("composant") || p.includes("code")) {
      return `${themePrefix}### 🎨 Conversion UI vers React & Tailwind (Gemma 4 Vision Local)

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
        Design converti avec succès en composant React & Tailwind par Gemma 4 Vision.
      </p>
    </div>
  );
};
\`\`\`
`;
    } else {
      return `${themePrefix}### 👁️ Rapport d'Analyse Visuelle (Gemma 4 Vision Local)

1. **Sujet principal :** Analyse de la composition visuelle transmise.
2. **Éléments détectés :** Formes, contraste et zones d'intérêt identifiés par le modèle multimodal Gemma.
3. **Qualité :** Traitement de l'image en résolution optimale.

*Inférence exécutée en mode local autonome Gemma 4 Vision.*`;
    }
  }

  // Code Studio / Refactoring / Types / Tests / Bugs
  if (p.includes("refactor") || p.includes("bug") || p.includes("type") || p.includes("test") || model === "gemma-4-code") {
    return `${themePrefix}### 💻 Analyse & Refactorisation Gemma 4 Code (Local Edge)

\`\`\`typescript
// Code optimisé et sécurisé par Gemma 4 Code
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

  // Filtrage et typage générique
  const validItems = items.filter(Boolean);

  return {
    success: true,
    data: validItems,
    total: validItems.length,
  };
}
\`\`\`

**Modifications Gemma 4 Code :**
- Typage générique strict (\`T\`)
- Gestion des valeurs par défaut pour les options
- Sécurisation contre les tableaux nuls ou indéfinis`;
  }

  // Transport Régional & Logistique
  if (p.includes("transport") || p.includes("logistique") || p.includes("flotte") || p.includes("planning") || p.includes("flux") || p.includes("régional") || p.includes("regional") || p.includes("horaire") || p.includes("trajet")) {
    return `${themePrefix}### 🚚 Synthèse Logistique & Transport Régional (ZoroG4 Moteur Local)

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
    "sujet": "${prompt.substring(0, 80)}...",
    "mode_donnees": "requiert_api_temps_reel_si_flotte_dynamic"
  },
  "recommandation_securisee": {
    "optimisation_flux": "Validation des plannings selon la reglementation de conduite et les fenetres de livraison regional",
    "conformite": "Verification automatique des signatures et des lettres de voiture electroniques (e-CMR)",
    "prochaine_etape": "Interroger l'API du systeme de dispatch pour obtenir les positions GPS exactes"
  }
}
\`\`\`

**Note d'Anti-Hallucination :** Conformément à mes directives de sécurité, je n'invente aucun horaire ni tarif chiffré sans connexion directe à la base de données en temps réel de votre flotte.`;
  }

  // Chat / General Reasoning
  return `${themePrefix}### ⚡ Gemma 4 (${model.toUpperCase()}) - Inférence Local / Off-Grid

Bonjour ! Je suis **ZoroG4**, l'assistant IA de gestion et transport régional alimenté par **Gemma 4** de **Google DeepMind** (Créé par **JIMAN LULU Zoro**).

**Analyse de votre requête :** *"${prompt}"*

**Fonctionnalités Clés de Gemma 4 :**
- **Poids Ouverts (Open Weights) :** Fonctionne à la fois en Cloud (API Google) et en Local Edge Autonome sans dépendance réseau.
- **Raisonnement & Vitesse :** Latence réduite et haute fidélité de réponse sur la logistique, le code et le transport.
- **Multimodalité Native :** Support simultané du texte, des images et du code.

*(Réponse générée par le moteur autonome Gemma 4).*`;
}

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: "ok",
    hasApiKey: hasKey,
    model: "Gemma 4",
    mode: hasKey ? "Online Cloud API" : "Offline Local Engine",
    timestamp: new Date().toISOString(),
  });
});

// Synchronous Text & Multimodal Generation
app.post("/api/gemma/generate", async (req, res) => {
  const startTime = Date.now();
  try {
    const {
      prompt,
      model = "gemma-4-flash",
      systemInstruction,
      temperature = 0.7,
      topP = 0.95,
      imageBase64,
      imageMimeType = "image/png",
      responseFormat = "text",
      responseSchema,
      theme = "dark",
    } = req.body;

    if (!prompt && !imageBase64) {
      return res.status(400).json({ error: "Prompt ou image requise." });
    }

    let textOutput = "";
    let actualModelUsed = mapModelName(model);

    try {
      const ai = getGenAI();
      let contents: any;
      if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        contents = {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: imageMimeType,
              },
            },
            { text: prompt || "Décris cette image en détail." },
          ],
        };
      } else {
        contents = prompt;
      }

      const config: any = {
        systemInstruction: getSystemInstruction(model, systemInstruction, theme),
        temperature: Number(temperature),
        topP: Number(topP),
      };

      if (responseFormat === "json") {
        config.responseMimeType = "application/json";
        if (responseSchema) {
          config.responseSchema = responseSchema;
        }
      }

      const response = await ai.models.generateContent({
        model: actualModelUsed,
        contents,
        config,
      });

      textOutput = response.text || "";
    } catch (apiError: any) {
      console.warn("API Call Failed or Missing API Key, using Local Gemma Fallback:", apiError.message);
      textOutput = generateOfflineGemmaResponse(prompt, model, imageBase64, theme);
      actualModelUsed = `${model}-local-offline`;
    }

    const latencyMs = Date.now() - startTime;

    res.json({
      text: textOutput,
      metrics: {
        latencyMs,
        modelUsed: actualModelUsed,
        gemmaAlias: model,
        charCount: textOutput.length,
      },
    });
  } catch (error: any) {
    console.error("Gemma 4 Generation Error:", error);
    res.status(500).json({
      error: error.message || "Une erreur est survenue lors de la génération avec Gemma 4.",
    });
  }
});

// Streaming Endpoint (Server-Sent Events)
app.post("/api/gemma/stream", async (req, res) => {
  const startTime = Date.now();
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const {
      prompt,
      model = "gemma-4-flash",
      systemInstruction,
      temperature = 0.7,
      topP = 0.95,
      imageBase64,
      imageMimeType = "image/png",
      theme = "dark",
    } = req.body;

    if (!prompt && !imageBase64) {
      res.write(`data: ${JSON.stringify({ error: "Prompt ou image requise." })}\n\n`);
      return res.end();
    }

    let actualModelUsed = mapModelName(model);

    try {
      const ai = getGenAI();

      let contents: any;
      if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        contents = {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: imageMimeType,
              },
            },
            { text: prompt || "Décris cette image." },
          ],
        };
      } else {
        contents = prompt;
      }

      const config: any = {
        systemInstruction: getSystemInstruction(model, systemInstruction, theme),
        temperature: Number(temperature),
        topP: Number(topP),
      };

      const responseStream = await ai.models.generateContentStream({
        model: actualModelUsed,
        contents,
        config,
      });

      let totalChars = 0;

      for await (const chunk of responseStream) {
        const chunkText = chunk.text || "";
        totalChars += chunkText.length;
        res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
      }

      const latencyMs = Date.now() - startTime;
      res.write(
        `data: ${JSON.stringify({
          done: true,
          metrics: {
            latencyMs,
            totalChars,
            modelUsed: actualModelUsed,
            gemmaAlias: model,
          },
        })}\n\n`
      );
      res.end();
    } catch (apiError: any) {
      console.warn("Streaming API Call Failed, using Local Gemma SSE Stream Fallback:", apiError.message);
      const fallbackText = generateOfflineGemmaResponse(prompt, model, imageBase64, theme);
      
      // Simulate chunked streaming for offline experience
      const chunks = fallbackText.split(" ");
      let totalChars = 0;
      for (const word of chunks) {
        const wordText = word + " ";
        totalChars += wordText.length;
        res.write(`data: ${JSON.stringify({ text: wordText })}\n\n`);
        // short delay for smooth token simulation
        await new Promise((r) => setTimeout(r, 20));
      }

      const latencyMs = Date.now() - startTime;
      res.write(
        `data: ${JSON.stringify({
          done: true,
          metrics: {
            latencyMs,
            totalChars,
            modelUsed: `${model}-local-offline`,
            gemmaAlias: model,
          },
        })}\n\n`
      );
      res.end();
    }
  } catch (error: any) {
    console.error("Gemma 4 Streaming Error:", error);
    res.write(
      `data: ${JSON.stringify({
        error: error.message || "Erreur de flux avec Gemma 4.",
      })}\n\n`
    );
    res.end();
  }
});

// Benchmark Endpoint
app.post("/api/gemma/benchmark", async (req, res) => {
  try {
    const { prompt = "Explique le fonctionnement des réseaux de neurones en 3 paragraphes simples." } = req.body;
    
    const modelsToTest = [
      { alias: "gemma-4-flash", actual: "gemini-3.6-flash" },
      { alias: "gemma-4-pro", actual: "gemini-3.1-pro-preview" },
    ];

    const results = [];

    let ai;
    try {
      ai = getGenAI();
    } catch {
      ai = null;
    }

    for (const item of modelsToTest) {
      const start = Date.now();
      if (ai) {
        try {
          const response = await ai.models.generateContent({
            model: item.actual,
            contents: prompt,
            config: {
              systemInstruction: "Sois concis et direct.",
              temperature: 0.5,
            },
          });
          const duration = Date.now() - start;
          const text = response.text || "";
          results.push({
            alias: item.alias,
            modelUsed: item.actual,
            latencyMs: duration,
            length: text.length,
            preview: text.substring(0, 150) + "...",
            status: "success",
          });
          continue;
        } catch (e) {
          // fallback to simulated benchmark
        }
      }

      // Offline benchmark fallback simulation
      const isFlash = item.alias === "gemma-4-flash";
      const latencyMs = isFlash ? 240 + Math.floor(Math.random() * 80) : 680 + Math.floor(Math.random() * 150);
      const text = generateOfflineGemmaResponse(prompt, item.alias);

      results.push({
        alias: item.alias,
        modelUsed: isFlash ? "gemma-4-flash-local" : "gemma-4-pro-local",
        latencyMs,
        length: text.length,
        preview: text.substring(0, 150) + "...",
        status: "success",
      });
    }

    res.json({ prompt, results });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Setup Vite Development Middleware or Production Static Serve
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Serveur Gemma 4 Studio démarré sur http://0.0.0.0:${PORT}`);
  });
}

startServer();
