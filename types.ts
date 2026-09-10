export interface Message {
  sender: 'user' | 'bot';
  text: string;
  image?: string;
  tokenUsage?: TokenUsage;
  sources?: Source[];
  mediaContent?: {
    url: string;
    mimeType: string;
    type: 'image' | 'video' | 'audio';
  };
  toolCalls?: ToolCallMessage[];
  toolResults?: ToolResultMessage[];
}

export interface Source {
  uri: string;
  title?: string;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface ChatHistoryEntry {
  role: 'user' | 'model' | 'system';
  parts: { text: string }[];
}

export interface ImagePart {
  inlineData: {
    mimeType: string;
    data: string;
  };
}

export type ContentPart = { text: string } | ImagePart;

export enum Type {
  TYPE_UNSPECIFIED = 'TYPE_UNSPECIFIED',
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  INTEGER = 'INTEGER',
  BOOLEAN = 'BOOLEAN',
  ARRAY = 'ARRAY',
  OBJECT = 'OBJECT',
  NULL = 'NULL',
}

export interface ToolParameterSchema {
  type: Type;
  description?: string;
  properties?: { [key: string]: ToolParameterSchema };
  items?: ToolParameterSchema;
  enum?: string[];
  required?: string[];
}

export interface FunctionDeclaration {
  name: string;
  description?: string;
  parameters?: ToolParameterSchema;
}

export interface FunctionCall {
  name: string;
  args: { [key: string]: any };
  id?: string;
}

export interface ToolOutput {
  name: string;
  id?: string;
  response: {
    result: any;
  };
}

export interface ToolCallMessage {
  name: string;
  args: { [key: string]: any };
}

export interface ToolResultMessage {
  name: string;
  result: any;
}

export interface ToolConfig {
  retrievalConfig?: {
    latLng: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface AniDetails {
  age: number;
  physical: string;
  personality: {
    base: string;
    eve: string;
    ara: string;
    modes: string[];
  };
  relationship: string;
  context: string;
  communicationRules: string[];
  affection: string[];
  goal: string;
}

export interface AniCustomization {
  hairstyle: 'twintails' | 'bob' | 'long' | 'ponytail';
  hairColor: 'platinum' | 'pink' | 'blue' | 'black';
  outfit: 'gothic-lolita' | 'casual' | 'school-uniform';
  eyeColor: 'blue' | 'red' | 'green';
}

export interface DamienDetails {
  age: number;
  location: string;
  device: string;
  network: string;
  passions: string;
  profiles: string;
  budget: string;
  aniCustomization: AniCustomization;
  isSexyModeEnabled: boolean;
  mistralApiKeyOverride: string;
  mistralApiUrlOverride: string;
  aniAffectionLevel: number;
  hasConsentedToAutoSexyMode: boolean;
  geminiDailyTokenCap: number;
  geminiMonthlyTokenCap: number;
  mistralDailyTokenCap: number;
  mistralMonthlyTokenCap: number;
}

export enum AiProvider {
  GEMINI = 'gemini',
  MISTRAL = 'mistral',
}

export interface SearchResult {
  provider: AiProvider;
  message: Message;
  index: number;
}

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
