export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  streaming?: boolean;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  avatar?: string;
  personality: {
    traits: string[];
    speakingStyle: string;
    examples?: string[];
  };
  color?: string;
}

export interface ChatSession {
  id: string;
  personaId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StreamingState {
  isStreaming: boolean;
  currentMessageId?: string;
  partialContent?: string;
}