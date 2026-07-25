export type Gemma4Model =
  | 'gemma-4-flash'
  | 'gemma-4-pro'
  | 'gemma-4-vision'
  | 'gemma-4-code'
  | 'gemma-4-instruct';

export type StudioTab =
  | 'playground'
  | 'vision'
  | 'code'
  | 'prompts'
  | 'benchmark'
  | 'about'
  | 'settings';

export type AppTheme = 'dark' | 'light';

export interface ChatMetrics {
  latencyMs: number;
  totalChars?: number;
  modelUsed: string;
  gemmaAlias: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  image?: string;
  metrics?: ChatMetrics;
  isStreaming?: boolean;
  error?: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  model: Gemma4Model;
  systemInstruction: string;
  temperature: number;
  topP: number;
}

export interface PromptPreset {
  id: string;
  title: string;
  description: string;
  category: 'code' | 'writing' | 'math' | 'vision' | 'structured' | 'translation';
  iconName: string;
  systemInstruction: string;
  defaultPrompt: string;
  suggestedModel: Gemma4Model;
  temperature: number;
}

export interface BenchmarkItem {
  alias: Gemma4Model;
  modelUsed: string;
  latencyMs: number;
  length?: number;
  preview?: string;
  status: 'success' | 'failed' | 'pending';
  error?: string;
}
