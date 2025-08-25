import OpenAI from 'openai';
import { Message, Persona } from '@/types/chat';

class OpenAIService {
  private openai: OpenAI | null = null;
  private apiKey: string | null = null;

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    this.openai = new OpenAI({ 
      apiKey,
      dangerouslyAllowBrowser: true // Note: In production, API calls should go through a backend
    });
  }

  isConfigured(): boolean {
    return this.openai !== null && this.apiKey !== null;
  }

  async *streamChatCompletion(
    messages: Message[],
    persona: Persona,
    onUpdate?: (content: string) => void
  ): AsyncGenerator<string, void, unknown> {
    if (!this.openai) {
      throw new Error('OpenAI not configured. Please set your API key.');
    }

    const systemMessage = {
      role: 'system' as const,
      content: persona.systemPrompt
    };

    const chatMessages = [
      systemMessage,
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    try {
      const stream = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: chatMessages,
        stream: true,
        temperature: 0.8,
        max_tokens: 1000,
      });

      let fullContent = '';
      
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || '';
        if (delta) {
          fullContent += delta;
          onUpdate?.(fullContent);
          yield delta;
        }
      }
    } catch (error) {
      console.error('OpenAI streaming error:', error);
      throw error;
    }
  }

  async getChatCompletion(messages: Message[], persona: Persona): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI not configured. Please set your API key.');
    }

    const systemMessage = {
      role: 'system' as const,
      content: persona.systemPrompt
    };

    const chatMessages = [
      systemMessage,
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: chatMessages,
        temperature: 0.8,
        max_tokens: 1000,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI completion error:', error);
      throw error;
    }
  }
}

export const openaiService = new OpenAIService();