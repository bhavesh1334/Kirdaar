import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PersonaSelector } from './PersonaSelector';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useChat } from '@/hooks/useChat';
import { defaultPersonas } from '@/data/personas';
import { Persona } from '@/types/chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { RotateCcw, PanelLeft, PanelRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

export function ChatInterface() {
  const { personaId } = useParams<{ personaId: string }>();
  const navigate = useNavigate();
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    streamingState,
    sendMessage,
    clearMessages,
    loadMessages,
    setApiKey,
    isConfigured
  } = useChat();

  // Set the selected persona based on URL parameter
  React.useEffect(() => {
    const loadPersona = async () => {
      if (!personaId) {
        setError('No persona ID provided');
        setIsLoading(false);
        navigate('/');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const persona = defaultPersonas.find(p => p.id === personaId);
        
        if (!persona) {
          throw new Error(`Persona with ID ${personaId} not found`);
        }

        // Ensure persona has required fields
        const validPersona: Persona = {
          ...persona,
          personality: {
            traits: persona.personality?.traits || [],
            speakingStyle: persona.personality?.speakingStyle || '',
            examples: persona.personality?.examples || []
          },
          avatar: persona.avatar || '',
          color: persona.color || 'hsl(0, 0%, 50%)'
        };

        setSelectedPersona(validPersona);
        await loadMessages(personaId);
      } catch (err) {
        console.error('Error loading persona:', err);
        setError(err instanceof Error ? err.message : 'Failed to load persona');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    loadPersona();
  }, [personaId, navigate, loadMessages]);

  // Auto-set the provided API key from environment variables
  React.useEffect(() => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (apiKey) {
      setApiKey(apiKey);
    } else {
      console.warn('No OpenAI API key found in environment variables');
    }
  }, [setApiKey]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingState.partialContent]);

  const handleSendMessage = async (content: string) => {
    await sendMessage(content, selectedPersona);
  };

  const handlePersonaChange = (persona: Persona) => {
    navigate(`/chat/${persona.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-primary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading persona...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-primary">
        <div className="text-center p-6 max-w-md bg-red-900/20 rounded-lg">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-red-200 mb-4">{error}</p>
          <Button onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!selectedPersona) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-primary">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">No Persona Selected</h2>
          <p className="mb-4">Please select a persona to start chatting</p>
          <Button onClick={() => navigate('/')}>
            Choose a Persona
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-primary" key={`chat-${personaId}`}>
      {/* Persona Selector Sidebar */}
      <div className={cn(
        "border-r border-border bg-gradient-surface backdrop-blur-xl shadow-lg transition-all duration-300 ease-in-out",
        sidebarOpen ? "w-[20rem]" : "w-0 overflow-hidden"
      )}>
        <PersonaSelector
          personas={defaultPersonas}
          selectedPersona={selectedPersona}
          onPersonaChange={handlePersonaChange}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-6 px-4 border-b border-border bg-gradient-surface/30 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-foreground/60 hover:text-foreground hover:bg-primary/10 transition-all duration-300"
            >
              {sidebarOpen ? <PanelRight size={32} /> : <PanelLeft  size={32}/>}
            </Button>
            {selectedPersona && (
              <>
                <img 
                  src={selectedPersona.avatar} 
                  alt={selectedPersona.name}
                  className="w-12 h-12 rounded-full ring-2 ring-primary/30 shadow-lg"
                />
                <div>
                  <h2 className="text-xl font-bold text-foreground">{selectedPersona.name}</h2>
                  <p className="text-sm text-foreground/70 line-clamp-2">{selectedPersona.description}</p>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearMessages}
              className="text-foreground/60 hover:text-foreground hover:bg-destructive/10 transition-all duration-300"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 bg-[#332f36]" ref={scrollAreaRef}>
          <div className="space-y-6 max-w-7xl mx-auto m-6">
            {messages.length === 0 ? (
              <div className="text-center text-foreground/50 mt-20 animate-fade-in">
                {/* <img 
                  src={selectedPersona.avatar} 
                  alt={selectedPersona.name}
                  className="w-24 h-24 rounded-full mx-auto mb-6 ring-4 ring-primary/20 shadow"
                /> */}
                <h3 className="text-2xl font-semibold mb-3 text-white">
                  Start a conversation with {selectedPersona.name}
                </h3>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {selectedPersona.personality?.traits?.length ? (
                    selectedPersona.personality.traits.map((trait) => (
                      <span key={trait} className="px-3 capitalize py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {trait}
                      </span>
                    ))
                  ) : (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {selectedPersona.name}'s assistant
                    </span>
                  )}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isStreaming={streamingState.currentMessageId === message.id}
                />
              ))
            )}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="border-t border-border bg-[#332f36] backdrop-blur-xl rounded-lg p-6">
          <div className="max-w-7xl mx-auto">
            <ChatInput 
              onSendMessage={handleSendMessage}
              disabled={streamingState.isStreaming}
              placeholder={`Message ${selectedPersona.name}...`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}