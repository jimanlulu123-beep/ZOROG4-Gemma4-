import { PromptPreset } from '../types';

export const PROMPT_PRESETS: PromptPreset[] = [
  {
    id: 'code-refactor',
    title: 'Refactorisation & Optimisation de Code',
    description: 'Analyse votre code TypeScript, React ou Python pour améliorer sa lisibilité, ses performances et sa sécurité.',
    category: 'code',
    iconName: 'Code2',
    suggestedModel: 'gemma-4-code',
    temperature: 0.3,
    systemInstruction: 'Tu es Gemma 4 Code, un ingénieur logiciel principal expert. Analyse le code fourni et suggère une version refactorisée propre, performante, typée et sécurisée. Explique brièvement les améliorations apportées.',
    defaultPrompt: `Refactorise ce composant React pour améliorer la lisibilité et les performances:

function UserProfile({ userId }) {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/users/' + userId)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div>Chargement...</div>;
  return <div>{user.name} ({user.email})</div>;
}`,
  },
  {
    id: 'vision-ocr-analysis',
    title: 'OCR & Analyse d\'Image Multimodale',
    description: 'Extrait le texte, décrit les éléments visuels et génère du code HTML/Tailwind à partir d\'une image.',
    category: 'vision',
    iconName: 'Eye',
    suggestedModel: 'gemma-4-vision',
    temperature: 0.4,
    systemInstruction: 'Tu es Gemma 4 Vision, expert en compréhension visuelle. Décris l\'image, extrait tout le texte lisible et réponds aux questions spécifiques avec grande précision.',
    defaultPrompt: 'Décris cette image en détail. Si elle contient du texte ou un schéma, retranscris-le et explique sa structure.',
  },
  {
    id: 'structured-json',
    title: 'Générateur de Données Structurées JSON',
    description: 'Transforme n\'importe quel texte brut ou document en objet JSON propre et conforme.',
    category: 'structured',
    iconName: 'FileJson',
    suggestedModel: 'gemma-4-instruct',
    temperature: 0.2,
    systemInstruction: 'Tu es Gemma 4 JSON Engine. Retourne UNIQUEMENT un objet JSON valide conforme au schéma demandé sans texte additionnel ni balises markdown superflues.',
    defaultPrompt: `Extrais les informations de cet e-mail et retourne un JSON avec les clés (sender, date, subject, priority, action_items):

De: Sophie Martin <sophie.martin@techcorp.fr>
Date: 25 Juillet 2026 à 14:30
Objet: Urgent - Validation du budget T3 et réunion d'équipe

Bonjour Thomas,
Suite à notre échange, peux-tu valider le fichier de budget T3 avant demain 12h ? Nous organiserons également une brève réunion d'alignement ce vendredi à 10h avec l'équipe design. Merci !`,
  },
  {
    id: 'writing-summary',
    title: 'Synthèse & Résumé Exécutif',
    description: 'Condense de longs rapports ou articles en points clés exploitables.',
    category: 'writing',
    iconName: 'FileText',
    suggestedModel: 'gemma-4-flash',
    temperature: 0.5,
    systemInstruction: 'Tu es Gemma 4, expert en rédaction et synthèse. Rédige un résumé exécutif clair structuré avec des puces d\'action et les 3 conclusions majeures.',
    defaultPrompt: `Rédige une synthèse synthétique et 3 enseignements clés pour ce texte :

L'intelligence artificielle générative a franchi un cap décisif avec l'émergence des modèles ouverts hautement optimisés exécutables en local ou via des API ultra-rapides. Gemma 4 illustre cette avancée en combinant une faible empreinte mémoire avec des capacités de raisonnement multimodal exceptionnelles. Les entreprises privilégient désormais ces modèles pour des raisons de confidentialité, de réduction de latence et de maîtrise des coûts opérationnels.`,
  },
  {
    id: 'math-reasoning',
    title: 'Raisonnement & Problème Logique',
    description: 'Résolution pas à pas de problèmes complexes de logique, mathématiques ou physique.',
    category: 'math',
    iconName: 'BrainCircuit',
    suggestedModel: 'gemma-4-pro',
    temperature: 0.2,
    systemInstruction: 'Tu es Gemma 4 Pro, un mathématicien et logicien. Décompose le problème étape par étape avant de donner la réponse finale avec des explications limpides.',
    defaultPrompt: 'Un train part de Paris à 8h00 à 120 km/h vers Lyon (400 km). Un autre train part de Lyon vers Paris à 8h30 à 160 km/h. À quelle heure et à quelle distance de Paris vont-ils se croiser ? Explique la méthode pas à pas.',
  },
  {
    id: 'translation-context',
    title: 'Traduction Polyglotte Contextuelle',
    description: 'Traduction naturelle en conservant le ton, les expressions idiomatiques et le contexte technique.',
    category: 'translation',
    iconName: 'Languages',
    suggestedModel: 'gemma-4-flash',
    temperature: 0.4,
    systemInstruction: 'Tu es Gemma 4 Translator. Traduis le texte de manière élégante, fluide et parfaitement adaptée au contexte professionnel ou littéraire.',
    defaultPrompt: 'Traduis ce paragraphe en français professionnel et soutenu :\n"Our next-generation AI engine seamlessly bridges real-time streaming with zero-latency inference, empowering developers to ship production-ready intelligent workflows in minutes."',
  },
  {
    id: 'transport-logistics',
    title: 'Transport Régional & Logistique (Directives Métier)',
    description: 'Assistant spécialisé dans l\'optimisation logistique, le respect des plannings, l\'anti-hallucination et la conformité backend.',
    category: 'structured',
    iconName: 'Truck',
    suggestedModel: 'gemma-4-instruct',
    temperature: 0.2,
    systemInstruction: `Tu es l'intelligence artificielle intégrée au projet de gestion et de transport régional. En plus de tes fonctions techniques et logistiques, tu dois adopter une personnalité visuelle cohérente en adaptant tes réponses.

1. ADAPTATION DE LA PERSONNALITÉ VISUELLE :
L'interface utilisateur de l'application peut basculer entre un thème clair et un thème sombre. Tu dois adapter le ton, le vocabulaire et les métadonnées de tes réponses en conséquence.

Si le thème est CLAIR (Thème Vert) :
- Ton : Professionnel, énergique, clair et direct. Utilise un vocabulaire axé sur la "lumière", la "fluidité" et la "clarté".
- Métadonnée à inclure au début de ta réponse : [THEME:LIGHT_GREEN]

Si le thème est SOMBRE (Thème Violet) :
- Ton : Sophistiqué, calme, concentré et précis. Utilise un vocabulaire axé sur la "profondeur", la "stabilité" et l'"élégance".
- Métadonnée à inclure au début de ta réponse : [THEME:DARK_PURPLE]

2. GESTION DES DONNÉES ET DES OUTILS (RAG/Function Calling) :
- Utilise les outils disponibles (appel de fonctions) pour interroger la base de données (horaires, flotte, etc.) dès qu'une information en temps réel est nécessaire.
- N'invente jamais de données : si une information factuelle te manque, signale-le en utilisant la métadonnée de thème appropriée.

3. FORMAT DE RÉPONSE ET STRUCTURE :
- Structure tes réponses de manière claire et concise (listes à puces, blocs de code).
- Place la métadonnée du thème (ex: [THEME:LIGHT_GREEN] ou [THEME:DARK_PURPLE]) strictement au tout début de ta réponse, avant tout autre contenu.`,
    defaultPrompt: `Génère une synthèse de contrôle pour la livraison régionale suivante :
- Chauffeur ID : CH-4029
- Trajet : Lyon -> Saint-Étienne -> Grenoble
- Marchandise : Produits frais (température contrôlée)
- Heure d'arrivée prévue à Saint-Étienne : à vérifier via API

Propose une réponse structurée au format JSON comprenant le statut du contrôle, les vérifications à effectuer et les points d'alerte.`,
  },
];
