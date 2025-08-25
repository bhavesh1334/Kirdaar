import { useState, useCallback } from 'react';
import { Message, Persona, StreamingState } from '@/types/chat';
import { openaiService } from '@/services/openai';
import { toast } from '@/hooks/use-toast';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingState, setStreamingState] = useState<StreamingState>({
    isStreaming: false
  });

  const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addMessage = useCallback((role: 'user' | 'assistant', content: string): Message => {
    const message: Message = {
      id: generateMessageId(),
      role,
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, message]);
    return message;
  }, []);

  const updateMessage = useCallback((messageId: string, content: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, content } : msg
    ));
  }, []);

  const sendMessage = useCallback(async (content: string, persona: Persona) => {
    if (!openaiService.isConfigured()) {
      toast({
        title: "API Key Required",
        description: "Please set your OpenAI API key to start chatting.",
        variant: "destructive"
      });
      return;
    }

    // Add user message
    const userMessage = addMessage('user', content);
    
    // Create assistant message placeholder
    const assistantMessage = addMessage('assistant', '');
    
    // Start streaming
    setStreamingState({
      isStreaming: true,
      currentMessageId: assistantMessage.id,
      partialContent: ''
    });

    try {
      let fullResponse = '';
      
      const stream = openaiService.streamChatCompletion(
        [...messages, userMessage],
        persona,
        (partialContent) => {
          setStreamingState(prev => ({
            ...prev,
            partialContent
          }));
          updateMessage(assistantMessage.id, partialContent);
        }
      );

      for await (const chunk of stream) {
        fullResponse += chunk;
      }

      // Finalize the response
      updateMessage(assistantMessage.id, fullResponse);
      
    } catch (error) {
      console.error('Chat error:', error);
      
      // Remove the failed assistant message
      setMessages(prev => prev.filter(msg => msg.id !== assistantMessage.id));
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response from AI",
        variant: "destructive"
      });
    } finally {
      setStreamingState({
        isStreaming: false
      });
    }
  }, [messages, addMessage, updateMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setStreamingState({ isStreaming: false });
  }, []);

  const setApiKey = useCallback((apiKey: string) => {
    openaiService.setApiKey(apiKey);
    toast({
      title: "API Key Set",
      description: "You can now start chatting with AI personas!",
    });
  }, []);

  return {
    messages,
    streamingState,
    sendMessage,
    clearMessages,
    setApiKey,
    isConfigured: openaiService.isConfigured()
  };
}